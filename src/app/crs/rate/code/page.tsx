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
import { ConfigProvider, Button, Input, Table, Pagination } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';

type RateCodeRecord = {
  GroupCode?: string;
  HotelCode?: string;
  HotelName?: string;
  RateCode?: string;
  RateCodeName?: string;
  BeginDate?: string;
  EndDate?: string;
  MinAdvBookin?: number;
  MaxAdvBookin?: number;
  MinLos?: number;
  MaxLos?: number;
  Market?: string;
  RoomTypeCode?: string;
  BlockCode?: string;
  BeginTime?: string;
  EndTime?: string;
  CommissionCode?: string;
};

type RateCodeStats = {
  groupCounts: [string, number][];
  marketCounts: [string, number][];
  roomTypeCounts: [string, number][];
  minAdvBookinCounts: [string, number][];
  hotelCounts: [string, number][];
  commissionCounts: [string, number][];
  hotelTypeCounts: [string, number][];
  minLosCounts: [string, number][];
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleDateString('zh-CN');
};

const formatValue = (value: any) => {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
};

export default function CRSRateCodePage() {
  const section = headerMenuById('crs');
  if (!section) {
    throw new Error('CRS menu configuration missing.');
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RateCodeRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [stats, setStats] = useState<RateCodeStats>({
    groupCounts: [],
    marketCounts: [],
    roomTypeCounts: [],
    minAdvBookinCounts: [],
    hotelCounts: [],
    commissionCounts: [],
    hotelTypeCounts: [],
    minLosCounts: [],
  });
  const breadcrumbItems = useMemo(
    () => [
      { label: '首页', href: '/' },
      { label: '中央预订CRS', href: '/crs' },
      { label: '酒店房价', href: '/crs/rate' },
      { label: '房价码' },
    ],
    []
  );

  const [filters, setFilters] = useState({
    GroupCode: '',
    HotelCode: '',
    HotelName: '',
    RateCode: '',
    RateCodeName: '',
    BeginDate: '',
    EndDate: '',
    MinAdvBookin: '',
    MaxAdvBookin: '',
    MinLos: '',
    MaxLos: '',
    Market: '',
    RoomTypeCode: '',
    BlockCode: '',
    BeginTime: '',
    EndTime: '',
    CommissionCode: '',
  });

  const columns: ColumnsType<RateCodeRecord> = useMemo(
    () => [
      { title: '管理公司', dataIndex: 'GroupCode', key: 'GroupCode', width: 120, fixed: 'left' },
      { title: '酒店编码', dataIndex: 'HotelCode', key: 'HotelCode', width: 120, fixed: 'left' },
      { title: '酒店名称', dataIndex: 'HotelName', key: 'HotelName', width: 200 },
      { title: '房价码代码', dataIndex: 'RateCode', key: 'RateCode', width: 120 },
      { title: '房价码名称', dataIndex: 'RateCodeName', key: 'RateCodeName', width: 200 },
      {
        title: '有效期开始',
        dataIndex: 'BeginDate',
        key: 'BeginDate',
        width: 140,
        render: (value: string) => formatDate(value),
      },
      {
        title: '有效期结束',
        dataIndex: 'EndDate',
        key: 'EndDate',
        width: 140,
        render: (value: string) => formatDate(value),
      },
      {
        title: '最小提前预订',
        dataIndex: 'MinAdvBookin',
        key: 'MinAdvBookin',
        width: 130,
        align: 'right',
        render: (value: number) => formatValue(value),
      },
      {
        title: '最大提前预订',
        dataIndex: 'MaxAdvBookin',
        key: 'MaxAdvBookin',
        width: 130,
        align: 'right',
        render: (value: number) => formatValue(value),
      },
      {
        title: '最小连住',
        dataIndex: 'MinLos',
        key: 'MinLos',
        width: 110,
        align: 'right',
        render: (value: number) => formatValue(value),
      },
      {
        title: '最大连住',
        dataIndex: 'MaxLos',
        key: 'MaxLos',
        width: 110,
        align: 'right',
        render: (value: number) => formatValue(value),
      },
      { title: '市场码', dataIndex: 'Market', key: 'Market', width: 140, render: formatValue },
      { title: '房型', dataIndex: 'RoomTypeCode', key: 'RoomTypeCode', width: 140, render: formatValue },
      { title: '团队码', dataIndex: 'BlockCode', key: 'BlockCode', width: 140, render: formatValue },
      { title: '限时开始', dataIndex: 'BeginTime', key: 'BeginTime', width: 110, render: formatValue },
      { title: '限时结束', dataIndex: 'EndTime', key: 'EndTime', width: 110, render: formatValue },
      { title: '佣金码', dataIndex: 'CommissionCode', key: 'CommissionCode', width: 140, render: formatValue },
    ],
    []
  );

  const topN = (entries: [string, number][], n: number) =>
    entries.sort((a, b) => b[1] - a[1]).slice(0, n);

  const statsData = useMemo(
    () => ({
      groupCounts: stats.groupCounts,
      marketCounts: stats.marketCounts,
      roomTypeCounts: stats.roomTypeCounts,
      minAdvBookinCounts: stats.minAdvBookinCounts,
      hotelCounts: stats.hotelCounts,
      commissionCounts: stats.commissionCounts,
      hotelTypeCounts: stats.hotelTypeCounts,
      minLosCounts: stats.minLosCounts,
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

      const res = await fetch(`/api/crs/rate/code?${params.toString()}`);
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
            groupCounts: toPairs(json.stats.groupCounts),
            marketCounts: toPairs(json.stats.marketCounts),
            roomTypeCounts: toPairs(json.stats.roomTypeCounts),
            minAdvBookinCounts: toPairs(json.stats.minAdvBookinCounts),
            hotelCounts: toPairs(json.stats.hotelCounts),
            commissionCounts: toPairs(json.stats.commissionCounts),
            hotelTypeCounts: toPairs(json.stats.hotelTypeCounts),
            minLosCounts: toPairs(json.stats.minLosCounts),
          });
        } else {
          setStats({
            groupCounts: [],
            marketCounts: [],
            roomTypeCounts: [],
            minAdvBookinCounts: [],
            hotelCounts: [],
            commissionCounts: [],
            hotelTypeCounts: [],
            minLosCounts: [],
          });
        }
      } else {
        setData([]);
        setTotal(0);
        setStats({
          groupCounts: [],
          marketCounts: [],
          roomTypeCounts: [],
          minAdvBookinCounts: [],
          hotelCounts: [],
          commissionCounts: [],
          hotelTypeCounts: [],
          minLosCounts: [],
        });
        setError(json.error || '加载数据失败');
      }
    } catch (e: any) {
      console.error('加载数据失败:', e);
      setError('网络请求失败，请检查网络连接');
      setData([]);
      setTotal(0);
      setStats({
        groupCounts: [],
        marketCounts: [],
        roomTypeCounts: [],
        minAdvBookinCounts: [],
        hotelCounts: [],
        commissionCounts: [],
        hotelTypeCounts: [],
        minLosCounts: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      GroupCode: '',
      HotelCode: '',
      HotelName: '',
      RateCode: '',
      RateCodeName: '',
      BeginDate: '',
      EndDate: '',
      MinAdvBookin: '',
      MaxAdvBookin: '',
      MinLos: '',
      MaxLos: '',
      Market: '',
      RoomTypeCode: '',
      BlockCode: '',
      BeginTime: '',
      EndTime: '',
      CommissionCode: '',
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
                  placeholder="酒店编码 HotelCode"
                  value={filters.HotelCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, HotelCode: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="酒店名称 HotelName"
                  value={filters.HotelName}
                  onChange={(e) => setFilters((prev) => ({ ...prev, HotelName: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="房价码代码 RateCode"
                  value={filters.RateCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, RateCode: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="房价码名称 RateCodeName"
                  value={filters.RateCodeName}
                  onChange={(e) => setFilters((prev) => ({ ...prev, RateCodeName: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="有效期开始 BeginDate (YYYY-MM-DD)"
                  value={filters.BeginDate}
                  onChange={(e) => setFilters((prev) => ({ ...prev, BeginDate: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="有效期结束 EndDate (YYYY-MM-DD)"
                  value={filters.EndDate}
                  onChange={(e) => setFilters((prev) => ({ ...prev, EndDate: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="最小提前预订 MinAdvBookin"
                  value={filters.MinAdvBookin}
                  onChange={(e) => setFilters((prev) => ({ ...prev, MinAdvBookin: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="最大提前预订 MaxAdvBookin"
                  value={filters.MaxAdvBookin}
                  onChange={(e) => setFilters((prev) => ({ ...prev, MaxAdvBookin: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="最小连住 MinLos"
                  value={filters.MinLos}
                  onChange={(e) => setFilters((prev) => ({ ...prev, MinLos: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="最大连住 MaxLos"
                  value={filters.MaxLos}
                  onChange={(e) => setFilters((prev) => ({ ...prev, MaxLos: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="市场码 Market"
                  value={filters.Market}
                  onChange={(e) => setFilters((prev) => ({ ...prev, Market: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="房型 RoomTypeCode"
                  value={filters.RoomTypeCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, RoomTypeCode: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="团队码 BlockCode"
                  value={filters.BlockCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, BlockCode: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="限时开始 BeginTime (HH:mm)"
                  value={filters.BeginTime}
                  onChange={(e) => setFilters((prev) => ({ ...prev, BeginTime: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="限时结束 EndTime (HH:mm)"
                  value={filters.EndTime}
                  onChange={(e) => setFilters((prev) => ({ ...prev, EndTime: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="佣金码 CommissionCode"
                  value={filters.CommissionCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, CommissionCode: e.target.value }))}
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
                  <div className="text-sm text-gray-600 mb-2">管理公司分布</div>
                  <ReactECharts
                    option={pieOption(statsData.groupCounts, ['#60A5FA', '#F59E0B', '#34D399', '#F472B6'])}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">市场码分布</div>
                  <ReactECharts
                    option={pieOption(statsData.marketCounts, ['#A78BFA', '#F87171', '#4ADE80', '#FBBF24'])}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">酒店类型分布</div>
                  <ReactECharts
                    option={pieOption(statsData.hotelTypeCounts, ['#38BDF8', '#FB7185', '#FACC15', '#94A3B8'])}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">酒店编码 TOP 8</div>
                  <ReactECharts
                    option={barOption(
                      statsData.hotelCounts.map(([name]) => name),
                      statsData.hotelCounts.map(([, value]) => value),
                      '#60A5FA'
                    )}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">最小提前预订天数 TOP 8</div>
                  <ReactECharts
                    option={barOption(
                      statsData.minAdvBookinCounts.map(([name]) => name),
                      statsData.minAdvBookinCounts.map(([, value]) => value),
                      '#34D399'
                    )}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">最小连住分布</div>
                  <ReactECharts
                    option={barOption(
                      statsData.minLosCounts.map(([name]) => name),
                      statsData.minLosCounts.map(([, value]) => value),
                      '#F59E0B'
                    )}
                    style={{ height: 220 }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">房价码列表</h2>
                <p className="text-sm text-gray-500 mt-1">共 {total} 条记录</p>
              </div>
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={data}
                  loading={loading}
                  scroll={{ x: 1800, y: 600 }}
                  pagination={false}
                  rowKey={(record) => `${record.HotelCode || ''}-${record.RateCode || ''}-${record.BeginDate || ''}`}
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
