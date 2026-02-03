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
import { ConfigProvider, Button, Input, Table } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';

type HotelDetail = {
  HotelCode?: string;
  HotelName?: string;
  PropertyType?: string;
  HotelType?: string;
  PMSType?: string;
  Area?: string;
  UrbanArea?: string;
  MDMCity?: string;
  GroupCode?: string;
  Status?: string | number;
};

export default function CRSHotelDetailPage() {
  const section = headerMenuById('crs');
  if (!section) {
    throw new Error('CRS menu configuration missing.');
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HotelDetail[]>([]);
  const breadcrumbItems = useMemo(
    () => [
      { label: '首页', href: '/' },
      { label: '中央预订CRS', href: '/crs' },
      { label: '酒店信息', href: '/crs/hotel-info' },
      { label: '酒店详情' },
    ],
    []
  );

  const [filters, setFilters] = useState({
    HotelCode: '',
    HotelName: '',
    PropertyType: '',
    HotelType: '',
    PMSType: '',
    Area: '',
    UrbanArea: '',
    MDMCity: '',
    GroupCode: '',
    Status: '',
  });

  const columns: ColumnsType<HotelDetail> = useMemo(
    () => [
      { title: '酒店编码', dataIndex: 'HotelCode', key: 'HotelCode', width: 120, fixed: 'left' },
      { title: '酒店名称', dataIndex: 'HotelName', key: 'HotelName', width: 220 },
      { title: '酒店产权类型', dataIndex: 'PropertyType', key: 'PropertyType', width: 140 },
      { title: '酒店类型', dataIndex: 'HotelType', key: 'HotelType', width: 120 },
      { title: 'PMS类型', dataIndex: 'PMSType', key: 'PMSType', width: 120 },
      { title: '酒店大区', dataIndex: 'Area', key: 'Area', width: 120 },
      { title: '酒店城区', dataIndex: 'UrbanArea', key: 'UrbanArea', width: 120 },
      { title: '酒店城市', dataIndex: 'MDMCity', key: 'MDMCity', width: 120 },
      { title: '管理公司', dataIndex: 'GroupCode', key: 'GroupCode', width: 140 },
      { title: '状态', dataIndex: 'Status', key: 'Status', width: 100 },
    ],
    []
  );

  const topN = (entries: [string, number][], n: number) =>
    entries.sort((a, b) => b[1] - a[1]).slice(0, n);

  const stats = useMemo(() => {
    const countBy = (key: keyof HotelDetail) => {
      const map = new Map<string, number>();
      data.forEach((row) => {
        const raw = row[key];
        const value = raw === null || raw === undefined || raw === '' ? '未填写' : String(raw);
        map.set(value, (map.get(value) || 0) + 1);
      });
      return Array.from(map.entries());
    };

    const areaCounts = topN(countBy('Area'), 8);
    const cityCounts = topN(countBy('MDMCity'), 8);
    const typeCounts = countBy('HotelType');
    const propertyCounts = countBy('PropertyType');
    const pmsCounts = topN(countBy('PMSType'), 6);
    const statusCounts = countBy('Status');

    return {
      areaCounts,
      cityCounts,
      typeCounts,
      propertyCounts,
      pmsCounts,
      statusCounts,
    };
  }, [data]);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const res = await fetch(`/api/crs/hotel-info/detail?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setData(json.data || []);
      } else {
        setData([]);
        setError(json.error || '加载数据失败');
      }
    } catch (e: any) {
      console.error('加载数据失败:', e);
      setError('网络请求失败，请检查网络连接');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      HotelCode: '',
      HotelName: '',
      PropertyType: '',
      HotelType: '',
      PMSType: '',
      Area: '',
      UrbanArea: '',
      MDMCity: '',
      GroupCode: '',
      Status: '',
    });
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  placeholder="酒店编码"
                  value={filters.HotelCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, HotelCode: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="酒店名称"
                  value={filters.HotelName}
                  onChange={(e) => setFilters((prev) => ({ ...prev, HotelName: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="酒店产权类型"
                  value={filters.PropertyType}
                  onChange={(e) => setFilters((prev) => ({ ...prev, PropertyType: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="酒店类型"
                  value={filters.HotelType}
                  onChange={(e) => setFilters((prev) => ({ ...prev, HotelType: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="PMS类型"
                  value={filters.PMSType}
                  onChange={(e) => setFilters((prev) => ({ ...prev, PMSType: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="酒店大区"
                  value={filters.Area}
                  onChange={(e) => setFilters((prev) => ({ ...prev, Area: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="酒店城区"
                  value={filters.UrbanArea}
                  onChange={(e) => setFilters((prev) => ({ ...prev, UrbanArea: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="酒店城市"
                  value={filters.MDMCity}
                  onChange={(e) => setFilters((prev) => ({ ...prev, MDMCity: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="管理公司"
                  value={filters.GroupCode}
                  onChange={(e) => setFilters((prev) => ({ ...prev, GroupCode: e.target.value }))}
                  allowClear
                />
                <Input
                  placeholder="状态"
                  value={filters.Status}
                  onChange={(e) => setFilters((prev) => ({ ...prev, Status: e.target.value }))}
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
                  <div className="text-sm text-gray-600 mb-2">酒店类型分布</div>
                  <ReactECharts
                    option={pieOption(stats.typeCounts, ['#60A5FA', '#F59E0B', '#34D399', '#F472B6'])}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">产权类型分布</div>
                  <ReactECharts
                    option={pieOption(stats.propertyCounts, ['#A78BFA', '#F87171', '#4ADE80', '#FBBF24'])}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">状态分布</div>
                  <ReactECharts
                    option={pieOption(stats.statusCounts, ['#38BDF8', '#FB7185', '#FACC15', '#94A3B8'])}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">酒店大区 TOP 8</div>
                  <ReactECharts
                    option={barOption(
                      stats.areaCounts.map(([name]) => name),
                      stats.areaCounts.map(([, value]) => value),
                      '#60A5FA'
                    )}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">城市 TOP 8</div>
                  <ReactECharts
                    option={barOption(
                      stats.cityCounts.map(([name]) => name),
                      stats.cityCounts.map(([, value]) => value),
                      '#34D399'
                    )}
                    style={{ height: 220 }}
                  />
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">PMS 类型 TOP 6</div>
                  <ReactECharts
                    option={barOption(
                      stats.pmsCounts.map(([name]) => name),
                      stats.pmsCounts.map(([, value]) => value),
                      '#F59E0B'
                    )}
                    style={{ height: 220 }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">酒店列表</h2>
                <p className="text-sm text-gray-500 mt-1">共 {data.length} 条记录</p>
              </div>
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={data}
                  loading={loading}
                  scroll={{ x: 1400, y: 600 }}
                  pagination={false}
                  rowKey={(record) => record.HotelCode || `${record.HotelName}-${Math.random()}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
