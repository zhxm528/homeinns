'use client';
import '@ant-design/v5-patch-for-react-19';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
// @ts-ignore
import 'antd/dist/reset.css';
// @ts-ignore
import { ConfigProvider, DatePicker, Select, Button, Table, Pagination, Input } from 'antd';
// @ts-ignore
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore
import dayjs from 'dayjs';
// @ts-ignore: echarts types might be missing
import ReactECharts from 'echarts-for-react';

interface MonthlyRow {
  HotelName: string;
  GroupCode: string;
  PMSType: string;
  PropertyType: string;
  MDMCity: string;
  [key: string]: any;
}

export default function BusinessDataMonthlyReportPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询条件
  const [year, setYear] = useState<string>('');
  const [groupCodes, setGroupCodes] = useState<string[]>([]);
  const [hotelCode, setHotelCode] = useState<string | undefined>(undefined);
  const [hotelName, setHotelName] = useState<string | undefined>(undefined);
  const [areas, setAreas] = useState<string[]>([]);
  const [urbanAreas, setUrbanAreas] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // 表格数据与分页
  const [rows, setRows] = useState<MonthlyRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(Number(value))) return '';
    const num = Number(value);
    const fixed = num.toFixed(2);
    const trimmed = fixed.replace(/\.00$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatRate = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(Number(value))) return '';
    const num = Number(value) * 100;
    return `${num.toFixed(2)}%`;
  };

  // 表格列定义
  const tableColumns: ColumnsType<MonthlyRow> = useMemo(() => {
    const monthDefs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const baseCols: ColumnsType<MonthlyRow> = [
      {
        title: '酒店名称',
        dataIndex: 'HotelName',
        key: 'HotelName',
        fixed: 'left',
        width: 200,
      },
      {
        title: '管理公司',
        dataIndex: 'GroupCode',
        key: 'GroupCode',
        width: 120,
      },
      {
        title: 'PMS类型',
        dataIndex: 'PMSType',
        key: 'PMSType',
        width: 120,
      },
      {
        title: '产权类型',
        dataIndex: 'PropertyType',
        key: 'PropertyType',
        width: 120,
      },
      {
        title: '城市编码',
        dataIndex: 'MDMCity',
        key: 'MDMCity',
        width: 120,
      },
    ];

    const monthCols: ColumnsType<MonthlyRow> = [];

    monthDefs.forEach((m, idx) => {
      const label = `${idx + 1}月`;
      monthCols.push(
        {
          title: `${label}总收入`,
          dataIndex: `${m}_Total`,
          key: `${m}_Total`,
          width: 140,
          align: 'right',
          render: (value: number) => formatNumber(value),
        },
        {
          title: `${label}客房收入`,
          dataIndex: `${m}_Room`,
          key: `${m}_Room`,
          width: 140,
          align: 'right',
          render: (value: number) => formatNumber(value),
        },
        {
          title: `${label}餐饮收入`,
          dataIndex: `${m}_FB`,
          key: `${m}_FB`,
          width: 140,
          align: 'right',
          render: (value: number) => formatNumber(value),
        },
        {
          title: `${label}其他收入`,
          dataIndex: `${m}_Others`,
          key: `${m}_Others`,
          width: 140,
          align: 'right',
          render: (value: number) => formatNumber(value),
        },
        {
          title: `${label}出租率`,
          dataIndex: `${m}_OccRate`,
          key: `${m}_OccRate`,
          width: 120,
          align: 'right',
          render: (value: number) => formatRate(value),
        },
        {
          title: `${label}平均房价`,
          dataIndex: `${m}_ADR`,
          key: `${m}_ADR`,
          width: 140,
          align: 'right',
          render: (value: number) => formatNumber(value),
        },
        {
          title: `${label}每房收益`,
          dataIndex: `${m}_RevPAR`,
          key: `${m}_RevPAR`,
          width: 140,
          align: 'right',
          render: (value: number) => formatNumber(value),
        },
      );
    });

    const yearCols: ColumnsType<MonthlyRow> = [
      {
        title: '全年总收入',
        dataIndex: 'Year_Total',
        key: 'Year_Total',
        width: 160,
        align: 'right',
        render: (value: number) => formatNumber(value),
      },
      {
        title: '全年客房收入',
        dataIndex: 'Year_Room',
        key: 'Year_Room',
        width: 160,
        align: 'right',
        render: (value: number) => formatNumber(value),
      },
      {
        title: '全年餐饮收入',
        dataIndex: 'Year_FB',
        key: 'Year_FB',
        width: 160,
        align: 'right',
        render: (value: number) => formatNumber(value),
      },
      {
        title: '全年其他收入',
        dataIndex: 'Year_Others',
        key: 'Year_Others',
        width: 160,
        align: 'right',
        render: (value: number) => formatNumber(value),
      },
      {
        title: '全年出租率',
        dataIndex: 'Year_OccRate',
        key: 'Year_OccRate',
        width: 140,
        align: 'right',
        render: (value: number) => formatRate(value),
      },
      {
        title: '全年平均房价',
        dataIndex: 'Year_ADR',
        key: 'Year_ADR',
        width: 160,
        align: 'right',
        render: (value: number) => formatNumber(value),
      },
      {
        title: '全年每房收益',
        dataIndex: 'Year_RevPAR',
        key: 'Year_RevPAR',
        width: 160,
        align: 'right',
        render: (value: number) => formatNumber(value),
      },
    ];

    return [...baseCols, ...monthCols, ...yearCols];
  }, []);

  const handleQuery = async (toPage?: number, toPageSize?: number) => {
    try {
      setLoading(true);
      setError(null);
      const currentPage = toPage ?? page;
      const currentSize = toPageSize ?? pageSize;

      const params = new URLSearchParams();
      if (year) params.append('year', year);
      if (groupCodes.length > 0) params.append('groupCodes', groupCodes.join(','));
      if (hotelCode) params.append('hotelCode', hotelCode);
      if (hotelName) params.append('hotelName', hotelName);
      if (areas.length > 0) params.append('areas', areas.join(','));
      if (urbanAreas.length > 0) params.append('urbanAreas', urbanAreas.join(','));
      if (provinces.length > 0) params.append('provinces', provinces.join(','));
      if (cities.length > 0) params.append('cities', cities.join(','));
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/report-analysis/business-data-monthly-report?${params.toString()}`);
      const json = await res.json();

      if (json.success && json.data) {
        setRows(json.data.items || []);
        setTotal(json.data.total || 0);
        setPage(currentPage);
        setPageSize(currentSize);
      } else {
        setRows([]);
        setTotal(0);
        setError(json.error || json.message || '加载数据失败');
      }
    } catch (e: any) {
      console.error('加载数据失败:', e);
      setError(e?.message || '网络请求失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const currentYear = dayjs().year();
    setYear(String(currentYear));
    setGroupCodes([]);
    setHotelCode(undefined);
    setHotelName(undefined);
    setAreas([]);
    setUrbanAreas([]);
    setProvinces([]);
    setCities([]);
    setPage(1);
    setPageSize(10);
    setRows([]);
    setTotal(0);
    setError(null);
  };

  useEffect(() => {
    const currentYear = dayjs().year();
    setYear(String(currentYear));
    // 初始化时加载一次
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleQuery(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 已选择条件展示
  const selectedConditions = useMemo(() => {
    const conds: string[] = [];
    if (year) conds.push(`年份: ${year}`);
    if (groupCodes.length > 0) conds.push(`管理公司: ${groupCodes.join(', ')}`);
    if (hotelCode) conds.push(`酒店代码: ${hotelCode}`);
    if (hotelName) conds.push(`酒店名称: ${hotelName}`);
    if (areas.length > 0) conds.push(`区域: ${areas.join(', ')}`);
    if (urbanAreas.length > 0) conds.push(`城市区域: ${urbanAreas.join(', ')}`);
    if (provinces.length > 0) conds.push(`省份: ${provinces.join(', ')}`);
    if (cities.length > 0) conds.push(`城市: ${cities.join(', ')}`);
    return conds;
  }, [year, groupCodes, hotelCode, hotelName, areas, urbanAreas, provinces, cities]);

  // ECharts 折线图配置：使用“合计”一行或当前页的汇总行
  const chartOption = useMemo(() => {
    if (!rows || rows.length === 0) {
      return {
        title: { text: '全年月度总收入趋势', left: 'center' },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        },
        yAxis: { type: 'value', name: '总收入' },
        series: [],
      };
    }

    const monthDefs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // 优先使用“合计”行，如果不存在则对当前页做汇总
    let summaryRow: any | null = rows.find(
      (r) => r.HotelName === '合计' || r.GroupCode === '合计' || r.PMSType === '合计' || r.PropertyType === '合计',
    );

    if (!summaryRow) {
      const sumRow: any = {};
      monthDefs.forEach((m) => {
        const field = `${m}_Total`;
        let sum = 0;
        rows.forEach((r) => {
          const v = r[field];
          if (typeof v === 'number' && !isNaN(v)) {
            sum += v;
          }
        });
        sumRow[field] = sum;
      });
      summaryRow = sumRow;
    }

    const data = monthDefs.map((m) => {
      const v = summaryRow[`${m}_Total`];
      return typeof v === 'number' && !isNaN(v) ? v : 0;
    });

    return {
      title: {
        text: '全年月度总收入趋势',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const p = Array.isArray(params) ? params[0] : params;
          const value = formatNumber(p.value);
          return `${p.axisValue}<br/>总收入: ${value}`;
        },
      },
      xAxis: {
        type: 'category',
        data: monthDefs.map((_, idx) => `${idx + 1}月`),
      },
      yAxis: {
        type: 'value',
        name: '总收入',
        axisLabel: {
          formatter: (val: number) => formatNumber(val),
        },
      },
      series: [
        {
          name: '总收入',
          type: 'line',
          smooth: true,
          data,
        },
      ],
    };
  }, [rows]);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题和返回按钮 */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">经营数据自然月报</h1>
                <p className="text-gray-600">按自然月查看经营数据汇总</p>
              </div>
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
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">年份</label>
                <DatePicker
                  className="w-full"
                  picker="year"
                  value={year ? dayjs(`${year}-01-01`) : null}
                  onChange={(_, dateString: string) => {
                    const y = dateString ? dateString.slice(0, 4) : '';
                    setYear(y);
                  }}
                  placeholder="选择年份"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店代码</label>
                <Input
                  placeholder="输入酒店代码（支持模糊查询）"
                  className="w-full"
                  value={hotelCode || ''}
                  onChange={(e) => setHotelCode(e.target.value || undefined)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店名称</label>
                <Input
                  placeholder="输入酒店名称（支持模糊查询）"
                  className="w-full"
                  value={hotelName || ''}
                  onChange={(e) => setHotelName(e.target.value || undefined)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">区域</label>
                <Select
                  mode="tags"
                  allowClear
                  showSearch
                  placeholder="输入或选择区域（支持模糊查询）"
                  className="w-full"
                  value={areas}
                  onChange={(vals) => setAreas(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.value as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">城市区域</label>
                <Select
                  mode="tags"
                  allowClear
                  showSearch
                  placeholder="输入或选择城市区域（支持模糊查询）"
                  className="w-full"
                  value={urbanAreas}
                  onChange={(vals) => setUrbanAreas(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.value as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">省份</label>
                <Select
                  mode="tags"
                  allowClear
                  showSearch
                  placeholder="输入或选择省份（支持模糊查询）"
                  className="w-full"
                  value={provinces}
                  onChange={(vals) => setProvinces(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.value as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
                <Select
                  mode="tags"
                  allowClear
                  showSearch
                  placeholder="输入或选择城市（支持模糊查询）"
                  className="w-full"
                  value={cities}
                  onChange={(vals) => setCities(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.value as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button type="primary" loading={loading} onClick={() => handleQuery(1, pageSize)}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </div>
          </div>

          {/* 已选择条件展示 */}
          {selectedConditions.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedConditions.map((c, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* 表格 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Table
              columns={tableColumns}
              dataSource={rows}
              loading={loading}
              rowKey={(record) =>
                `${record.HotelName || ''}_${record.GroupCode || ''}_${record.PMSType || ''}_${record.PropertyType || ''}_${record.MDMCity || ''}`
              }
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
                onChange={(p, ps) => {
                  setPageSize(ps);
                  handleQuery(p, ps);
                }}
                showTotal={(tot, range) => `${range[0]}-${range[1]} 共 ${tot} 条`}
              />
            </div>
          </div>

          {/* 月度总收入折线图 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">全年月度总收入趋势</h2>
            <ReactECharts
              option={chartOption}
              style={{ height: '400px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
              notMerge={true}
            />
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


