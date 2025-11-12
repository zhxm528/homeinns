'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useMemo } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { DatePicker, ConfigProvider, Button, Select, Pagination, Table, Input } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: dayjs types might be missing
import dayjs from 'dayjs';

// 品牌枚举映射
const depCodeMap: Record<string, string> = {
  '0004': 'AirHotel',
  '0010': '文创',
  '0011': '建国铂萃项目组',
  '0012': '天驿',
  '0014': '宇宿',
  '0017': '首旅高星',
  '0018': '万信',
  '0019': '华驿AY',
  '0022': '华北',
  '0023': '中部',
  '0024': '华西',
  '0025': '上海',
  '0026': '华东',
  '0027': '华南',
  '0028': 'Yunik项目组',
};

// 价格规则类型枚举映射
const policyFormulaMap: Record<string, string> = {
  '01': '一口价',
  '02': '固定折扣',
  '04': '先折后减',
  '08': '会员折上折',
  '09': '会员折上折立减',
  '10': '打包价',
  '11': '先折后加',
  '12': '渠道正价固定折扣',
  '13': '会员折上折立加',
  '14': '渠道折上折',
  '15': '渠道折上折加',
  '16': '渠道折上折减',
};

// OTA类型枚举映射
const otaTypeMap: Record<string, string> = {
  '0': '携程',
  '1': '美团',
  '2': '飞猪',
  '3': '集团',
};

// 促销类型枚举映射
const promotionTypeMap: Record<string, string> = {
  '119': '附加打包类',
  '120': '提前类',
  '121': '尾房类',
  '139': '新客活动类',
  '176': '一口价活动',
  '233': '普通活动类',
  '234': '中长租类',
  '235': '特许店OTA闲置房',
  '1236': '抖音预售券活动',
  '1237': '内用房类',
  '1238': '新店活动',
  '1239': '普通活动类（无阶梯）',
  '1246': '商务日房活动',
  '1262': '直营店OTA闲置房',
  '1304': '神会员促销类',
  '1306': '商旅类',
  '1342': '渠道价优类',
  '1364': '人群类',
  '1365': '当天类',
  '1366': '连住类',
  '1368': '特许店挂牌闲置房',
  '1369': '直营店挂牌闲置房',
  '1377': '抖音特殊活动类',
  '1378': '业主优惠',
  '1384': '私域活动类',
};

