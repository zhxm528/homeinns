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

interface HotelOption {
  value: string;
  label: string;
}

export default function BiGuestHistoryMarketDiffCheckPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询条件
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [hotelList, setHotelList] = useState<string[]>([]);
  const [hotelOptions, setHotelOptions] = useState<HotelOption[]>([]);

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 默认日期范围：最近7天
  // 注意：这个函数只在客户端调用，避免在服务器端渲染时产生不同的日期
  const getDefaultDateRange = () => {
    // 确保只在客户端执行
    if (typeof window === 'undefined') {
      // 服务器端返回固定值，避免 hydration 不匹配
      return {
        startDate: '',
        endDate: '',
      };
    }
    const endDate = dayjs();
    const startDate = dayjs().subtract(6, 'day');
    return {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    };
  };

  // 加载酒店列表
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch('/api/hotels');
        const json = await res.json();
        if (json.success && json.data) {
          const hotels = json.data.map((hotel: any) => ({
            value: hotel.HotelCode,
            label: `${hotel.HotelCode} - ${hotel.HotelName || ''}`,
          }));
          setHotelOptions(hotels);
        }
      } catch (e) {
        console.error('加载酒店列表失败:', e);
      }
    };
    fetchHotels();
  }, []);

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
          return text;
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
        title: '日期',
        dataIndex: '日期',
        key: '日期',
        width: 120,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          return text;
        },
      },
      {
        title: '类别',
        dataIndex: '类别',
        key: '类别',
        width: 120,
        render: (text: string, record: any) => {
          if (record.__type === 'total') {
            return <strong>{text}</strong>;
          }
          return text;
        },
      },
      {
        title: 'BI间夜数',
        dataIndex: 'BI间夜数',
        key: 'BI间夜数',
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
        title: 'BI房费金额',
        dataIndex: 'BI房费金额',
        key: 'BI房费金额',
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
        title: 'CRS间夜数',
        dataIndex: 'CRS间夜数',
        key: 'CRS间夜数',
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
        title: 'CRS房费金额',
        dataIndex: 'CRS房费金额',
        key: 'CRS房费金额',
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
        title: '间夜差',
        dataIndex: '间夜差',
        key: '间夜差',
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
        title: '差异百分比(%)',
        dataIndex: '差异百分比',
        key: '差异百分比',
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
      if (hotelList.length > 0) params.append('hotelList', hotelList.join(','));
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/dataconf/bi-guest-history-market-diff-check?${params.toString()}`);
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
    setHotelList([]);
    setPage(1);
    setPageSize(10);
    setRows([]);
    setTotal(0);
    setError(null);
  };

  // 从URL参数读取查询条件的函数
  const readUrlParams = () => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const urlStartDate = params.get('startDate');
    const urlEndDate = params.get('endDate');
    const urlHotelList = params.get('hotelList');
    return { urlStartDate, urlEndDate, urlHotelList };
  };

  // 页面加载时自动查询，或从URL参数读取查询条件
  useEffect(() => {
    const urlParams = readUrlParams();

    if (urlParams?.urlStartDate && urlParams?.urlEndDate) {
      // 如果有URL参数，使用URL参数
      setStartDate(urlParams.urlStartDate);
      setEndDate(urlParams.urlEndDate);
      if (urlParams.urlHotelList) {
        // 如果hotelList是逗号分隔的字符串，需要分割
        const hotelArray = urlParams.urlHotelList.split(',').map(h => h.trim()).filter(h => h);
        setHotelList(hotelArray);
      } else {
        setHotelList([]);
      }
    } else {
      // 如果没有URL参数，使用默认日期范围
      const defaultDates = getDefaultDateRange();
      setStartDate(defaultDates.startDate);
      setEndDate(defaultDates.endDate);
      setHotelList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当查询条件或酒店选项准备好后，执行查询
  useEffect(() => {
    if (startDate && endDate) {
      // 如果URL中有酒店参数，等待酒店选项加载完成后再查询
      const urlParams = readUrlParams();
      if (urlParams?.urlHotelList && hotelOptions.length === 0) {
        // 等待酒店选项加载
        return;
      }
      handleQuery(1, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, hotelList, hotelOptions.length]);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题和返回按钮 */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">BI和客史市场差异检查</h1>
                <p className="text-gray-600">查看BI和客史市场差异检查统计数据</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店列表</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择酒店"
                  className="w-full"
                  value={hotelList}
                  onChange={(vals) => setHotelList(vals as string[])}
                  options={hotelOptions}
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
            {startDate && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">开始日期: {startDate}</span>}
            {endDate && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">结束日期: {endDate}</span>}
            {hotelList.map(hotel => {
              const hotelLabel = hotelOptions.find(opt => opt.value === hotel)?.label || hotel;
              return <span key={`hotel-${hotel}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">酒店: {hotelLabel}</span>;
            })}
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
                return `${record.HotelCode || ''}_${record.日期 || ''}_${record.类别 || ''}`;
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
