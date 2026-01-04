'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { DatePicker, ConfigProvider, Button, Select, Pagination, Table, Checkbox } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: dayjs types might be missing
import dayjs from 'dayjs';
// @ts-ignore: echarts types might be missing
import ReactECharts from 'echarts-for-react';
// @ts-ignore: xlsx types might be missing
import * as XLSX from 'xlsx';

export default function ChannelMonthlyProductionPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // 查询条件
  const [agentCds, setAgentCds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [hotelCds, setHotelCds] = useState<string[]>([]);
  const [groupCode, setGroupCode] = useState<string | undefined>(undefined);
  const [displayType, setDisplayType] = useState<string>('间夜数'); // 显示类型：全部、间夜数、房费，默认"间夜数"
  const [showGroup, setShowGroup] = useState<boolean>(false); // 是否显示集团数据，默认不勾选

  // 从数据中提取选项（用于下拉框）
  const [hotelCodeOptions, setHotelCodeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [groupCodeOptions, setGroupCodeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [hotelOptionsLoading, setHotelOptionsLoading] = useState<boolean>(true);

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  // 存储所有数据用于图表（排除合计行）
  const [chartData, setChartData] = useState<any[]>([]);

  // 默认日期范围：当前年份
  const getDefaultDateRange = () => {
    const currentYear = dayjs().year();
    return {
      startDate: `${currentYear}-01-01`,
      endDate: `${currentYear}-12-31`,
    };
  };

  const formatNumber = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) return '';
    const fixed = value.toFixed(2);
    const trimmed = fixed.replace(/\.00$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleStartDateChange = (date: any, dateString: string) => {
    setStartDate(dateString || '');
  };

  const handleEndDateChange = (date: any, dateString: string) => {
    setEndDate(dateString || '');
  };

  // 渠道代码选项
  const agentCdOptions = [
    { label: 'WEB - 官网', value: 'WEB' },
    { label: 'CTP - 携程', value: 'CTP' },
    { label: 'MDI - 美团', value: 'MDI' },
    { label: 'OBR - 飞猪', value: 'OBR' },
    { label: 'CTM - 商旅', value: 'CTM' },
    { label: 'WAT - 首享会', value: 'WAT' },
    { label: 'Agoda：AGO', value: 'AGO' },
    { label: '京东：JD', value: 'JD' },
  ];

  // 集团代码选项
  const groupCodeEnumOptions = [
    { label: '建国', value: 'JG' },
    { label: '京伦', value: 'JL' },
    { label: '南苑', value: 'NY' },
    { label: '云荟', value: 'NH' },
    { label: '诺金', value: 'NI' },
    { label: '诺岚', value: 'NU' },
    { label: '凯宾斯基', value: 'KP' },
    { label: '逸扉', value: 'YF' },
    { label: '万信', value: 'WX' },
  ];

  // 合并并去重集团代码选项（根据 value 去重，优先使用 API 返回的选项）
  const mergedGroupCodeOptions = useMemo(() => {
    const allOptions = [...groupCodeEnumOptions, ...groupCodeOptions];
    const uniqueMap = new Map<string, { label: string; value: string }>();
    
    // 先添加枚举选项
    groupCodeEnumOptions.forEach(option => {
      uniqueMap.set(option.value, option);
    });
    
    // 再添加 API 选项（会覆盖相同 value 的枚举选项，因为 API 选项可能包含更详细的信息）
    groupCodeOptions.forEach(option => {
      uniqueMap.set(option.value, option);
    });
    
    return Array.from(uniqueMap.values());
  }, [groupCodeOptions]);

  // 表格列定义
  const tableColumns: ColumnsType<any> = useMemo(() => {
    const monthColumns: ColumnsType<any> = [];
    const months = [
      { key: 'Jan', label: '1月' },
      { key: 'Feb', label: '2月' },
      { key: 'Mar', label: '3月' },
      { key: 'Apr', label: '4月' },
      { key: 'May', label: '5月' },
      { key: 'Jun', label: '6月' },
      { key: 'Jul', label: '7月' },
      { key: 'Aug', label: '8月' },
      { key: 'Sep', label: '9月' },
      { key: 'Oct', label: '10月' },
      { key: 'Nov', label: '11月' },
      { key: 'Dec', label: '12月' },
    ];

    // 根据显示类型决定添加哪些列
    const showRoomCost = displayType === '全部' || displayType === '房费';
    const showRoomNightNum = displayType === '全部' || displayType === '间夜数';

    // 为每个月添加房费和间夜数两列（根据显示类型）
    months.forEach((month) => {
      if (showRoomCost) {
        monthColumns.push({
          title: `${month.label}房费`,
          dataIndex: `${month.key}_RoomCost`,
          key: `${month.key}_RoomCost`,
          width: 120,
          align: 'right',
          render: (value: number, record: any) => {
            const formatted = formatNumber(value || 0);
            if (record.__type === 'total') {
              return <strong>{formatted}</strong>;
            }
            return formatted;
          },
        });
      }
      if (showRoomNightNum) {
        monthColumns.push({
          title: `${month.label}间夜`,
          dataIndex: `${month.key}_RoomNightNum`,
          key: `${month.key}_RoomNightNum`,
          width: 120,
          align: 'right',
          render: (value: number, record: any) => {
            const formatted = formatNumber(value || 0);
            if (record.__type === 'total') {
              return <strong>{formatted}</strong>;
            }
            return formatted;
          },
        });
      }
    });

    const baseColumns = [
      {
        title: '集团/酒店',
        dataIndex: 'GroupOrHotel',
        key: 'GroupOrHotel',
        fixed: 'left' as const,
        width: 150,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          return text;
        },
      },
      {
        title: '渠道代码',
        dataIndex: 'AgentCd',
        key: 'AgentCd',
        width: 120,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          return text;
        },
      },
      {
        title: '类型',
        dataIndex: 'TypeFlag',
        key: 'TypeFlag',
        width: 100,
        render: (text: string, record: any) => {
          const displayText = text === 'Hotel' ? '酒店' : text === 'Group' ? '集团' : text;
          if (record.__type === 'total') {
            return <strong>{displayText}</strong>;
          }
          return displayText;
        },
      },
    ];

    // 根据显示类型添加合计列
    if (showRoomCost) {
      baseColumns.push({
        title: '全年合计房费',
        dataIndex: 'TotalRoomCost',
        key: 'TotalRoomCost',
        width: 150,
        align: 'right' as const,
        render: (text: any, record: any) => {
          const value = Number(text) || 0;
          const formatted = formatNumber(value);
          if (record.__type === 'total') {
            return <strong>{formatted}</strong>;
          }
          return formatted;
        },
      } as any);
    }

    if (showRoomNightNum) {
      baseColumns.push({
        title: '全年合计间夜',
        dataIndex: 'TotalRoomNightNum',
        key: 'TotalRoomNightNum',
        width: 150,
        align: 'right' as const,
        render: (text: any, record: any) => {
          const value = Number(text) || 0;
          const formatted = formatNumber(value);
          if (record.__type === 'total') {
            return <strong>{formatted}</strong>;
          }
          return formatted;
        },
      } as any);
    }

    return [...baseColumns, ...monthColumns];
  }, [displayType]);

  const handleQuery = async (toPage?: number, toPageSize?: number) => {
    try {
      setLoading(true);
      setError(null);
      // 清空旧的图表数据，避免显示旧数据
      setChartData([]);
      
      const currentPage = toPage ?? page;
      // 确保每页至少显示10条
      const requestedSize = toPageSize ?? pageSize;
      const currentSize = Math.max(requestedSize, 10);
      
      // 构建查询参数（用于主查询和图表查询）
      const buildQueryParams = () => {
        const params = new URLSearchParams();
        if (agentCds.length > 0) params.append('agentCds', agentCds.join(','));
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (hotelCds.length > 0) params.append('hotelCds', hotelCds.join(','));
        if (groupCode) params.append('groupCode', groupCode);
        // 传递 showGroup 参数，控制是否显示集团数据
        params.append('showGroup', String(showGroup));
        return params;
      };

      // 主查询（分页数据）
      const params = buildQueryParams();
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/business-analysis/channel-monthly-production?${params.toString()}`);
      const json = await res.json();
      
      if (json.success) {
        setRows(json.data.items || []);
        setTotal(json.data.total || 0);
        setPage(currentPage);
        setPageSize(currentSize);

        // 从 API 响应中获取酒店代码和集团代码选项列表
        if (json.data && json.data.options) {
          if (json.data.options.hotelCodes && json.data.options.hotelCodes.length > 0) {
            setHotelCodeOptions(json.data.options.hotelCodes);
          }
          if (json.data.options.groupCodes && json.data.options.groupCodes.length > 0) {
            setGroupCodeOptions(json.data.options.groupCodes);
          }
          setHotelOptionsLoading(false);
        } else {
          setHotelOptionsLoading(false);
        }

        // 获取所有数据用于图表（使用相同的查询条件，但获取所有数据）
        const allDataParams = buildQueryParams();
        allDataParams.append('page', '1');
        allDataParams.append('pageSize', '10000'); // 获取所有数据
        
        try {
          console.log('[渠道月产量] 获取图表数据，查询参数:', allDataParams.toString());
          const allDataRes = await fetch(`/api/product/business-analysis/channel-monthly-production?${allDataParams.toString()}`);
          const allDataJson = await allDataRes.json();
          console.log('[渠道月产量] 图表数据响应:', allDataJson.success, allDataJson.data?.items?.length || 0);
          
          if (allDataJson.success && allDataJson.data && allDataJson.data.items) {
            // 过滤掉合计行，只保留普通数据行用于图表
            const normalRows = allDataJson.data.items.filter((row: any) => row.__type !== 'total');
            console.log('[渠道月产量] 设置图表数据，行数:', normalRows.length);
            setChartData(normalRows);
          } else {
            console.warn('[渠道月产量] 图表数据获取失败或为空');
            setChartData([]);
          }
        } catch (chartError) {
          console.error('[渠道月产量] 获取图表数据失败:', chartError);
          setChartData([]);
        }
      } else {
        setRows([]);
        setTotal(0);
        setChartData([]);
        setError(json.error || '加载数据失败');
        setHotelOptionsLoading(false);
      }
    } catch (e) {
      console.error('加载数据失败:', e);
      setError('网络请求失败，请检查网络连接');
      setChartData([]);
      setHotelOptionsLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const defaultDates = getDefaultDateRange();
    setStartDate(defaultDates.startDate);
    setEndDate(defaultDates.endDate);
    setAgentCds([]);
    setHotelCds([]);
    setGroupCode(undefined);
    setDisplayType('间夜数'); // 重置为默认值
    setShowGroup(false); // 重置为默认值（不勾选）
    setPage(1);
    setPageSize(10);
    setRows([]);
    setTotal(0);
    setChartData([]);
    setError(null);
  };

  // 导出Excel
  const handleExport = async () => {
    try {
      setExporting(true);
      setError(null);

      // 获取所有数据（不分页）
      const params = new URLSearchParams();
      if (agentCds.length > 0) params.append('agentCds', agentCds.join(','));
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (hotelCds.length > 0) params.append('hotelCds', hotelCds.join(','));
      if (groupCode) params.append('groupCode', groupCode);
      // 传递 showGroup 参数，控制是否显示集团数据
      params.append('showGroup', String(showGroup));
      params.append('page', '1');
      params.append('pageSize', '10000'); // 获取所有数据

      const res = await fetch(`/api/product/business-analysis/channel-monthly-production?${params.toString()}`);
      const json = await res.json();
      
      if (json.success && json.data && json.data.items && json.data.items.length > 0) {
        const allData = json.data.items;
        
        // 根据显示类型决定导出哪些列
        const showRoomCost = displayType === '全部' || displayType === '房费';
        const showRoomNightNum = displayType === '全部' || displayType === '间夜数';

        // 转换数据为Excel格式
        const excelData = allData.map((row: any) => {
          const excelRow: any = {
            '集团/酒店': row.GroupOrHotel || '',
            '渠道代码': row.AgentCd || '',
            '类型': row.TypeFlag === 'Hotel' ? '酒店' : row.TypeFlag === 'Group' ? '集团' : row.TypeFlag || '',
          };

          // 根据显示类型添加合计列
          if (showRoomCost) {
            excelRow['全年合计房费'] = formatNumber(Number(row.TotalRoomCost) || 0);
          }
          if (showRoomNightNum) {
            excelRow['全年合计间夜'] = formatNumber(Number(row.TotalRoomNightNum) || 0);
          }

          // 根据显示类型添加月份列
          const months = [
            { key: 'Jan', label: '1月' },
            { key: 'Feb', label: '2月' },
            { key: 'Mar', label: '3月' },
            { key: 'Apr', label: '4月' },
            { key: 'May', label: '5月' },
            { key: 'Jun', label: '6月' },
            { key: 'Jul', label: '7月' },
            { key: 'Aug', label: '8月' },
            { key: 'Sep', label: '9月' },
            { key: 'Oct', label: '10月' },
            { key: 'Nov', label: '11月' },
            { key: 'Dec', label: '12月' },
          ];

          months.forEach((month) => {
            if (showRoomCost) {
              excelRow[`${month.label}房费`] = formatNumber(Number(row[`${month.key}_RoomCost`]) || 0);
            }
            if (showRoomNightNum) {
              excelRow[`${month.label}间夜`] = formatNumber(Number(row[`${month.key}_RoomNightNum`]) || 0);
            }
          });

          return excelRow;
        });

        // 创建工作簿和工作表
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        // 设置列宽
        const colWidths: any[] = [
          { wch: 15 }, // 集团/酒店
          { wch: 12 }, // 渠道代码
          { wch: 10 }, // 类型
        ];
        
        if (showRoomCost) {
          colWidths.push({ wch: 15 }); // 全年合计房费
        }
        if (showRoomNightNum) {
          colWidths.push({ wch: 15 }); // 全年合计间夜
        }
        
        // 月份列宽
        for (let i = 0; i < 12; i++) {
          if (showRoomCost) {
            colWidths.push({ wch: 12 }); // 房费
          }
          if (showRoomNightNum) {
            colWidths.push({ wch: 12 }); // 间夜
          }
        }
        
        ws['!cols'] = colWidths;
        
        XLSX.utils.book_append_sheet(wb, ws, '渠道月产量');
        
        // 生成文件名
        const dateRange = startDate && endDate ? `${startDate}_${endDate}` : dayjs().format('YYYY-MM-DD');
        const fileName = `渠道月产量_${dateRange}_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
        
        // 下载文件
        XLSX.writeFile(wb, fileName);
      } else {
        setError('导出失败：' + (json.error || '无数据可导出'));
      }
    } catch (e) {
      console.error('导出Excel失败:', e);
      setError('导出Excel失败，请检查网络连接');
    } finally {
      setExporting(false);
    }
  };

  // 根据集团代码加载酒店代码选项列表
  const loadHotelOptionsByGroupCode = async (groupCodeValue?: string) => {
    try {
      setHotelOptionsLoading(true);
      const defaultDates = getDefaultDateRange();
      const params = new URLSearchParams();
      params.append('startDate', defaultDates.startDate);
      params.append('endDate', defaultDates.endDate);
      if (groupCodeValue) {
        params.append('groupCode', groupCodeValue);
      }
      params.append('page', '1');
      params.append('pageSize', '1');
      
      const res = await fetch(`/api/product/business-analysis/channel-monthly-production?${params.toString()}`);
      const json = await res.json();
      
      if (json.success && json.data && json.data.options) {
        if (json.data.options.hotelCodes && json.data.options.hotelCodes.length > 0) {
          setHotelCodeOptions(json.data.options.hotelCodes);
        } else {
          setHotelCodeOptions([]);
        }
        if (json.data.options.groupCodes && json.data.options.groupCodes.length > 0) {
          setGroupCodeOptions(json.data.options.groupCodes);
        }
      } else {
        setHotelCodeOptions([]);
      }
    } catch (e) {
      console.error('加载酒店代码选项列表失败:', e);
      setHotelCodeOptions([]);
    } finally {
      setHotelOptionsLoading(false);
    }
  };

  // 页面加载时设置默认日期并调用 handleQuery 获取酒店代码选项列表（不显示数据）
  useEffect(() => {
    const initialize = async () => {
      const defaultDates = getDefaultDateRange();
      setStartDate(defaultDates.startDate);
      setEndDate(defaultDates.endDate);
      
      // 调用 handleQuery 获取酒店代码选项列表
      // 使用最小分页参数，查询后清空数据行，只保留选项列表
      await handleQuery(1, 1);
      // 清空数据行，不显示查询结果，只保留选项列表
      setRows([]);
      setTotal(0);
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当集团代码改变时，重新加载酒店代码选项列表
  useEffect(() => {
    if (groupCode) {
      loadHotelOptionsByGroupCode(groupCode);
      // 清空已选择的酒店代码
      setHotelCds([]);
    } else {
      // 如果没有选择集团代码，加载所有酒店代码
      loadHotelOptionsByGroupCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupCode]);

  // 已选择条件展示
  const selectedConditions = useMemo(() => {
    const conditions: string[] = [];
    if (startDate) conditions.push(`开始日期: ${startDate}`);
    if (endDate) conditions.push(`结束日期: ${endDate}`);
    if (agentCds.length > 0) conditions.push(`渠道代码: ${agentCds.join(', ')}`);
    if (hotelCds.length > 0) conditions.push(`酒店代码: ${hotelCds.join(', ')}`);
    if (groupCode) conditions.push(`集团代码: ${groupCode}`);
    if (showGroup) conditions.push(`显示集团: 是`);
    return conditions;
  }, [startDate, endDate, agentCds, hotelCds, groupCode, showGroup]);

  // 准备图表数据
  const chartOption = useMemo(() => {
    // 使用 chartData（所有数据）而不是 rows（分页数据）
    const normalRows = chartData;
    
    if (!normalRows || normalRows.length === 0) {
      return {
        title: {
          text: '渠道月产量间夜数趋势',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: [],
          top: 30,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        },
        yAxis: {
          type: 'value',
          name: '间夜数',
        },
        series: [],
      };
    }

    // 月份字段映射
    const monthFields = [
      { key: 'Jan_RoomNightNum', label: '1月' },
      { key: 'Feb_RoomNightNum', label: '2月' },
      { key: 'Mar_RoomNightNum', label: '3月' },
      { key: 'Apr_RoomNightNum', label: '4月' },
      { key: 'May_RoomNightNum', label: '5月' },
      { key: 'Jun_RoomNightNum', label: '6月' },
      { key: 'Jul_RoomNightNum', label: '7月' },
      { key: 'Aug_RoomNightNum', label: '8月' },
      { key: 'Sep_RoomNightNum', label: '9月' },
      { key: 'Oct_RoomNightNum', label: '10月' },
      { key: 'Nov_RoomNightNum', label: '11月' },
      { key: 'Dec_RoomNightNum', label: '12月' },
    ];

    // 生成系列数据，每条折线代表一行数据
    const series = normalRows.map((row: any, index: number) => {
      // 生成行名称：集团/酒店 - 渠道代码 - 类型
      const rowName = `${row.GroupOrHotel || ''} - ${row.AgentCd || ''} - ${row.TypeFlag === 'Hotel' ? '酒店' : row.TypeFlag === 'Group' ? '集团' : row.TypeFlag || ''}`;
      
      // 提取12个月的间夜数数据
      const data = monthFields.map((field) => Number(row[field.key]) || 0);
      
      // 生成颜色（使用不同颜色区分不同折线）
      const colors = [
        '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
        '#13c2c2', '#eb2f96', '#fa8c16', '#2f54eb', '#a0d911',
        '#fa541c', '#096dd9', '#389e0d', '#d4b106', '#cf1322',
      ];
      const color = colors[index % colors.length];
      
      return {
        name: rowName,
        type: 'line',
        data: data,
        smooth: true,
        itemStyle: {
          color: color,
        },
      };
    });

    // 生成图例数据
    const legendData = normalRows.map((row: any) => {
      return `${row.GroupOrHotel || ''} - ${row.AgentCd || ''} - ${row.TypeFlag === 'Hotel' ? '酒店' : row.TypeFlag === 'Group' ? '集团' : row.TypeFlag || ''}`;
    });

    return {
      title: {
        text: '渠道月产量间夜数趋势',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            result += `${param.marker}${param.seriesName}: ${formatNumber(param.value)}<br/>`;
          });
          return result;
        },
      },
      legend: {
        data: legendData,
        top: 30,
        type: 'scroll',
        orient: 'horizontal',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: monthFields.map(f => f.label),
      },
      yAxis: {
        type: 'value',
        name: '间夜数',
        axisLabel: {
          formatter: (value: number) => {
            return formatNumber(value);
          },
        },
      },
      series: series,
    };
  }, [chartData]);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题和返回按钮 */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">渠道月产量</h1>
                <p className="text-gray-600">查看渠道月产量数据</p>
              </div>
              {/* 右上角返回按钮 */}
              <Link
                href="/product"
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回
              </Link>
            </div>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 查询条件 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  value={startDate ? dayjs(startDate, 'YYYY-MM-DD') : null}
                  onChange={handleStartDateChange as any}
                  placeholder="yyyy-MM-dd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  value={endDate ? dayjs(endDate, 'YYYY-MM-DD') : null}
                  onChange={handleEndDateChange as any}
                  placeholder="yyyy-MM-dd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">渠道代码</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择渠道代码（支持模糊查询）"
                  className="w-full"
                  value={agentCds}
                  onChange={(vals) => setAgentCds(vals as string[])}
                  options={agentCdOptions}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店代码</label>
                <Select
                  mode="tags"
                  allowClear
                  showSearch
                  placeholder="输入或选择酒店代码（支持模糊查询）"
                  className="w-full"
                  value={hotelCds}
                  onChange={(vals) => setHotelCds(vals as string[])}
                  options={hotelCodeOptions}
                  loading={hotelOptionsLoading}
                  filterOption={(input, option) =>
                    ((option?.value as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                  popupRender={(menu) => (
                    <>
                      <div className="px-2 py-1 border-b border-gray-200">
                        <Button
                          type="link"
                          size="small"
                          onClick={() => {
                            const allValues = hotelCodeOptions.map(opt => opt.value);
                            setHotelCds(allValues);
                          }}
                          disabled={hotelOptionsLoading || hotelCodeOptions.length === 0}
                          className="w-full text-left"
                        >
                          全选 ({hotelCodeOptions.length} 项)
                        </Button>
                      </div>
                      {menu}
                    </>
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">集团代码</label>
                <Select
                  allowClear
                  showSearch
                  placeholder="选择集团代码（支持模糊查询）"
                  className="w-full"
                  value={groupCode}
                  onChange={(val) => setGroupCode(val || undefined)}
                  options={mergedGroupCodeOptions}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">显示类型</label>
                <Select
                  allowClear={false}
                  placeholder="选择显示类型"
                  className="w-full"
                  value={displayType}
                  onChange={(val) => setDisplayType(val)}
                  options={[
                    { label: '全部', value: '全部' },
                    { label: '间夜数', value: '间夜数' },
                    { label: '房费', value: '房费' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">显示选项</label>
                <div className="flex items-center">
                  <Checkbox
                    checked={showGroup}
                    onChange={(e) => setShowGroup(e.target.checked)}
                  >
                    显示集团
                  </Checkbox>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button type="primary" loading={loading} onClick={() => handleQuery(1, pageSize)}>查询</Button>
              <Button onClick={handleReset}>重置</Button>
            </div>
          </div>

          {/* 已选择条件展示 */}
          {selectedConditions.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedConditions.map((condition, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                  {condition}
                </span>
              ))}
            </div>
          )}

          {/* 图表 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <ReactECharts
              key={`chart-${chartData.length}-${startDate}-${endDate}-${agentCds.join(',')}-${hotelCds.join(',')}-${groupCode || ''}`}
              option={chartOption}
              style={{ height: '400px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
              notMerge={true}
            />
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4 flex justify-end">
              <Button 
                type="default" 
                loading={exporting} 
                onClick={handleExport}
                disabled={rows.length === 0}
              >
                导出Excel
              </Button>
            </div>
            <Table
              columns={tableColumns}
              dataSource={rows}
              loading={loading}
              rowKey={(record) => {
                if (record.__type === 'total') {
                  return 'total_row';
                }
                return `${record.GroupOrHotel || ''}_${record.AgentCd || ''}_${record.TypeFlag || ''}`;
              }}
              scroll={{ x: 'max-content', y: 520 }}
              pagination={false}
              bordered
            />
            <div className="mt-4 flex flex-col md:flex-row md:items-center justify-end">
              <Pagination
                current={page}
                total={total}
                pageSize={pageSize}
                showSizeChanger
                pageSizeOptions={['10', '50', '100', '1000']}
                showQuickJumper
                onChange={(p, ps) => {
                  // 确保每页至少显示10条
                  const validPageSize = Math.max(ps, 10);
                  handleQuery(p, validPageSize);
                }}
                showTotal={(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`}
              />
            </div>
          </div>

          {/* 右下角返回按钮 */}
          <div className="mt-8 flex justify-end">
            <Link
              href="/product"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回产品中心
            </Link>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