export default function PromotionThemeListPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询条件
  const [title, setTitle] = useState<string>('');
  const [describe, setDescribe] = useState<string>('');
  const [otaTypes, setOtaTypes] = useState<string[]>([]);
  const [promotionTypes, setPromotionTypes] = useState<string[]>([]);
  const [policyFormulaIDs, setPolicyFormulaIDs] = useState<string[]>([]);
  const [titleTypes, setTitleTypes] = useState<string[]>([]);
  const [depCodes, setDepCodes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

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
        title: '活动主题',
        dataIndex: 'Title',
        key: 'Title',
        fixed: 'left',
        width: 360,
        render: (text: string) => text,
      },
      {
        title: '促销类型',
        dataIndex: 'CategoryId',
        key: 'CategoryId',
        width: 180,
        render: (text: string) => promotionTypeMap[text] || text,
      },
      {
        title: 'OTA类型',
        dataIndex: 'OTAType',
        key: 'OTAType',
        width: 120,
        render: (text: string) => otaTypeMap[text] || text,
      },
      {
        title: '开始日期',
        dataIndex: 'StartDate',
        key: 'StartDate',
        width: 120,
        render: (text: string) => text,
      },
      {
        title: '结束日期',
        dataIndex: 'EndDate',
        key: 'EndDate',
        width: 120,
        render: (text: string) => text,
      },
      {
        title: '价格规则类型',
        dataIndex: 'PolicyFormulaID',
        key: 'PolicyFormulaID',
        width: 150,
        render: (text: string) => policyFormulaMap[text] || text,
      },
      {
        title: '品牌归属',
        dataIndex: 'DepCode',
        key: 'DepCode',
        width: 150,
        render: (text: string) => depCodeMap[text] || text,
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
      if (title) params.append('title', title);
      if (describe) params.append('describe', describe);
      if (otaTypes.length > 0) params.append('otaTypes', otaTypes.join(','));
      if (promotionTypes.length > 0) params.append('promotionTypes', promotionTypes.join(','));
      if (policyFormulaIDs.length > 0) params.append('policyFormulaIDs', policyFormulaIDs.join(','));
      if (titleTypes.length > 0) params.append('titleTypes', titleTypes.join(','));
      if (depCodes.length > 0) params.append('depCodes', depCodes.join(','));
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/inns/promotion-engine/promotion-theme-list?${params.toString()}`);
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
    setTitle('');
    setDescribe('');
    setOtaTypes([]);
    setPromotionTypes([]);
    setPolicyFormulaIDs([]);
    setTitleTypes([]);
    setDepCodes([]);
    setStartDate('');
    setEndDate('');
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">促销主题列表</h1>
                <p className="text-gray-600">查看促销主题列表数据</p>
              </div>
              {/* 右上角返回按钮 */}
              <Link
                href="/inns"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">活动主题</label>
                <Input
                  placeholder="输入活动主题..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                <Input
                  placeholder="输入描述..."
                  value={describe}
                  onChange={(e) => setDescribe(e.target.value)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">促销类型</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择促销类型"
                  className="w-full"
                  value={promotionTypes}
                  onChange={(vals) => setPromotionTypes(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    { value: '119', label: '119 - 附加打包类' },
                    { value: '120', label: '120 - 提前类' },
                    { value: '121', label: '121 - 尾房类' },
                    { value: '139', label: '139 - 新客活动类' },
                    { value: '176', label: '176 - 一口价活动' },
                    { value: '233', label: '233 - 普通活动类' },
                    { value: '234', label: '234 - 中长租类' },
                    { value: '235', label: '235 - 特许店OTA闲置房' },
                    { value: '1236', label: '1236 - 抖音预售券活动' },
                    { value: '1237', label: '1237 - 内用房类' },
                    { value: '1238', label: '1238 - 新店活动' },
                    { value: '1239', label: '1239 - 普通活动类（无阶梯）' },
                    { value: '1246', label: '1246 - 商务日房活动' },
                    { value: '1262', label: '1262 - 直营店OTA闲置房' },
                    { value: '1304', label: '1304 - 神会员促销类' },
                    { value: '1306', label: '1306 - 商旅类' },
                    { value: '1342', label: '1342 - 渠道价优类' },
                    { value: '1364', label: '1364 - 人群类' },
                    { value: '1365', label: '1365 - 当天类' },
                    { value: '1366', label: '1366 - 连住类' },
                    { value: '1368', label: '1368 - 特许店挂牌闲置房' },
                    { value: '1369', label: '1369 - 直营店挂牌闲置房' },
                    { value: '1377', label: '1377 - 抖音特殊活动类' },
                    { value: '1378', label: '1378 - 业主优惠' },
                    { value: '1384', label: '1384 - 私域活动类' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OTA类型</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择OTA类型"
                  className="w-full"
                  value={otaTypes}
                  onChange={(vals) => setOtaTypes(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={Object.entries(otaTypeMap).map(([value, label]) => ({
                    value,
                    label: `${value} - ${label}`,
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">价格规则类型</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择价格规则类型"
                  className="w-full"
                  value={policyFormulaIDs}
                  onChange={(vals) => setPolicyFormulaIDs(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={Object.entries(policyFormulaMap).map(([value, label]) => ({
                    value,
                    label: `${value} - ${label}`,
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标题类型</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择标题类型"
                  className="w-full"
                  value={titleTypes}
                  onChange={(vals) => setTitleTypes(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">品牌归属</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择品牌归属"
                  className="w-full"
                  value={depCodes}
                  onChange={(vals) => setDepCodes(vals as string[])}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={Object.entries(depCodeMap).map(([value, label]) => ({
                    value,
                    label: `${value} - ${label}`,
                  }))}
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
            {title && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">活动主题: {title}</span>}
            {describe && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">描述: {describe}</span>}
            
            {otaTypes.length > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">OTA类型: {otaTypes.map(v => otaTypeMap[v] || v).join(', ')}</span>}
            {promotionTypes.length > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">促销类型: {promotionTypes.join(', ')}</span>}
            {policyFormulaIDs.length > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">价格规则类型: {policyFormulaIDs.map(v => policyFormulaMap[v] || v).join(', ')}</span>}
            {titleTypes.length > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">标题类型: {titleTypes.join(', ')}</span>}
            {depCodes.length > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">品牌归属: {depCodes.map(v => depCodeMap[v] || v).join(', ')}</span>}
            {startDate && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">开始日期: {startDate}</span>}
            {endDate && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">结束日期: {endDate}</span>}
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Table
              columns={tableColumns}
              dataSource={rows}
              loading={loading}
              rowKey={(record, index) => {
                return `${record.Title || ''}_${record.PolicyFormulaID || ''}_${record.DepCode || ''}_${index}`;
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
              href="/inns"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回C2系统
            </Link>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
