'use client';

import { useState, useMemo } from 'react';
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

export default function CountryMonthStatisticsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询条件 - 年月格式 yyyy-MM
  const [month, setMonth] = useState<string>('');
  const [regions, setRegions] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [hotel, setHotel] = useState<string>('');

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const formatNumber = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) return '';
    const fixed = value.toFixed(2);
    const trimmed = fixed.replace(/\.00$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleMonthChange = (date: any, dateString: any) => {
    setMonth(Array.isArray(dateString) ? (dateString[0] || '') : dateString || '');
  };


  // 表格列定义
  const tableColumns: ColumnsType<any> = useMemo(() => {
    const currentMonth = month || dayjs().format('YYYY-MM');
    // 表格中始终显示对比年份（默认为上一年）
    const year = dayjs().subtract(1, 'year').format('YYYY');
    
    return [
      {
        title: '国家',
        dataIndex: '国家',
        key: '国家',
        fixed: 'left',
        width: 120,
        render: (text: string) => text || '',
      },
      {
        title: currentMonth,
        key: currentMonth,
        children: [
          {
            title: '房数',
            dataIndex: `${currentMonth}_房数`,
            key: `${currentMonth}_房数`,
            width: 120,
            align: 'right',
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '房数%',
            dataIndex: `${currentMonth}_房数%`,
            key: `${currentMonth}_房数%`,
            width: 120,
            align: 'right',
            render: (value: number) => `${formatNumber(value || 0)}%`,
          },
          {
            title: '人数',
            dataIndex: `${currentMonth}_人数`,
            key: `${currentMonth}_人数`,
            width: 120,
            align: 'right',
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '人数%',
            dataIndex: `${currentMonth}_人数%`,
            key: `${currentMonth}_人数%`,
            width: 120,
            align: 'right',
            render: (value: number) => `${formatNumber(value || 0)}%`,
          },
        ],
      },
      {
        title: year,
        key: year,
        children: [
          {
            title: '房数',
            dataIndex: `${year}_房数`,
            key: `${year}_房数`,
            width: 120,
            align: 'right',
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '人数',
            dataIndex: `${year}_人数`,
            key: `${year}_人数`,
            width: 120,
            align: 'right',
            render: (value: number) => formatNumber(value || 0),
          },
        ],
      },
      {
        title: '2025',
        key: '2025',
        children: [
          {
            title: '房数',
            dataIndex: '2025_房数',
            key: '2025_房数',
            width: 120,
            align: 'right',
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '人数',
            dataIndex: '2025_人数',
            key: '2025_人数',
            width: 120,
            align: 'right',
            render: (value: number) => formatNumber(value || 0),
          },
        ],
      },
    ];
  }, [month]);

  const handleQuery = async (toPage?: number, toPageSize?: number) => {
    try {
      setLoading(true);
      setError(null);
      const currentPage = toPage ?? page;
      const currentSize = toPageSize ?? pageSize;
      const params = new URLSearchParams();
      if (month) params.append('month', month);
      if (regions.length) params.append('regions', regions.join(','));
      if (areas.length) params.append('areas', areas.join(','));
      if (cities.length) params.append('cities', cities.join(','));
      if (hotel) params.append('hotel', hotel);
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/yifei/country-month-statistics?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRows(json.data.items || []);
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
    setMonth('');
    setRegions([]);
    setAreas([]);
    setCities([]);
    setHotel('');
    setPage(1);
    setPageSize(10);
    setRows([]);
    setTotal(0);
    setError(null);
  };


  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题和返回按钮 */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">国家月统计报表</h1>
                <p className="text-gray-600">查看国家月统计数据</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">月份</label>
                <DatePicker
                  picker="month"
                  className="w-full"
                  format="YYYY-MM"
                  value={month ? dayjs(month, 'YYYY-MM') : null}
                  onChange={handleMonthChange}
                  placeholder="选择月份"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">大区</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择大区"
                  className="w-full"
                  value={regions}
                  onChange={(vals) => setRegions(vals as string[])}
                  options={['华北', '华东', '华南', '西南', '东北'].map(v => ({ label: v, value: v }))}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">城区</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择城区"
                  className="w-full"
                  value={areas}
                  onChange={(vals) => setAreas(vals as string[])}
                  options={['朝阳', '海淀', '浦东', '天河', '武侯'].map(v => ({ label: v, value: v }))}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择城市"
                  className="w-full"
                  value={cities}
                  onChange={(vals) => setCities(vals as string[])}
                  options={['北京', '上海', '广州', '成都', '杭州'].map(v => ({ label: v, value: v }))}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店</label>
                <Select
                  allowClear
                  showSearch
                  placeholder="选择酒店"
                  className="w-full"
                  value={hotel || undefined}
                  onChange={(val) => setHotel(val || '')}
                  options={[
                    { label: 'BJ001-北京建国饭店', value: 'BJ001' },
                    { label: 'SH001-上海分店', value: 'SH001' },
                    { label: 'GZ001-广州分店', value: 'GZ001' },
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
            </div>
          </div>

          {/* 已选择条件展示 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {month && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">月份: {month}</span>}
            {regions.map(r => <span key={`r-${r}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">大区: {r}</span>)}
            {areas.map(a => <span key={`a-${a}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">城区: {a}</span>)}
            {cities.map(c => <span key={`c-${c}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">城市: {c}</span>)}
            {hotel && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">酒店: {hotel}</span>}
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Table
              columns={tableColumns}
              dataSource={rows}
              loading={loading}
              rowKey={(record, index) => (record.国家 || '') + (record.__type || '') + index}
              scroll={{ x: 1000, y: 520 }}
              pagination={false}
              bordered
            />
            <div className="mt-4 flex flex-col md:flex-row md:items-center justify-end">
              <Pagination
                current={page}
                total={total}
                pageSize={pageSize}
                showSizeChanger
                pageSizeOptions={['10', '50', '100']}
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