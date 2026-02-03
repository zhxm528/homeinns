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

type PublishRateRecord = {
  GroupCode?: string;
  HotelCode?: string;
  HotelName?: string;
  ChannelCode?: string;
  RateCode?: string;
  BeginDate?: string;
  EndDate?: string;
};

type PublishRateStats = {
  groupCounts: [string, number][];
  channelCounts: [string, number][];
  rateCodeCounts: [string, number][];
  hotelCodeCounts: [string, number][];
  endMonthCounts: [string, number][];
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

export default function CRSRatePublishPage() {
  const section = headerMenuById('crs');
  if (!section) {
    throw new Error('CRS menu configuration missing.');
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PublishRateRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [stats, setStats] = useState<PublishRateStats>({
    groupCounts: [],
    channelCounts: [],
    rateCodeCounts: [],
    hotelCodeCounts: [],
    endMonthCounts: [],
  });
  const breadcrumbItems = useMemo(
    () => [
      { label: '首页', href: '/' },
      { label: '中央预订CRS', href: '/crs' },
      { label: '酒店房价', href: '/crs/rate' },
      { label: '发布房价' },
    ],
    []
  );

  const [filters, setFilters] = useState({
    GroupCode: '',
    HotelCode: '',
    HotelName: '',
    ChannelCode: '',
    RateCode: '',
    BeginDate: '',
    EndDate: '',
  });

  const columns: ColumnsType<PublishRateRecord> = useMemo(
    () => [
      { title: '管理公司', dataIndex: 'GroupCode', key: 'GroupCode', width: 120, fixed: 'left' },
      { title: '酒店编码', dataIndex: 'HotelCode', key: 'HotelCode', width: 120, fixed: 'left' },
      { title: '酒店名称', dataIndex: 'HotelName', key: 'HotelName', width: 220 },
      { title: '渠道代码', dataIndex: 'ChannelCode', key: 'ChannelCode', width: 140, render: formatValue },
      { title: '房价码', dataIndex: 'RateCode', key: 'RateCode', width: 140, render: formatValue },
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
    ],
    []
  );

  const statsData = useMemo(
    () => ({
      groupCounts: stats.groupCounts,
      channelCounts: stats.channelCounts,
      rateCodeCounts: stats.rateCodeCounts,
      hotelCodeCounts: stats.hotelCodeCounts,
      endMonthCounts: stats.endMonthCounts,
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

      const res = await fetch(`/api/crs/rate/publish?${params.toString()}`);
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
            channelCounts: toPairs(json.stats.channelCounts),
            rateCodeCounts: toPairs(json.stats.rateCodeCounts),
            hotelCodeCounts: toPairs(json.stats.hotelCodeCounts),
            endMonthCounts: toPairs(json.stats.endMonthCounts),
          });
        } else {
          setStats({
            groupCounts: [],
            channelCounts: [],
            rateCodeCounts: [],
            hotelCodeCounts: [],
            endMonthCounts: [],
          });
        }
      } else {
        setData([]);
        setTotal(0);
        setStats({
          groupCounts: [],
          channelCounts: [],
          rateCodeCounts: [],
          hotelCodeCounts: [],
          endMonthCounts: [],
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
        channelCounts: [],
        rateCodeCounts: [],
        hotelCodeCounts: [],
        endMonthCounts: [],
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
      ChannelCode: '',
      RateCode: '',
      BeginDate: '',
      EndDate: '',
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
                  placeholder="渠道代码 channel_code"
                  value={filters.ChannelCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, ChannelCode: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="房价码 rate_code"
                  value={filters.RateCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, RateCode: e.target.value }))}
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
                  <div className="text-sm text-gray-600 mb-2">渠道代码分布</div>
                  <ReactECharts
                    option={pieOption(statsData.channelCounts, ['#A78BFA', '#F87171', '#4ADE80', '#FBBF24'])}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">房价码 TOP 8</div>
                  <ReactECharts
                    option={barOption(
                      statsData.rateCodeCounts.map(([name]) => name),
                      statsData.rateCodeCounts.map(([, value]) => value),
                      '#60A5FA'
                    )}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">酒店编码 TOP 8</div>
                  <ReactECharts
                    option={barOption(
                      statsData.hotelCodeCounts.map(([name]) => name),
                      statsData.hotelCodeCounts.map(([, value]) => value),
                      '#34D399'
                    )}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">有效期结束月份 TOP 8</div>
                  <ReactECharts
                    option={barOption(
                      statsData.endMonthCounts.map(([name]) => name),
                      statsData.endMonthCounts.map(([, value]) => value),
                      '#F472B6'
                    )}
                    style={{ height: 220 }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">发布房价列表</h2>
                <p className="text-sm text-gray-500 mt-1">共 {total} 条记录</p>
              </div>
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={data}
                  loading={loading}
                  scroll={{ x: 1200, y: 600 }}
                  pagination={false}
                  rowKey={(record) =>
                    `${record.HotelCode || ''}-${record.ChannelCode || ''}-${record.RateCode || ''}-${record.BeginDate || ''}`
                  }
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
