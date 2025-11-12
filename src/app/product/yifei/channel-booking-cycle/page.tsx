'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { DatePicker, ConfigProvider, Button, Select, Pagination } from 'antd';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: dayjs types might be missing
import dayjs, { Dayjs } from 'dayjs';

export default function ChannelBookingCyclePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询条件
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
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

  const handleStartDateChange = (date: any, dateString: any) => {
    setStartDate(Array.isArray(dateString) ? (dateString[0] || '') : dateString || '');
  };
  const handleEndDateChange = (date: any, dateString: any) => {
    setEndDate(Array.isArray(dateString) ? (dateString[0] || '') : dateString || '');
  };

  const columns = useMemo(() => [
    { key: '酒店', title: '酒店' },
    { key: '未提前间夜数', title: '未提前间夜数' },
    { key: '未提前间夜占比', title: '未提前间夜占比' },
    { key: '提前1天间夜数', title: '提前1天间夜数' },
    { key: '提前1天间夜占比', title: '提前1天间夜占比' },
    { key: '提前2天间夜数', title: '提前2天间夜数' },
    { key: '提前2天间夜占比', title: '提前2天间夜占比' },
    { key: '提前3天间夜数', title: '提前3天间夜数' },
    { key: '提前3天间夜占比', title: '提前3天间夜占比' },
    { key: '提前4天间夜数', title: '提前4天间夜数' },
    { key: '提前4天间夜占比', title: '提前4天间夜占比' },
    { key: '提前5天间夜数', title: '提前5天间夜数' },
    { key: '提前5天间夜占比', title: '提前5天间夜占比' },
    { key: '提前6天间夜数', title: '提前6天间夜数' },
    { key: '提前6天间夜占比', title: '提前6天间夜占比' },
    { key: '提前7天及以上间夜数', title: '提前7天及以上间夜数' },
    { key: '提前7天及以上间夜占比', title: '提前7天及以上间夜占比' },
  ], []);

  const handleQuery = async (toPage?: number, toPageSize?: number) => {
    try {
      setLoading(true);
      setError(null);
      const currentPage = toPage ?? page;
      const currentSize = toPageSize ?? pageSize;
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (regions.length) params.append('regions', regions.join(','));
      if (areas.length) params.append('areas', areas.join(','));
      if (cities.length) params.append('cities', cities.join(','));
      if (hotel) params.append('hotel', hotel);
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/yifei/channel-booking-cycle?${params.toString()}`);
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
    setStartDate('');
    setEndDate('');
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">渠道预订周期统计表</h1>
              <p className="text-gray-600">查看渠道预订周期统计数据</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">大区</label>
              <div className="flex flex-wrap gap-3">
                {['华北','华东','华南','西南','东北'].map(r=> (
                  <label key={r} className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" checked={regions.includes(r)} onChange={()=> setRegions(prev=> prev.includes(r)? prev.filter(x=> x!==r): [...prev, r])} />{r}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">城区</label>
              <div className="flex flex-wrap gap-3">
                {['朝阳','海淀','浦东','天河','武侯'].map(a=> (
                  <label key={a} className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" checked={areas.includes(a)} onChange={()=> setAreas(prev=> prev.includes(a)? prev.filter(x=> x!==a): [...prev, a])} />{a}
                  </label>
                ))}
              </div>
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
                options={["北京","上海","广州","成都","杭州"].map(v=>({label:v,value:v}))}
                filterOption={(input, option) => ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())}
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
          {endDate && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">结束日期: {endDate}</span>}
          {regions.map(r => <span key={`r-${r}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">大区: {r}</span>)}
          {areas.map(a => <span key={`a-${a}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">城区: {a}</span>)}
          {cities.map(c => <span key={`c-${c}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">城市: {c}</span>)}
          {hotel && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">酒店: {hotel}</span>}
        </div>

        {/* 表格 */}
        <div className="bg-white rounded-lg shadow-sm p-0 overflow-auto">
          <div className="max-w-full overflow-auto" style={{ maxHeight: 560 }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {columns.map(col => (
                    <th key={col.key as string} className={`px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.key==='酒店' ? 'sticky left-0 bg-gray-50 z-20' : ''}`}>{col.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {rows.map((row, idx) => (
                  <tr key={(row.酒店 || '') + idx} className="hover:bg-gray-50">
                    {columns.map(col => (
                      <td key={String(col.key)} className={`px-4 py-2 whitespace-nowrap text-sm ${col.key==='酒店' ? 'sticky left-0 bg-white z-10 font-medium text-gray-900' : 'text-gray-900'} ${col.key==='酒店' ? '' : 'text-right'}`}>
                        {col.key==='酒店' ? row[col.key] : (String(col.key).includes('占比') ? `${formatNumber(row[col.key])}%` : formatNumber(row[col.key]))}
                      </td>
                    ))}
                  </tr>
                ))}
                {(!loading && rows.length===0) && (
                  <tr>
                    <td className="px-4 py-8 text-center text-sm text-gray-500" colSpan={columns.length}>暂无数据，请设置查询条件后点击查询</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex flex-col md:flex-row md:items-center justify-end">
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
