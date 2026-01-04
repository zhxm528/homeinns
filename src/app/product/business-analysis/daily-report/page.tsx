'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { DatePicker, ConfigProvider, Button, Select, Pagination, Table, Input } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: dayjs types might be missing
import dayjs from 'dayjs';
// @ts-ignore: echarts types might be missing
import ReactECharts from 'echarts-for-react';

export default function DailyReportPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询条件
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [groupCodes, setGroupCodes] = useState<string[]>([]);
  const [hotelCode, setHotelCode] = useState<string | undefined>(undefined);
  const [hotelName, setHotelName] = useState<string | undefined>(undefined);
  const [areas, setAreas] = useState<string[]>([]);
  const [urbanAreas, setUrbanAreas] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // 从数据中提取选项（用于下拉框）
  const [hotelCodeOptions, setHotelCodeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [hotelNameOptions, setHotelNameOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [hotelOptionsLoading, setHotelOptionsLoading] = useState<boolean>(true);

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  // 存储所有数据用于图表（不分页，排除合计行）
  const [allDataForChart, setAllDataForChart] = useState<any[]>([]);

  // 默认日期范围：最近30天
  const getDefaultDateRange = () => {
    const endDate = dayjs();
    const startDate = dayjs().subtract(29, 'day');
    return {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    };
  };

  const formatNumber = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) return '';
    const fixed = value.toFixed(2);
    const trimmed = fixed.replace(/\.00$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatPercentage = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) return '';
    const fixed = value.toFixed(4);
    const trimmed = fixed.replace(/\.0000$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    return trimmed;
  };

  const handleStartDateChange = (date: any, dateString: string) => {
    setStartDate(dateString || '');
  };

  const handleEndDateChange = (date: any, dateString: string) => {
    setEndDate(dateString || '');
  };

  // 表格列定义
  const tableColumns: ColumnsType<any> = useMemo(() => {
    return [
      {
        title: '酒店代码',
        dataIndex: '酒店代码',
        key: '酒店代码',
        fixed: 'left',
        width: 120,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          // 构建跳转URL，传递酒店代码和日期范围
          const hotelCode = text || '';
          const currentStartDate = startDate || '';
          const currentEndDate = endDate || '';
          const linkUrl = `/product/business-analysis/daily-report-days?hotelCode=${encodeURIComponent(hotelCode)}&startDate=${encodeURIComponent(currentStartDate)}&endDate=${encodeURIComponent(currentEndDate)}`;
          return (
            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
              {text}
            </a>
          );
        },
      },
      {
        title: '酒店名称',
        dataIndex: '酒店名称',
        key: '酒店名称',
        width: 260,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          return text;
        },
      },
      {
        title: '管理公司',
        dataIndex: '管理公司',
        key: '管理公司',
        width: 120,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          return text;
        },
      },
      {
        title: 'PMS类型',
        dataIndex: 'PMS类型',
        key: 'PMS类型',
        width: 120,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          return text;
        },
      },
      {
        title: '产权类型',
        dataIndex: '产权类型',
        key: '产权类型',
        width: 120,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          return text;
        },
      },
      {
        title: '城市编码',
        dataIndex: '城市编码',
        key: '城市编码',
        width: 120,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          return text;
        },
      },
      {
        title: '房间总数',
        dataIndex: '房间总数',
        key: '房间总数',
        width: 120,
        align: 'right',
        render: (value: number, record: any) => {
          const formatted = formatNumber(value || 0);
          if (record.__type === 'total') {
            return <strong>{formatted}</strong>;
          }
          return formatted;
        },
      },
      {
        title: '已入住房数',
        dataIndex: '已入住房数',
        key: '已入住房数',
        width: 120,
        align: 'right',
        render: (value: number, record: any) => {
          const formatted = formatNumber(value || 0);
          if (record.__type === 'total') {
            return <strong>{formatted}</strong>;
          }
          return formatted;
        },
      },
      {
        title: '出租率',
        dataIndex: '出租率',
        key: '出租率',
        width: 120,
        align: 'right',
        render: (value: number, record: any) => {
          // 将小数转换为百分比显示（例如：0.5455 -> 54.55%）
          const numValue = value || 0;
          const percentage = (numValue * 100).toFixed(2);
          const formatted = `${percentage}%`;
          if (record.__type === 'total') {
            return <strong>{formatted}</strong>;
          }
          return formatted;
        },
      },
      {
        title: '平均房价',
        dataIndex: '平均房价',
        key: '平均房价',
        width: 120,
        align: 'right',
        render: (value: number, record: any) => {
          const formatted = formatNumber(value || 0);
          if (record.__type === 'total') {
            return <strong>{formatted}</strong>;
          }
          return formatted;
        },
      },
      {
        title: '每房收益',
        dataIndex: '每房收益',
        key: '每房收益',
        width: 120,
        align: 'right',
        render: (value: number, record: any) => {
          const formatted = formatNumber(value || 0);
          if (record.__type === 'total') {
            return <strong>{formatted}</strong>;
          }
          return formatted;
        },
      },
      {
        title: '客房收入',
        dataIndex: '客房收入',
        key: '客房收入',
        width: 120,
        align: 'right',
        render: (value: number, record: any) => {
          const formatted = formatNumber(value || 0);
          if (record.__type === 'total') {
            return <strong>{formatted}</strong>;
          }
          return formatted;
        },
      },
      {
        title: '餐饮收入',
        dataIndex: '餐饮收入',
        key: '餐饮收入',
        width: 120,
        align: 'right',
        render: (value: number, record: any) => {
          const formatted = formatNumber(value || 0);
          if (record.__type === 'total') {
            return <strong>{formatted}</strong>;
          }
          return formatted;
        },
      },
      {
        title: '其他收入',
        dataIndex: '其他收入',
        key: '其他收入',
        width: 120,
        align: 'right',
        render: (value: number, record: any) => {
          const formatted = formatNumber(value || 0);
          if (record.__type === 'total') {
            return <strong>{formatted}</strong>;
          }
          return formatted;
        },
      },
      {
        title: '总收入',
        dataIndex: '总收入',
        key: '总收入',
        width: 120,
        align: 'right',
        render: (value: number, record: any) => {
          const formatted = formatNumber(value || 0);
          if (record.__type === 'total') {
            return <strong>{formatted}</strong>;
          }
          return formatted;
        },
      },
    ];
  }, [startDate, endDate]);

  const handleQuery = async (toPage?: number, toPageSize?: number) => {
    try {
      setLoading(true);
      setError(null);
      // 清空旧的图表数据，避免显示旧数据
      setAllDataForChart([]);
      
      const currentPage = toPage ?? page;
      const currentSize = toPageSize ?? pageSize;
      
      // 构建查询参数（用于主查询和图表查询）
      const buildQueryParams = () => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (groupCodes.length > 0) params.append('groupCodes', groupCodes.join(','));
        if (hotelCode) params.append('hotelCode', hotelCode);
        if (hotelName) params.append('hotelName', hotelName);
        if (areas.length > 0) params.append('areas', areas.join(','));
        if (urbanAreas.length > 0) params.append('urbanAreas', urbanAreas.join(','));
        if (provinces.length > 0) params.append('provinces', provinces.join(','));
        if (cities.length > 0) params.append('cities', cities.join(','));
        return params;
      };

      // 主查询（分页数据）
      const params = buildQueryParams();
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/business-analysis/daily-report?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRows(json.data.items || []);
        setTotal(json.data.total || 0);
        setPage(currentPage);
        setPageSize(currentSize);

        // 从 API 响应中获取酒店编号和酒店名称选项列表
        if (json.data && json.data.options) {
          if (json.data.options.hotelCodes && json.data.options.hotelCodes.length > 0) {
            console.log('[经营日报] 查询后设置酒店代码选项，数量:', json.data.options.hotelCodes.length);
            setHotelCodeOptions(json.data.options.hotelCodes);
          }
          if (json.data.options.hotelNames && json.data.options.hotelNames.length > 0) {
            console.log('[经营日报] 查询后设置酒店名称选项，数量:', json.data.options.hotelNames.length);
            setHotelNameOptions(json.data.options.hotelNames);
          }
          // 确保加载状态被设置为 false
          setHotelOptionsLoading(false);
        } else {
          console.warn('[经营日报] 查询响应中没有选项数据');
          // 即使没有选项数据，也要设置加载状态为 false
          setHotelOptionsLoading(false);
        }

        // 获取所有数据用于图表（使用相同的查询条件，但获取所有数据）
        const allDataParams = buildQueryParams();
        allDataParams.append('page', '1');
        allDataParams.append('pageSize', '10000'); // 获取所有数据
        
        try {
          console.log('[经营日报] 获取图表数据，查询参数:', allDataParams.toString());
          const allDataRes = await fetch(`/api/product/business-analysis/daily-report?${allDataParams.toString()}`);
          const allDataJson = await allDataRes.json();
          console.log('[经营日报] 图表数据响应:', allDataJson.success, allDataJson.data?.items?.length || 0);
          
          if (allDataJson.success && allDataJson.data && allDataJson.data.items) {
            // 过滤掉合计行，只保留普通数据行用于图表
            const normalRows = allDataJson.data.items.filter((row: any) => row.__type !== 'total');
            console.log('[经营日报] 设置图表数据，行数:', normalRows.length);
            setAllDataForChart(normalRows);
          } else {
            console.warn('[经营日报] 图表数据获取失败或为空');
            setAllDataForChart([]);
          }
        } catch (chartError) {
          console.error('[经营日报] 获取图表数据失败:', chartError);
          setAllDataForChart([]);
        }
      } else {
        setRows([]);
        setTotal(0);
        setAllDataForChart([]);
        setError(json.error || '加载数据失败');
        // 即使查询失败，也要设置加载状态为 false
        setHotelOptionsLoading(false);
      }
    } catch (e) {
      console.error('加载数据失败:', e);
      setError('网络请求失败，请检查网络连接');
      setAllDataForChart([]);
      // 即使请求失败，也要设置加载状态为 false
      setHotelOptionsLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const defaultDates = getDefaultDateRange();
    setStartDate(defaultDates.startDate);
    setEndDate(defaultDates.endDate);
    setGroupCodes([]);
    setHotelCode(undefined);
    setHotelName(undefined);
    setAreas([]);
    setUrbanAreas([]);
    setProvinces([]);
    setCities([]);
    setPage(1);
    setPageSize(10);
    setRows([]);
    setTotal(0);
    setAllDataForChart([]);
    setError(null);
  };

  // 加载酒店选项列表（独立于查询，确保下拉框有数据）
  const loadHotelOptions = async () => {
    try {
      setHotelOptionsLoading(true);
      // 使用最小的查询参数来获取选项列表
      const defaultDates = getDefaultDateRange();
      const params = new URLSearchParams();
      params.append('startDate', defaultDates.startDate);
      params.append('endDate', defaultDates.endDate);
      params.append('page', '1');
      params.append('pageSize', '1');
      
      const res = await fetch(`/api/product/business-analysis/daily-report?${params.toString()}`);
      const json = await res.json();
      console.log('[经营日报] 加载酒店选项列表响应:', json);
      
      if (json.success && json.data && json.data.options) {
        console.log('[经营日报] 选项数据:', json.data.options);
        if (json.data.options.hotelCodes && json.data.options.hotelCodes.length > 0) {
          console.log('[经营日报] 设置酒店代码选项，数量:', json.data.options.hotelCodes.length);
          setHotelCodeOptions(json.data.options.hotelCodes);
        } else {
          console.warn('[经营日报] 酒店代码选项为空或未定义');
        }
        if (json.data.options.hotelNames && json.data.options.hotelNames.length > 0) {
          console.log('[经营日报] 设置酒店名称选项，数量:', json.data.options.hotelNames.length);
          setHotelNameOptions(json.data.options.hotelNames);
        } else {
          console.warn('[经营日报] 酒店名称选项为空或未定义');
        }
      } else {
        console.warn('[经营日报] API 响应中没有选项数据:', json);
      }
    } catch (e) {
      console.error('加载酒店选项列表失败:', e);
    } finally {
      setHotelOptionsLoading(false);
    }
  };

  // 准备饼图数据：按产权类型分组统计总收入
  const propertyTypeChartOption = useMemo(() => {
    // 使用所有数据（不分页）用于图表
    const normalRows = allDataForChart;
    
    // 按产权类型分组统计总收入
    const groupedData: Record<string, number> = {};
    normalRows.forEach((row: any) => {
      const propertyType = row.产权类型 || '未知';
      const totalRevenue = Number(row.总收入) || 0;
      groupedData[propertyType] = (groupedData[propertyType] || 0) + totalRevenue;
    });

    // 转换为饼图数据格式
    const chartData = Object.entries(groupedData).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }));

    return {
      title: {
        text: '按产权类型统计总收入',
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const value = formatNumber(params.value);
          const percent = params.percent;
          return `${params.name}<br/>总收入: ${value}<br/>占比: ${percent}%`;
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
      },
      series: [
        {
          name: '总收入',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c}\n({d}%)',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          data: chartData,
        },
      ],
    };
  }, [allDataForChart]);

  // 准备饼图数据：按管理公司分组统计总收入
  const groupCodeChartOption = useMemo(() => {
    // 使用所有数据（不分页）用于图表
    const normalRows = allDataForChart;
    
    // 按管理公司分组统计总收入
    const groupedData: Record<string, number> = {};
    normalRows.forEach((row: any) => {
      const groupCode = row.管理公司 || '未知';
      const totalRevenue = Number(row.总收入) || 0;
      groupedData[groupCode] = (groupedData[groupCode] || 0) + totalRevenue;
    });

    // 转换为饼图数据格式
    const chartData = Object.entries(groupedData).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }));

    return {
      title: {
        text: '按管理公司统计总收入',
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const value = formatNumber(params.value);
          const percent = params.percent;
          return `${params.name}<br/>总收入: ${value}<br/>占比: ${percent}%`;
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
      },
      series: [
        {
          name: '总收入',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c}\n({d}%)',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          data: chartData,
        },
      ],
    };
  }, [allDataForChart]);

  // 准备饼图数据：按PMS类型分组统计总收入
  const pmsTypeChartOption = useMemo(() => {
    // 使用所有数据（不分页）用于图表
    const normalRows = allDataForChart;
    
    // 按PMS类型分组统计总收入
    const groupedData: Record<string, number> = {};
    normalRows.forEach((row: any) => {
      const pmsType = row.PMS类型 || '未知';
      const totalRevenue = Number(row.总收入) || 0;
      groupedData[pmsType] = (groupedData[pmsType] || 0) + totalRevenue;
    });

    // 转换为饼图数据格式
    const chartData = Object.entries(groupedData).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }));

    return {
      title: {
        text: '按PMS类型统计总收入',
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const value = formatNumber(params.value);
          const percent = params.percent;
          return `${params.name}<br/>总收入: ${value}<br/>占比: ${percent}%`;
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
      },
      series: [
        {
          name: '总收入',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c}\n({d}%)',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          data: chartData,
        },
      ],
    };
  }, [allDataForChart]);

  // 页面加载时自动查询和加载选项列表
  useEffect(() => {
    const initialize = async () => {
      const defaultDates = getDefaultDateRange();
      setStartDate(defaultDates.startDate);
      setEndDate(defaultDates.endDate);
      // 先加载酒店选项列表，等待完成后再执行查询
      await loadHotelOptions();
      // 然后执行查询
      handleQuery(1, 10);
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题和返回按钮 */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">经营日报</h1>
                <p className="text-gray-600">查看经营日报数据</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">管理公司</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择管理公司"
                  className="w-full"
                  value={groupCodes}
                  onChange={(vals) => setGroupCodes(vals as string[])}
                  options={[
                    { label: 'JG - 建国', value: 'JG' },
                    { label: 'JL - 京伦', value: 'JL' },
                    { label: 'NY - 南苑', value: 'NY' },
                    { label: 'NH - 云荟', value: 'NH' },
                    { label: 'NI - 诺金', value: 'NI' },
                    { label: 'NU - 诺岚', value: 'NU' },
                    { label: 'KP - 凯宾斯基', value: 'KP' },
                    { label: 'YF - 逸扉', value: 'YF' },
                    { label: 'WX - 万信', value: 'WX' },
                  ]}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店代码</label>
                <Select
                  allowClear
                  showSearch
                  placeholder="选择或输入酒店代码（支持自查询）..."
                  className="w-full"
                  value={hotelCode}
                  onChange={(val) => setHotelCode(val || undefined)}
                  options={hotelCodeOptions}
                  loading={hotelOptionsLoading}
                  notFoundContent={hotelOptionsLoading ? '加载中...' : hotelCodeOptions.length === 0 ? '无数据' : undefined}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店名称</label>
                <Select
                  allowClear
                  showSearch
                  placeholder="选择或输入酒店名称（支持自查询）..."
                  className="w-full"
                  value={hotelName}
                  onChange={(val) => setHotelName(val || undefined)}
                  options={hotelNameOptions}
                  loading={hotelOptionsLoading}
                  notFoundContent={hotelOptionsLoading ? '加载中...' : hotelNameOptions.length === 0 ? '无数据' : undefined}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">区域</label>
                <Select
                  mode="tags"
                  allowClear
                  showSearch
                  placeholder="输入或选择区域（支持模糊查询）"
                  className="w-full"
                  value={areas}
                  onChange={(vals) => setAreas(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.value as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">城市区域</label>
                <Select
                  mode="tags"
                  allowClear
                  showSearch
                  placeholder="输入或选择城市区域（支持模糊查询）"
                  className="w-full"
                  value={urbanAreas}
                  onChange={(vals) => setUrbanAreas(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.value as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">省份</label>
                <Select
                  mode="tags"
                  allowClear
                  showSearch
                  placeholder="输入或选择省份（支持模糊查询）"
                  className="w-full"
                  value={provinces}
                  onChange={(vals) => setProvinces(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.value as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
                <Select
                  mode="tags"
                  allowClear
                  showSearch
                  placeholder="输入或选择城市（支持模糊查询）"
                  className="w-full"
                  value={cities}
                  onChange={(vals) => setCities(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.value as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button type="primary" loading={loading} onClick={() => handleQuery(1, pageSize)}>查询</Button>
              <Button onClick={handleReset}>重置</Button>
            </div>
          </div>

          {/* 已选择条件展示 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {startDate && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">开始日期: {startDate}</span>}
            {endDate && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">结束日期: {endDate}</span>}
            {groupCodes.length > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">管理公司: {groupCodes.join(', ')}</span>}
            {hotelCode && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">酒店代码: {hotelCode}</span>}
            {hotelName && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-pink-100 text-pink-700">酒店名称: {hotelName}</span>}
            {areas.length > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">区域: {areas.join(', ')}</span>}
            {urbanAreas.length > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-teal-100 text-teal-700">城市区域: {urbanAreas.join(', ')}</span>}
            {provinces.length > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700">省份: {provinces.join(', ')}</span>}
            {cities.length > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-cyan-100 text-cyan-700">城市: {cities.join(', ')}</span>}
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Table
              columns={tableColumns}
              dataSource={rows}
              loading={loading}
              rowKey={(record) => {
                if (record.__type === 'total') {
                  return 'total_row';
                }
                return `${record.酒店代码 || ''}_${record.酒店名称 || ''}_${record.管理公司 || ''}`;
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
                onChange={(p, ps) => handleQuery(p, ps)}
                showTotal={(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`}
              />
            </div>
          </div>

          {/* 饼图统计 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 按产权类型统计 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <ReactECharts
                  option={propertyTypeChartOption}
                  style={{ height: '400px', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                  notMerge={true}
                />
              </div>
              
              {/* 按管理公司统计 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <ReactECharts
                  option={groupCodeChartOption}
                  style={{ height: '400px', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                  notMerge={true}
                />
              </div>
              
              {/* 按PMS类型统计 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <ReactECharts
                  option={pmsTypeChartOption}
                  style={{ height: '400px', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                  notMerge={true}
                />
              </div>
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
