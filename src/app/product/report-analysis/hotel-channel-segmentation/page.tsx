'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useMemo } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { DatePicker, ConfigProvider, Button, Select, Pagination, Table, Tooltip } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: dayjs types might be missing
import dayjs from 'dayjs';
// @ts-ignore: xlsx types might be missing
import * as XLSX from 'xlsx';
// @ts-ignore: echarts types might be missing
import ReactECharts from 'echarts-for-react';

export default function HotelChannelSegmentationPage() {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询条件
  const [queryDate, setQueryDate] = useState<string>('');
  const [groupCodes, setGroupCodes] = useState<string[]>([]);
  const [channelCodes, setChannelCodes] = useState<string[]>([]);

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(1000);
  
  // 渠道分组统计数据（用于图表）
  const [channelGroupStats, setChannelGroupStats] = useState<any[]>([]);

  const formatNumber = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) return '';
    const fixed = value.toFixed(2);
    const trimmed = fixed.replace(/\.00$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleQueryDateChange = (date: any, dateString: any) => {
    setQueryDate(Array.isArray(dateString) ? (dateString[0] || '') : dateString || '');
  };

  // 表格列定义
  const tableColumns: ColumnsType<any> = useMemo(() => {
    return [
      {
        title: '渠道名称',
        dataIndex: '渠道名称',
        key: '渠道名称',
        fixed: 'left',
        width: 100,
        render: (text: string, record: any) => {
          const code = record.渠道代码 || '';
          const name = text || '';
          return (
            <Tooltip title={`渠道代码: ${code}`}>
              <span>{name}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '酒店名称',
        dataIndex: '酒店名称',
        key: '酒店名称',
        fixed: 'left',
        width: 220,
        render: (text: string, record: any) => {
          const code = record.酒店代码 || '';
          const name = text || '';
          return (
            <Tooltip title={`酒店代码: ${code}`}>
              <span>{name}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '当日',
        key: '当日',
        onHeaderCell: () => ({ className: 'bg-blue-50' }),
        children: [
          {
            title: '间夜',
            dataIndex: '当日间夜数',
            key: '当日间夜数',
            width: 70,
            align: 'right',
            ellipsis: true,
            onHeaderCell: () => ({ className: 'bg-blue-50' }),
            onCell: () => ({ className: 'bg-blue-50' }),
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '客房收入',
            dataIndex: '当日客房收入',
            key: '当日客房收入',
            width: 100,
            align: 'right',
            ellipsis: true,
            onHeaderCell: () => ({ className: 'bg-blue-50' }),
            onCell: () => ({ className: 'bg-blue-50' }),
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '均价',
            key: '当日均价',
            width: 90,
            align: 'right',
            ellipsis: true,
            onHeaderCell: () => ({ className: 'bg-blue-50' }),
            onCell: () => ({ className: 'bg-blue-50' }),
            render: (_: any, record: any) => {
              const 间夜数 = Number(record.当日间夜数) || 0;
              const 客房收入 = Number(record.当日客房收入) || 0;
              const 均价 = 间夜数 > 0 ? 客房收入 / 间夜数 : 0;
              return formatNumber(均价);
            },
          },
        ],
      },
      {
        title: '当月MTD',
        key: '当月MTD',
        onHeaderCell: () => ({ className: 'bg-green-50' }),
        children: [
          {
            title: '间夜',
            dataIndex: '当月MTD间夜数',
            key: '当月MTD间夜数',
            width: 70,
            align: 'right',
            ellipsis: true,
            onHeaderCell: () => ({ className: 'bg-green-50' }),
            onCell: () => ({ className: 'bg-green-50' }),
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '客房收入',
            dataIndex: '当月MTD客房收入',
            key: '当月MTD客房收入',
            width: 120,
            align: 'right',
            ellipsis: true,
            onHeaderCell: () => ({ className: 'bg-green-50' }),
            onCell: () => ({ className: 'bg-green-50' }),
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '均价',
            key: '当月MTD均价',
            width: 90,
            align: 'right',
            ellipsis: true,
            onHeaderCell: () => ({ className: 'bg-green-50' }),
            onCell: () => ({ className: 'bg-green-50' }),
            render: (_: any, record: any) => {
              const 间夜数 = Number(record.当月MTD间夜数) || 0;
              const 客房收入 = Number(record.当月MTD客房收入) || 0;
              const 均价 = 间夜数 > 0 ? 客房收入 / 间夜数 : 0;
              return formatNumber(均价);
            },
          },
        ],
      },
      {
        title: '当年YTD',
        key: '当年YTD',
        onHeaderCell: () => ({ className: 'bg-yellow-50' }),
        children: [
          {
            title: '间夜',
            dataIndex: '当年YTD间夜数',
            key: '当年YTD间夜数',
            width: 70,
            align: 'right',
            ellipsis: true,
            onHeaderCell: () => ({ className: 'bg-yellow-50' }),
            onCell: () => ({ className: 'bg-yellow-50' }),
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '客房收入',
            dataIndex: '当年YTD客房收入',
            key: '当年YTD客房收入',
            width: 120,
            align: 'right',
            ellipsis: true,
            onHeaderCell: () => ({ className: 'bg-yellow-50' }),
            onCell: () => ({ className: 'bg-yellow-50' }),
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '均价',
            key: '当年YTD均价',
            width: 90,
            align: 'right',
            ellipsis: true,
            onHeaderCell: () => ({ className: 'bg-yellow-50' }),
            onCell: () => ({ className: 'bg-yellow-50' }),
            render: (_: any, record: any) => {
              const 间夜数 = Number(record.当年YTD间夜数) || 0;
              const 客房收入 = Number(record.当年YTD客房收入) || 0;
              const 均价 = 间夜数 > 0 ? 客房收入 / 间夜数 : 0;
              return formatNumber(均价);
            },
          },
        ],
      },
    ];
  }, []);

  // 计算渠道分组统计
  const calculateChannelGroupStats = (data: any[]) => {
    // 过滤掉合计行和汇总行
    const normalRows = data.filter(row => row.__type === 'normal');
    
    // 按渠道代码分组
    const channelGroups: Record<string, any[]> = {};
    normalRows.forEach(row => {
      const channelCode = row.渠道代码 || '';
      if (!channelGroups[channelCode]) {
        channelGroups[channelCode] = [];
      }
      channelGroups[channelCode].push(row);
    });

    // 计算每个渠道的汇总
    const groupStats: any[] = [];
    Object.keys(channelGroups).forEach(channelCode => {
      const rows = channelGroups[channelCode];
      const firstRow = rows[0];
      
      const stats = {
        渠道代码: channelCode,
        渠道名称: `${firstRow.渠道名称 || channelCode} - 渠道分组统计`,
        酒店代码: '',
        酒店名称: '',
        当日间夜数: rows.reduce((sum, row) => sum + (Number(row.当日间夜数) || 0), 0),
        当日客房收入: rows.reduce((sum, row) => sum + (Number(row.当日客房收入) || 0), 0),
        当月MTD间夜数: rows.reduce((sum, row) => sum + (Number(row.当月MTD间夜数) || 0), 0),
        当月MTD客房收入: rows.reduce((sum, row) => sum + (Number(row.当月MTD客房收入) || 0), 0),
        当年YTD间夜数: rows.reduce((sum, row) => sum + (Number(row.当年YTD间夜数) || 0), 0),
        当年YTD客房收入: rows.reduce((sum, row) => sum + (Number(row.当年YTD客房收入) || 0), 0),
        __type: 'channelGroup',
      };
      groupStats.push(stats);
    });

    return groupStats;
  };

  // 将数据按渠道分组，并在每个渠道后插入汇总行
  const insertChannelGroupStats = (data: any[], allGroupStats?: any[]) => {
    // 过滤掉合计行和已有的汇总行
    const normalRows = data.filter(row => row.__type === 'normal');
    
    // 使用传入的完整统计，如果没有则计算当前数据的统计
    const groupStats = allGroupStats || calculateChannelGroupStats(data);
    
    // 获取当前页涉及的渠道代码
    const currentPageChannels = new Set(normalRows.map(row => row.渠道代码).filter(Boolean));
    
    // 按渠道代码排序
    normalRows.sort((a, b) => {
      const codeA = a.渠道代码 || '';
      const codeB = b.渠道代码 || '';
      if (codeA !== codeB) {
        return codeA.localeCompare(codeB);
      }
      return (a.酒店代码 || '').localeCompare(b.酒店代码 || '');
    });

    // 构建新数组，在每个渠道的数据后插入汇总行
    const result: any[] = [];
    let currentChannel = '';
    
    normalRows.forEach(row => {
      const rowChannel = row.渠道代码 || '';
      
      // 如果切换到新渠道，先插入上一个渠道的汇总行（使用完整统计）
      if (currentChannel && currentChannel !== rowChannel) {
        const groupStat = groupStats.find(stat => stat.渠道代码 === currentChannel);
        if (groupStat && currentPageChannels.has(currentChannel)) {
          result.push(groupStat);
        }
      }
      
      result.push(row);
      currentChannel = rowChannel;
    });
    
    // 插入最后一个渠道的汇总行（使用完整统计）
    if (currentChannel) {
      const groupStat = groupStats.find(stat => stat.渠道代码 === currentChannel);
      if (groupStat && currentPageChannels.has(currentChannel)) {
        result.push(groupStat);
      }
    }

    // 如果有合计行，放在最前面
    const totalRow = data.find(row => row.__type === 'total');
    if (totalRow) {
      return [totalRow, ...result];
    }
    
    return result;
  };

  const handleQuery = async (toPage?: number, toPageSize?: number) => {
    try {
      setLoading(true);
      setError(null);
      const currentPage = toPage ?? page;
      const currentSize = toPageSize ?? pageSize;
      const params = new URLSearchParams();
      if (queryDate) params.append('queryDate', queryDate);
      if (groupCodes.length) params.append('groupCodes', groupCodes.join(','));
      if (channelCodes.length) params.append('channelCodes', channelCodes.join(','));

      // 先获取所有数据来计算渠道分组统计
      const allDataParams = new URLSearchParams(params);
      allDataParams.append('page', '1');
      allDataParams.append('pageSize', '10000'); // 获取所有数据

      const allDataRes = await fetch(`/api/product/report-analysis/hotel-channel-segmentation?${allDataParams.toString()}`);
      const allDataJson = await allDataRes.json();
      
      if (!allDataJson.success) {
        setRows([]);
        setTotal(0);
        setError(allDataJson.error || '加载数据失败');
        return;
      }

      // 计算所有数据的渠道分组统计
      const allItems = allDataJson.data.items || [];
      const groupStats = calculateChannelGroupStats(allItems);
      // 保存渠道分组统计数据用于图表
      setChannelGroupStats(groupStats);

      // 获取当前页的数据
      const pageParams = new URLSearchParams(params);
      pageParams.append('page', String(currentPage));
      pageParams.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/report-analysis/hotel-channel-segmentation?${pageParams.toString()}`);
      const json = await res.json();
      
      if (json.success) {
        const items = json.data.items || [];
        // 在当前页数据中插入渠道分组统计行（只插入当前页涉及的渠道）
        const itemsWithGroupStats = insertChannelGroupStats(items, groupStats);
        setRows(itemsWithGroupStats);
        setTotal(json.data.total || 0);
        setPage(currentPage);
        setPageSize(currentSize);
      } else {
        setRows([]);
        setTotal(0);
        setError(json.error || '加载数据失败');
      }
    } catch (e) {
      console.error('加载数据失败:', e);
      setError('网络请求失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQueryDate('');
    setGroupCodes([]);
    setChannelCodes([]);
    setPage(1);
    setPageSize(1000);
    setRows([]);
    setTotal(0);
    setChannelGroupStats([]);
    setError(null);
  };

  // 准备饼图数据：当日间夜
  const dailyRoomNightChartOption = useMemo(() => {
    if (channelGroupStats.length === 0) {
      return { title: { text: '当日间夜', left: 'center' }, series: [{ type: 'pie', data: [] }] };
    }

    const chartData = channelGroupStats.map(stat => {
      // 从"渠道名称 - 渠道分组统计"中提取渠道名称
      const channelName = (stat.渠道名称 || '').replace(' - 渠道分组统计', '') || stat.渠道代码 || '未知';
      return {
        name: channelName,
        value: Number(stat.当日间夜数) || 0,
      };
    });

    return {
      title: {
        text: '当日间夜',
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const value = formatNumber(params.value);
          const percent = params.percent;
          return `${params.name}<br/>间夜数: ${value}<br/>占比: ${percent}%`;
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
      },
      series: [
        {
          name: '当日间夜',
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
  }, [channelGroupStats]);

  // 准备饼图数据：当月MTD间夜
  const mtdRoomNightChartOption = useMemo(() => {
    if (channelGroupStats.length === 0) {
      return { title: { text: '当月MTD间夜', left: 'center' }, series: [{ type: 'pie', data: [] }] };
    }

    const chartData = channelGroupStats.map(stat => {
      // 从"渠道名称 - 渠道分组统计"中提取渠道名称
      const channelName = (stat.渠道名称 || '').replace(' - 渠道分组统计', '') || stat.渠道代码 || '未知';
      return {
        name: channelName,
        value: Number(stat.当月MTD间夜数) || 0,
      };
    });

    return {
      title: {
        text: '当月MTD间夜',
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const value = formatNumber(params.value);
          const percent = params.percent;
          return `${params.name}<br/>间夜数: ${value}<br/>占比: ${percent}%`;
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
      },
      series: [
        {
          name: '当月MTD间夜',
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
  }, [channelGroupStats]);

  // 准备饼图数据：当年YTD间夜
  const ytdRoomNightChartOption = useMemo(() => {
    if (channelGroupStats.length === 0) {
      return { title: { text: '当年YTD间夜', left: 'center' }, series: [{ type: 'pie', data: [] }] };
    }

    const chartData = channelGroupStats.map(stat => {
      // 从"渠道名称 - 渠道分组统计"中提取渠道名称
      const channelName = (stat.渠道名称 || '').replace(' - 渠道分组统计', '') || stat.渠道代码 || '未知';
      return {
        name: channelName,
        value: Number(stat.当年YTD间夜数) || 0,
      };
    });

    return {
      title: {
        text: '当年YTD间夜',
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const value = formatNumber(params.value);
          const percent = params.percent;
          return `${params.name}<br/>间夜数: ${value}<br/>占比: ${percent}%`;
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
      },
      series: [
        {
          name: '当年YTD间夜',
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
  }, [channelGroupStats]);

  const handleExport = async () => {
    try {
      setExporting(true);
      setError(null);
      
      // 构建查询参数，获取所有数据（不分页）
      const params = new URLSearchParams();
      if (queryDate) params.append('queryDate', queryDate);
      if (groupCodes.length) params.append('groupCodes', groupCodes.join(','));
      if (channelCodes.length) params.append('channelCodes', channelCodes.join(','));
      params.append('page', '1');
      params.append('pageSize', '10000'); // 设置一个很大的值获取所有数据

      const res = await fetch(`/api/product/report-analysis/hotel-channel-segmentation?${params.toString()}`);
      const json = await res.json();
      
      if (json.success && json.data.items) {
        const allData = json.data.items;
        
        // 准备Excel数据
        const excelData = allData.map((row: any) => {
          // 计算均价
          const 当日均价 = (Number(row.当日间夜数) || 0) > 0 
            ? (Number(row.当日客房收入) || 0) / (Number(row.当日间夜数) || 1) 
            : 0;
          const 当月MTD均价 = (Number(row.当月MTD间夜数) || 0) > 0 
            ? (Number(row.当月MTD客房收入) || 0) / (Number(row.当月MTD间夜数) || 1) 
            : 0;
          const 当年YTD均价 = (Number(row.当年YTD间夜数) || 0) > 0 
            ? (Number(row.当年YTD客房收入) || 0) / (Number(row.当年YTD间夜数) || 1) 
            : 0;

          return {
            '渠道名称': row.渠道名称 || '',
            '酒店名称': row.酒店名称 || '',
            '当日间夜': formatNumber(Number(row.当日间夜数) || 0),
            '当日客房收入': formatNumber(Number(row.当日客房收入) || 0),
            '当日均价': formatNumber(当日均价),
            '当月MTD间夜': formatNumber(Number(row.当月MTD间夜数) || 0),
            '当月MTD客房收入': formatNumber(Number(row.当月MTD客房收入) || 0),
            '当月MTD均价': formatNumber(当月MTD均价),
            '当年YTD间夜': formatNumber(Number(row.当年YTD间夜数) || 0),
            '当年YTD客房收入': formatNumber(Number(row.当年YTD客房收入) || 0),
            '当年YTD均价': formatNumber(当年YTD均价),
          };
        });

        // 创建工作簿和工作表
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        // 设置列宽
        ws['!cols'] = [
          { wch: 15 }, // 渠道名称
          { wch: 20 }, // 酒店名称
          { wch: 12 }, // 当日间夜
          { wch: 15 }, // 当日客房收入
          { wch: 12 }, // 当日均价
          { wch: 12 }, // 当月MTD间夜
          { wch: 15 }, // 当月MTD客房收入
          { wch: 12 }, // 当月MTD均价
          { wch: 12 }, // 当年YTD间夜
          { wch: 15 }, // 当年YTD客房收入
          { wch: 12 }, // 当年YTD均价
        ];
        
        XLSX.utils.book_append_sheet(wb, ws, '酒店渠道细分');
        
        // 生成文件名
        const fileName = `酒店渠道细分_${queryDate || dayjs().format('YYYY-MM-DD')}_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
        
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

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题和返回按钮 */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">酒店渠道细分</h1>
                <p className="text-gray-600">查看酒店渠道细分统计数据</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">查询日期</label>
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  value={queryDate ? dayjs(queryDate, 'YYYY-MM-DD') : null}
                  onChange={handleQueryDateChange as any}
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
                  ]}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">渠道</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择渠道"
                  className="w-full"
                  value={channelCodes}
                  onChange={(vals) => setChannelCodes(vals as string[])}
                  options={[
                    { label: 'CTP - 携程线上', value: 'CTP' },
                    { label: 'MDI - 美团线上', value: 'MDI' },
                    { label: 'OBR - 飞猪线上', value: 'OBR' },
                    { label: 'WEB - 如家官网', value: 'WEB' },
                    { label: 'WAT - 首享会', value: 'WAT' },
                    { label: 'Agoda：AGO', value: 'AGO' },
                    { label: '京东：JD', value: 'JD' },
                  ]}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button type="primary" loading={loading} onClick={() => handleQuery(1, pageSize)}>查询</Button>
              <Button onClick={handleReset}>重置</Button>
              <Button 
                type="default" 
                loading={exporting} 
                onClick={handleExport}
                disabled={!queryDate || exporting}
              >
                导出Excel
              </Button>
            </div>
          </div>

          {/* 已选择条件展示 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {queryDate && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">查询日期: {queryDate}</span>}
            {groupCodes.map(gc => <span key={`gc-${gc}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">管理公司: {gc}</span>)}
            {channelCodes.map(cc => <span key={`cc-${cc}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">渠道: {cc}</span>)}
          </div>

          {/* 饼图 */}
          {channelGroupStats.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <ReactECharts
                    option={dailyRoomNightChartOption}
                    style={{ height: '400px', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                  />
                </div>
                <div>
                  <ReactECharts
                    option={mtdRoomNightChartOption}
                    style={{ height: '400px', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                  />
                </div>
                <div>
                  <ReactECharts
                    option={ytdRoomNightChartOption}
                    style={{ height: '400px', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 表格 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Table
              columns={tableColumns}
              dataSource={rows}
              loading={loading}
              rowKey={(record) => (record.渠道代码 || '') + (record.酒店代码 || '') + (record.__type || '') + Math.random()}
              scroll={{ x: 'max-content', y: 520 }}
              pagination={false}
              bordered
              onRow={(record) => {
                // 为汇总行和渠道分组统计行添加特殊样式
                if (record.__type === 'total' || record.__type === 'channelGroup') {
                  return {
                    className: 'bg-gray-100 font-semibold',
                  };
                }
                return {};
              }}
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
