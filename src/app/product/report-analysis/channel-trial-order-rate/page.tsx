'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { DatePicker, ConfigProvider, Button, Select, Pagination, Table } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: dayjs types might be missing
import dayjs from 'dayjs';
// @ts-ignore: echarts types might be missing
import ReactECharts from 'echarts-for-react';

export default function ChannelTrialOrderRatePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 默认日期范围：近30天（从29天前到今天，共30天）
  const getDefaultDateRange = () => {
    const endDate = dayjs();
    const startDate = dayjs().subtract(29, 'day');
    return {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    };
  };

  // 查询条件
  const defaultDates = getDefaultDateRange();
  const [agentCd, setAgentCd] = useState<string>('CTM');
  const [startDate, setStartDate] = useState<string>(defaultDates.startDate);
  const [endDate, setEndDate] = useState<string>(defaultDates.endDate);

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  
  // 存储所有数据用于图表（排除合计行）
  const [chartData, setChartData] = useState<any[]>([]);

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

  // 表格列定义
  const tableColumns: ColumnsType<any> = useMemo(() => {
    return [
      {
        title: '日期',
        dataIndex: '日期',
        key: '日期',
        fixed: 'left',
        width: 120,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          return text;
        },
      },
      {
        title: '试单总请求数',
        dataIndex: '试单总请求数',
        key: '试单总请求数',
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
        title: '试单成功数',
        dataIndex: '试单成功数',
        key: '试单成功数',
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
        title: '试单成功率(%)',
        dataIndex: '试单成功率',
        key: '试单成功率',
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
        title: '下单总请求数',
        dataIndex: '下单总请求数',
        key: '下单总请求数',
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
        title: '下单成功数',
        dataIndex: '下单成功数',
        key: '下单成功数',
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
        title: '下单成功率(%)',
        dataIndex: '下单成功率',
        key: '下单成功率',
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
  }, []);

  const handleQuery = async (toPage?: number, toPageSize?: number) => {
    try {
      setLoading(true);
      setError(null);
      const currentPage = toPage ?? page;
      const currentSize = toPageSize ?? pageSize;
      const params = new URLSearchParams();
      if (agentCd) params.append('agentCd', agentCd);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/report-analysis/channel-trial-order-rate?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRows(json.data.items || []);
        setTotal(json.data.total || 0);
        setPage(currentPage);
        setPageSize(currentSize);
        
        // 获取所有数据用于图表（需要获取所有数据，不分页）
        if (currentPage === 1) {
          const allDataParams = new URLSearchParams();
          if (agentCd) allDataParams.append('agentCd', agentCd);
          if (startDate) allDataParams.append('startDate', startDate);
          if (endDate) allDataParams.append('endDate', endDate);
          allDataParams.append('page', '1');
          allDataParams.append('pageSize', '10000'); // 获取所有数据
          
          const allDataRes = await fetch(`/api/product/report-analysis/channel-trial-order-rate?${allDataParams.toString()}`);
          const allDataJson = await allDataRes.json();
          if (allDataJson.success && allDataJson.data.items) {
            // 过滤掉合计行，只保留普通数据行
            const normalRows = allDataJson.data.items.filter((row: any) => row.__type !== 'total');
            setChartData(normalRows);
          }
        }
      } else {
        setRows([]);
        setTotal(0);
        setChartData([]);
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
    const defaultDates = getDefaultDateRange();
    setAgentCd('CTM');
    setStartDate(defaultDates.startDate);
    setEndDate(defaultDates.endDate);
    setPage(1);
    setPageSize(50);
    setRows([]);
    setTotal(0);
    setChartData([]);
    setError(null);
  };

  // 准备图表数据
  const chartOption = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return {
        title: {
          text: '试单成功率与下单成功率趋势',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['试单成功率', '下单成功率'],
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
          data: [],
        },
        yAxis: {
          type: 'value',
          name: '成功率(%)',
          min: 80,
          max: 100,
          scale: false,
          axisLabel: {
            formatter: '{value}%',
          },
        },
        series: [
          {
            name: '试单成功率',
            type: 'line',
            data: [],
          },
          {
            name: '下单成功率',
            type: 'line',
            data: [],
          },
        ],
      };
    }

    // 按日期排序
    const sortedData = [...chartData].sort((a, b) => {
      const dateA = new Date(a.日期).getTime();
      const dateB = new Date(b.日期).getTime();
      return dateA - dateB;
    });

    const dates = sortedData.map((row) => row.日期);
    const trialSuccessRates = sortedData.map((row) => Number(row.试单成功率) || 0);
    const orderSuccessRates = sortedData.map((row) => Number(row.下单成功率) || 0);

    return {
      title: {
        text: '试单成功率与下单成功率趋势',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            result += `${param.marker}${param.seriesName}: ${param.value.toFixed(2)}%<br/>`;
          });
          return result;
        },
      },
      legend: {
        data: ['试单成功率', '下单成功率'],
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
        data: dates,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        name: '成功率(%)',
        min: 80,
        max: 100,
        scale: false,
        axisLabel: {
          formatter: '{value}%',
        },
      },
      series: [
        {
          name: '试单成功率',
          type: 'line',
          data: trialSuccessRates,
          smooth: true,
          itemStyle: {
            color: '#1890ff',
          },
        },
        {
          name: '下单成功率',
          type: 'line',
          data: orderSuccessRates,
          smooth: true,
          itemStyle: {
            color: '#52c41a',
          },
        },
      ],
    };
  }, [chartData]);

  // 页面加载时自动查询
  useEffect(() => {
    handleQuery(1, pageSize);
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">渠道试单下单率报表</h1>
                <p className="text-gray-600">查看渠道试单下单率统计数据</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">渠道代码</label>
                <Select
                  allowClear
                  showSearch
                  placeholder="选择渠道代码"
                  className="w-full"
                  value={agentCd || undefined}
                  onChange={(val) => setAgentCd(val || 'CTM')}
                  options={[
                    { label: 'HYATT - 凯悦', value: 'HYATT' },
                    { label: 'CHAGDA - Agoda', value: 'CHAGDA' },
                    { label: 'CHMTTG - 美团', value: 'CHMTTG' },
                    { label: 'UCW - 逸扉小程序', value: 'UCW' },
                    { label: 'CHFZLX - 飞猪', value: 'CHFZLX' },
                    { label: 'CHCTRP - 携程', value: 'CHCTRP' },
                    { label: 'UCC - 逸扉万信商旅小程序', value: 'UCC' },
                    { label: 'CHDYRL - 抖音', value: 'CHDYRL' },
                    { label: 'CTM - 商旅大客户', value: 'CTM' },
                    { label: '800333 - 官网', value: '800333' },
                    { label: 'CHDBBK - Booking', value: 'CHDBBK' },
                    { label: 'CHZKTS - 首享会', value: 'CHZKTS' },
                  ]}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
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
            </div>
            <div className="mt-4 flex gap-3">
              <Button type="primary" loading={loading} onClick={() => handleQuery(1, pageSize)}>查询</Button>
              <Button onClick={handleReset}>重置</Button>
            </div>
          </div>

          {/* 已选择条件展示 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {agentCd && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">渠道代码: {agentCd}</span>}
            {startDate && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">开始日期: {startDate}</span>}
            {endDate && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">结束日期: {endDate}</span>}
          </div>

          {/* 图表 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <ReactECharts
              option={chartOption}
              style={{ height: '400px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
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
                return record.日期 || '';
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
