'use client';
import '@ant-design/v5-patch-for-react-19';

import { useEffect, useMemo, useState } from 'react';
import SectionSidebar from '@/components/SectionSidebar';
import Breadcrumb from '@/components/Breadcrumb';
import { headerMenuById } from '@/data/menu';
// @ts-ignore: echarts types might be missing
import ReactECharts from 'echarts-for-react';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { ConfigProvider, Button, Input, Table, Pagination, DatePicker } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: dayjs types might be missing
import dayjs from 'dayjs';

type OrderRecord = {
  GroupCode?: string;
  HotelCd?: string;
  HotelName?: string;
  ResvType?: string;
  AgentCd?: string;
  Marketplace?: string;
  RateCode?: string;
  RoomCode?: string;
  RoomNightNum?: number;
  RoomAmount?: number;
  ArrDate?: string;
  DepDate?: string;
  Rooms?: number;
  Member?: string;
  PayType?: string;
  ParentOrderNo?: string;
  PMSOrderNo?: string;
  ThirdOrderNo?: string;
  rsvDatetime?: string;
  sta?: string;
};

type OrderStats = {
  statusCounts: [string, number][];
  resvTypeCounts: [string, number][];
  agentCounts: [string, number][];
  marketplaceCounts: [string, number][];
  hotelCounts: [string, number][];
  payTypeCounts: [string, number][];
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleDateString('zh-CN');
};

const formatDateTime = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString('zh-CN');
};

const formatValue = (value: any) => {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
};

const formatNumber = (value?: number) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '-';
  return Number(value).toLocaleString('zh-CN', { maximumFractionDigits: 2 });
};

