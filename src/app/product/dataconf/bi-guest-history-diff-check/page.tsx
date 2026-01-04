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

export default function BiGuestHistoryDiffCheckPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询条件
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [pmsTypes, setPmsTypes] = useState<string[]>([]);
  const [onlyShowDiff, setOnlyShowDiff] = useState<boolean>(false);

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 默认日期范围：最近7天
  const getDefaultDateRange = () => {
    const endDate = dayjs();
    const startDate = dayjs().subtract(6, 'day');
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
        dataIndex: 'HotelCode',
        key: 'HotelCode',
        fixed: 'left',
        width: 120,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          // 构建跳转URL，传递当前行的日期和酒店代码
          const bdate = record.bdate || '';
          const hotelCode = text || '';
          const linkUrl = `/product/dataconf/bi-guest-history-market-diff-check?startDate=${encodeURIComponent(bdate)}&endDate=${encodeURIComponent(bdate)}&hotelList=${encodeURIComponent(hotelCode)}`;
          return (
            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
              {text}
            </a>
          );
        },
      },
      {
        title: '酒店名称',
        dataIndex: 'HotelName',
        key: 'HotelName',
        width: 200,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          return text;
        },
      },
      {
        title: 'PMS类型',
        dataIndex: 'PMSType',
        key: 'PMSType',
        width: 120,
        render: (text: string, record: any) => {
          const pmsTypeMap: Record<string, string> = {
            'Cambridge': '康桥',
            'Opera': '手工填报',
            'P3': '如家P3',
            'Soft': '软连接',
            'X6': '西软X6',
            'XMS': '西软XMS',
            'x6': '西软X6',
          };
          const displayText = pmsTypeMap[text] || text;
          if (record.__type === 'total') {
            return <strong>{displayText}</strong>;
          }
          return displayText;
        },
      },
      {
        title: '产权类型',
        dataIndex: 'PropertyType',
        key: 'PropertyType',
        width: 120,
        render: (text: string, record: any) => {
          const propertyTypeMap: Record<string, string> = {
            'BZ': '北展',
            'FCQD': '非产权店',
            'SJJT': '首酒集团',
            'SLJT': '首旅集团',
            'SLZY': '首旅置业',
            'SFT': '首副通',
          };
          const displayText = propertyTypeMap[text] || text;
          if (record.__type === 'total') {
            return <strong>{displayText}</strong>;
          }
          return displayText;
        },
      },
      {
        title: '日期',
        dataIndex: 'bdate',
        key: 'bdate',
        width: 120,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          return text;
        },
      },
      {
        title: 'BI间夜',
        dataIndex: 'BI间夜',
        key: 'BI间夜',
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
        title: 'BI房型间夜',
        dataIndex: 'BI房型间夜',
        key: 'BI房型间夜',
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
        title: 'CRS间夜',
        dataIndex: 'CRS间夜',
        key: 'CRS间夜',
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
        title: 'BI金额',
        dataIndex: 'BI金额',
        key: 'BI金额',
        width: 150,
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
        title: 'BI房型金额',
        dataIndex: 'BI房型金额',
        key: 'BI房型金额',
        width: 150,
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
        title: 'CRS金额',
        dataIndex: 'CRS金额',
        key: 'CRS金额',
        width: 150,
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
        title: '金额差',
        dataIndex: '金额差',
        key: '金额差',
        width: 150,
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
        title: '相差百分比(%)',
        dataIndex: '相差百分比',
        key: '相差百分比',
        width: 130,
        align: 'right',
        render: (value: number, record: any) => {
          if (value === null || value === undefined) return '-';
          const formatted = String(Math.round(value));
          if (record.__type === 'total') {
            return <strong>{formatted}</strong>;
          }
          return formatted;
        },
      },
      {
        title: '房型金额差',
        dataIndex: '房型金额差',
        key: '房型金额差',
        width: 150,
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
        title: '房型相差百分比(%)',
        dataIndex: '房型相差百分比',
        key: '房型相差百分比',
        width: 150,
        align: 'right',
        render: (value: number, record: any) => {
          if (value === null || value === undefined) return '-';
          const formatted = String(Math.round(value));
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
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (propertyTypes.length > 0) params.append('propertyTypes', propertyTypes.join(','));
      if (pmsTypes.length > 0) params.append('pmsTypes', pmsTypes.join(','));
      if (onlyShowDiff) params.append('onlyShowDiff', 'true');
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/dataconf/bi-guest-history-diff-check?${params.toString()}`);
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
    const defaultDates = getDefaultDateRange();
    setStartDate(defaultDates.startDate);
    setEndDate(defaultDates.endDate);
    setPropertyTypes([]);
    setPmsTypes([]);
    setOnlyShowDiff(false);
    setPage(1);
    setPageSize(10);
    setRows([]);
    setTotal(0);
    setError(null);
  };

  // 页面加载时自动查询
  useEffect(() => {
    const defaultDates = getDefaultDateRange();
    setStartDate(defaultDates.startDate);
    setEndDate(defaultDates.endDate);
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">BI和客史差异检查</h1>
                <p className="text-gray-600">查看BI和客史差异检查统计数据</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">产权类型</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择产权类型"
                  className="w-full"
                  value={propertyTypes}
                  onChange={(vals) => setPropertyTypes(vals as string[])}
                  options={[
                    { label: 'BZ - 北展', value: 'BZ' },
                    { label: 'FCQD - 非产权店', value: 'FCQD' },
                    { label: 'SJJT - 首酒集团', value: 'SJJT' },
                    { label: 'SLJT - 首旅集团', value: 'SLJT' },
                    { label: 'SLZY - 首旅置业', value: 'SLZY' },
                    { label: 'SFT - 首副通', value: 'SFT' },
                  ]}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PMS类型</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择PMS类型"
                  className="w-full"
                  value={pmsTypes}
                  onChange={(vals) => setPmsTypes(vals as string[])}
                  options={[
                    { label: 'Cambridge - 康桥', value: 'Cambridge' },
                    { label: 'Opera - 手工填报', value: 'Opera' },
                    { label: 'P3 - 如家P3', value: 'P3' },
                    { label: 'Soft - 软连接', value: 'Soft' },
                    { label: 'X6 - 西软X6', value: 'X6' },
                    { label: 'XMS - 西软XMS', value: 'XMS' },
                  ]}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Checkbox
                    checked={onlyShowDiff}
                    onChange={(e) => setOnlyShowDiff(e.target.checked)}
                  >
                    仅查看有差异酒店
                  </Checkbox>
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button type="primary" loading={loading} onClick={() => handleQuery(1, pageSize)}>查询</Button>
              <Button onClick={handleReset}>重置</Button>
            </div>
          </div>

          {/* 已选择条件展示 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {startDate && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">开始日期: {startDate}</span>}
            {endDate && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">结束日期: {endDate}</span>}
            {onlyShowDiff && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">仅查看有差异酒店</span>}
            {propertyTypes.map(pt => <span key={`pt-${pt}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">产权类型: {pt}</span>)}
            {pmsTypes.map(pt => <span key={`pms-${pt}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">PMS类型: {pt}</span>)}
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
                return `${record.HotelCode || ''}_${record.bdate || ''}`;
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