export default function CRSOrderQueryPage() {
  const section = headerMenuById('crs');
  if (!section) {
    throw new Error('CRS menu configuration missing.');
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrderRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [stats, setStats] = useState<OrderStats>({
    statusCounts: [],
    resvTypeCounts: [],
    agentCounts: [],
    marketplaceCounts: [],
    hotelCounts: [],
    payTypeCounts: [],
  });
  const breadcrumbItems = useMemo(
    () => [
      { label: '首页', href: '/' },
      { label: '中央预订CRS', href: '/crs' },
      { label: '订单管理', href: '/crs/order' },
      { label: '订单查询' },
    ],
    []
  );

  const today = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
  const [filters, setFilters] = useState({
    GroupCode: '',
    HotelCd: '',
    HotelName: '',
    ResvType: '',
    AgentCd: '',
    Marketplace: '',
    RateCode: '',
    RoomCode: '',
    RoomNightNum: '',
    RoomAmount: '',
    ArrDateStart: '',
    ArrDateEnd: '',
    DepDateStart: '',
    DepDateEnd: '',
    Rooms: '',
    Member: '',
    PayType: '',
    ParentOrderNo: '',
    PMSOrderNo: '',
    ThirdOrderNo: '',
    rsvDatetimeStart: today,
    rsvDatetimeEnd: today,
    sta: '',
  });

  const columns: ColumnsType<OrderRecord> = useMemo(
    () => [
      { title: '管理公司', dataIndex: 'GroupCode', key: 'GroupCode', width: 120, fixed: 'left' },
      { title: '酒店编码', dataIndex: 'HotelCd', key: 'HotelCd', width: 120, fixed: 'left' },
      { title: '酒店名称', dataIndex: 'HotelName', key: 'HotelName', width: 200 },
      { title: '订单类型', dataIndex: 'ResvType', key: 'ResvType', width: 120, render: formatValue },
      { title: '渠道代码', dataIndex: 'AgentCd', key: 'AgentCd', width: 120, render: formatValue },
      { title: '市场码', dataIndex: 'Marketplace', key: 'Marketplace', width: 140, render: formatValue },
      { title: '房价码', dataIndex: 'RateCode', key: 'RateCode', width: 120, render: formatValue },
      { title: '房型码', dataIndex: 'RoomCode', key: 'RoomCode', width: 120, render: formatValue },
      {
        title: '房间间夜',
        dataIndex: 'RoomNightNum',
        key: 'RoomNightNum',
        width: 110,
        align: 'right',
        render: (value: number) => formatNumber(value),
      },
      {
        title: '房间金额',
        dataIndex: 'RoomAmount',
        key: 'RoomAmount',
        width: 120,
        align: 'right',
        render: (value: number) => formatNumber(value),
      },
      {
        title: '入住日期',
        dataIndex: 'ArrDate',
        key: 'ArrDate',
        width: 140,
        render: (value: string) => formatDate(value),
      },
      {
        title: '离店日期',
        dataIndex: 'DepDate',
        key: 'DepDate',
        width: 140,
        render: (value: string) => formatDate(value),
      },
      { title: '房间数', dataIndex: 'Rooms', key: 'Rooms', width: 100, align: 'right', render: formatValue },
      { title: '会员号', dataIndex: 'Member', key: 'Member', width: 140, render: formatValue },
      { title: '支付方式', dataIndex: 'PayType', key: 'PayType', width: 120, render: formatValue },
      { title: 'CRS订单号', dataIndex: 'ParentOrderNo', key: 'ParentOrderNo', width: 180, render: formatValue },
      { title: 'PMS订单号', dataIndex: 'PMSOrderNo', key: 'PMSOrderNo', width: 180, render: formatValue },
      { title: '渠道单号', dataIndex: 'ThirdOrderNo', key: 'ThirdOrderNo', width: 180, render: formatValue },
      {
        title: '预订时间',
        dataIndex: 'rsvDatetime',
        key: 'rsvDatetime',
        width: 180,
        render: (value: string) => formatDateTime(value),
      },
      { title: '订单状态', dataIndex: 'sta', key: 'sta', width: 120, render: formatValue },
    ],
    []
  );

  const statsData = useMemo(
    () => ({
      statusCounts: stats.statusCounts,
      resvTypeCounts: stats.resvTypeCounts,
      agentCounts: stats.agentCounts,
      marketplaceCounts: stats.marketplaceCounts,
      hotelCounts: stats.hotelCounts,
      payTypeCounts: stats.payTypeCounts,
    }),
    [stats]
  );

  const chartCommon = {
    tooltip: { trigger: 'item' },
    textStyle: { fontFamily: 'inherit' },
  };

  const barOption = (labels: string[], values: number[], color: string) => ({
    ...chartCommon,
    grid: { left: 24, right: 16, top: 24, bottom: 24 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { color: '#6b7280', interval: 0, rotate: 25 },
      axisLine: { lineStyle: { color: '#e5e7eb' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6b7280' },
      splitLine: { lineStyle: { color: '#e5e7eb', type: 'dashed' } },
    },
    series: [
      {
        type: 'bar',
        data: values,
        itemStyle: { color },
        barMaxWidth: 28,
      },
    ],
  });

  const pieOption = (items: [string, number][], colors: string[]) => ({
    ...chartCommon,
    legend: { bottom: 0, textStyle: { color: '#6b7280' } },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: items.map(([name, value]) => ({ name, value })),
        label: { color: '#374151' },
        itemStyle: {
          color: (params: any) => colors[params.dataIndex % colors.length],
        },
      },
    ],
  });

  const fetchData = async (nextPage?: number, nextPageSize?: number) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      const finalPage = nextPage ?? page;
      const finalPageSize = nextPageSize ?? pageSize;
      params.append('page', String(finalPage));
      params.append('pageSize', String(finalPageSize));

      const res = await fetch(`/api/crs/order/query?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setData(json.data || []);
        setTotal(Number(json.total || 0));
        setPage(Number(json.page || finalPage));
        setPageSize(Number(json.pageSize || finalPageSize));
        if (json.stats) {
          const toPairs = (items: Array<{ name: string; value: number }> = []) =>
            items.map((item) => [item.name, item.value] as [string, number]);
          setStats({
            statusCounts: toPairs(json.stats.statusCounts),
            resvTypeCounts: toPairs(json.stats.resvTypeCounts),
            agentCounts: toPairs(json.stats.agentCounts),
            marketplaceCounts: toPairs(json.stats.marketplaceCounts),
            hotelCounts: toPairs(json.stats.hotelCounts),
            payTypeCounts: toPairs(json.stats.payTypeCounts),
          });
        } else {
          setStats({
            statusCounts: [],
            resvTypeCounts: [],
            agentCounts: [],
            marketplaceCounts: [],
            hotelCounts: [],
            payTypeCounts: [],
          });
        }
      } else {
        setData([]);
        setTotal(0);
        setStats({
          statusCounts: [],
          resvTypeCounts: [],
          agentCounts: [],
          marketplaceCounts: [],
          hotelCounts: [],
          payTypeCounts: [],
        });
        setError(json.error || '加载数据失败');
      }
    } catch (e: any) {
      console.error('加载数据失败:', e);
      setError('网络请求失败，请检查网络连接');
      setData([]);
      setTotal(0);
      setStats({
        statusCounts: [],
        resvTypeCounts: [],
        agentCounts: [],
        marketplaceCounts: [],
        hotelCounts: [],
        payTypeCounts: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      GroupCode: '',
      HotelCd: '',
      HotelName: '',
      ResvType: '',
      AgentCd: '',
      Marketplace: '',
      RateCode: '',
      RoomCode: '',
      RoomNightNum: '',
      RoomAmount: '',
      ArrDateStart: '',
      ArrDateEnd: '',
      DepDateStart: '',
      DepDateEnd: '',
      Rooms: '',
      Member: '',
      PayType: '',
      ParentOrderNo: '',
      PMSOrderNo: '',
      ThirdOrderNo: '',
      rsvDatetimeStart: today,
      rsvDatetimeEnd: today,
      sta: '',
    });
    setPage(1);
    setPageSize(10);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="flex h-[calc(100vh-8rem)]">
        <SectionSidebar title={section.title} href={section.url} items={section.sidebar ?? []} />
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-800">
                  {error}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">查询条件</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Input
                  placeholder="管理公司 GroupCode"
                  value={filters.GroupCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, GroupCode: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="酒店编码 HotelCd"
                  value={filters.HotelCd}
                  onChange={(e) => setFilters((prev) => ({ ...prev, HotelCd: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="酒店名称 HotelName"
                  value={filters.HotelName}
                  onChange={(e) => setFilters((prev) => ({ ...prev, HotelName: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="订单类型 ResvType"
                  value={filters.ResvType}
                  onChange={(e) => setFilters((prev) => ({ ...prev, ResvType: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="渠道代码 AgentCd"
                  value={filters.AgentCd}
                  onChange={(e) => setFilters((prev) => ({ ...prev, AgentCd: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="市场码 Marketplace"
                  value={filters.Marketplace}
                  onChange={(e) => setFilters((prev) => ({ ...prev, Marketplace: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="房价码 RateCode"
                  value={filters.RateCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, RateCode: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="房型码 RoomCode"
                  value={filters.RoomCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, RoomCode: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="房间间夜 RoomNightNum"
                  value={filters.RoomNightNum}
                  onChange={(e) => setFilters((prev) => ({ ...prev, RoomNightNum: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="房间金额 RoomAmount"
                  value={filters.RoomAmount}
                  onChange={(e) => setFilters((prev) => ({ ...prev, RoomAmount: e.target.value }))}
                  allowClear
                />
                <DatePicker.RangePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  value={
                    filters.ArrDateStart && filters.ArrDateEnd
                      ? [dayjs(filters.ArrDateStart, 'YYYY-MM-DD'), dayjs(filters.ArrDateEnd, 'YYYY-MM-DD')]
                      : null
                  }
                  onChange={(_, dateStrings) =>
                    setFilters((prev) => ({
                      ...prev,
                      ArrDateStart: dateStrings?.[0] || '',
                      ArrDateEnd: dateStrings?.[1] || '',
                    }))
                  }
                  placeholder={['入住日期开始', '入住日期结束']}
                  allowClear
                />
                <DatePicker.RangePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  value={
                    filters.DepDateStart && filters.DepDateEnd
                      ? [dayjs(filters.DepDateStart, 'YYYY-MM-DD'), dayjs(filters.DepDateEnd, 'YYYY-MM-DD')]
                      : null
                  }
                  onChange={(_, dateStrings) =>
                    setFilters((prev) => ({
                      ...prev,
                      DepDateStart: dateStrings?.[0] || '',
                      DepDateEnd: dateStrings?.[1] || '',
                    }))
                  }
                  placeholder={['离店日期开始', '离店日期结束']}
                  allowClear
                />
                <Input
                  placeholder="房间数 rooms"
                  value={filters.Rooms}
                  onChange={(e) => setFilters((prev) => ({ ...prev, Rooms: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="会员号 Member"
                  value={filters.Member}
                  onChange={(e) => setFilters((prev) => ({ ...prev, Member: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="支付方式 PayType"
                  value={filters.PayType}
                  onChange={(e) => setFilters((prev) => ({ ...prev, PayType: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="CRS订单号 ParentOrderNo"
                  value={filters.ParentOrderNo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, ParentOrderNo: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="PMS订单号 PMSOrderNo"
                  value={filters.PMSOrderNo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, PMSOrderNo: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="渠道单号 ThirdOrderNo"
                  value={filters.ThirdOrderNo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, ThirdOrderNo: e.target.value }))}
                  allowClear
                />
                <DatePicker.RangePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  value={
                    filters.rsvDatetimeStart && filters.rsvDatetimeEnd
                      ? [
                          dayjs(filters.rsvDatetimeStart, 'YYYY-MM-DD'),
                          dayjs(filters.rsvDatetimeEnd, 'YYYY-MM-DD'),
                        ]
                      : null
                  }
                  onChange={(_, dateStrings) =>
                    setFilters((prev) => ({
                      ...prev,
                      rsvDatetimeStart: dateStrings?.[0] || '',
                      rsvDatetimeEnd: dateStrings?.[1] || '',
                    }))
                  }
                  placeholder={['预订日期开始', '预订日期结束']}
                  allowClear
                />
                <Input
                  placeholder="订单状态 sta"
                  value={filters.sta}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sta: e.target.value }))}
                  allowClear
                />
              </div>
              <div className="mt-6 flex gap-4">
                <Button type="primary" onClick={fetchData} loading={loading}>
                  查询
                </Button>
                <Button
                  onClick={handleReset}
                  style={{ backgroundColor: '#9ca3af', borderColor: '#9ca3af', color: '#ffffff' }}
                >
                  重置
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">数据看板</h2>
                  <p className="text-sm text-gray-500">基于当前列表数据的统计概览</p>
                </div>
                <div className="text-sm text-gray-500">共 {data.length} 条</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">订单状态分布</div>
                  <ReactECharts
                    option={pieOption(statsData.statusCounts, ['#60A5FA', '#F59E0B', '#34D399', '#F472B6'])}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">订单类型分布</div>
                  <ReactECharts
                    option={pieOption(statsData.resvTypeCounts, ['#A78BFA', '#F87171', '#4ADE80', '#FBBF24'])}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">支付方式分布</div>
                  <ReactECharts
                    option={pieOption(statsData.payTypeCounts, ['#38BDF8', '#FB7185', '#FACC15', '#94A3B8'])}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">渠道代码 TOP 8</div>
                  <ReactECharts
                    option={barOption(
                      statsData.agentCounts.map(([name]) => name),
                      statsData.agentCounts.map(([, value]) => value),
                      '#60A5FA'
                    )}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">市场码 TOP 8</div>
                  <ReactECharts
                    option={barOption(
                      statsData.marketplaceCounts.map(([name]) => name),
                      statsData.marketplaceCounts.map(([, value]) => value),
                      '#34D399'
                    )}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">酒店编码 TOP 8</div>
                  <ReactECharts
                    option={barOption(
                      statsData.hotelCounts.map(([name]) => name),
                      statsData.hotelCounts.map(([, value]) => value),
                      '#F59E0B'
                    )}
                    style={{ height: 220 }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">订单列表</h2>
                <p className="text-sm text-gray-500 mt-1">共 {total} 条记录</p>
              </div>
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={data}
                  loading={loading}
                  scroll={{ x: 2300, y: 600 }}
                  pagination={false}
                  rowKey={(record) => `${record.ParentOrderNo || ''}-${record.PMSOrderNo || ''}`}
                />
              </div>
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  showSizeChanger
                  pageSizeOptions={['10', '100', '500']}
                  showTotal={(totalCount, range) => `第 ${range[0]}-${range[1]} 条，共 ${totalCount} 条`}
                  onChange={(nextPage, nextPageSizeValue) => {
                    const size = nextPageSizeValue || pageSize;
                    setPage(nextPage);
                    setPageSize(size);
                    fetchData(nextPage, size);
                  }}
                  onShowSizeChange={(currentPage, size) => {
                    setPage(1);
                    setPageSize(size);
                    fetchData(1, size);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
