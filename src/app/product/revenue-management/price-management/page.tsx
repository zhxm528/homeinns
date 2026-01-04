'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { ConfigProvider, Button, Select, Pagination, Table, Input } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';

export default function PriceManagementPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询条件
  const [hotelCode, setHotelCode] = useState<string | undefined>(undefined);
  const [hotelName, setHotelName] = useState<string | undefined>(undefined);
  const [groupCodes, setGroupCodes] = useState<string[]>([]);
  const [pmsTypes, setPmsTypes] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [rateCode, setRateCode] = useState<string>('');
  const [rateCodeName, setRateCodeName] = useState<string>('');
  const [marketCode, setMarketCode] = useState<string>('');
  const [sources, setSources] = useState<string>('');
  const [channels, setChannels] = useState<string[]>([]);

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 从数据中提取选项（用于下拉框）
  const [groupCodeOptions, setGroupCodeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [pmsTypeOptions, setPmsTypeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [hotelCodeOptions, setHotelCodeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [hotelNameOptions, setHotelNameOptions] = useState<Array<{ label: string; value: string }>>([]);

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(Number(value))) return '';
    const num = Number(value);
    const fixed = num.toFixed(2);
    const trimmed = fixed.replace(/\.00$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 枚举转换函数
  const getGroupCodeDisplay = (code: string) => {
    const groupCodeMap: Record<string, string> = {
      'GRP001': '集团1',
      'GRP002': '集团2',
      'JG': '建国',
      'JL': '京伦',
      'NY': '南苑',
      'NH': '云荟',
      'NI': '诺金',
      'NU': '诺岚',
      'KP': '凯宾斯基',
      'YF': '逸扉',
      'WX': '万信'
    };
    return groupCodeMap[code] || code;
  };

  const getPmsTypeDisplay = (type: string) => {
    const pmsTypeMap: Record<string, string> = {
      'PMS_A': 'PMS类型A',
      'PMS_B': 'PMS类型B',
      'Cambridge': '康桥',
      'Opera': '手工填报',
      'P3': '如家P3',
      'Soft': '软连接',
      'X6': '西软X6',
      'XMS': '西软XMS'
    };
    return pmsTypeMap[type] || type;
  };

  const getPropertyTypeDisplay = (type: string) => {
    const propertyTypeMap: Record<string, string> = {
      'HOTEL': '酒店',
      'RESORT': '度假村',
      'BZ': '北展',
      'FCQD': '非产权店',
      'SJJT': '首酒集团',
      'SLJT': '首旅集团',
      'SLZY': '首旅置业',
      'SFT': '首副通'
    };
    return propertyTypeMap[type] || type;
  };

  const getChannelDisplay = (code: string) => {
    const channelMap: Record<string, string> = {
      'CTP': '携程',
      'MDI': '美团',
      'OBR': '飞猪',
      'CTM': '商旅',
      'WEB': '官渠'
    };
    return channelMap[code] || code;
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return date;
  };

  // 表格列定义
  const tableColumns: ColumnsType<any> = useMemo(() => {
    return [
      {
        title: '房价码',
        dataIndex: '房价码',
        key: '房价码',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '房价名称',
        dataIndex: '房价名称',
        key: '房价名称',
        width: 150,
        render: (text: string) => text || '-',
      },
      {
        title: '房型代码',
        dataIndex: '房型代码',
        key: '房型代码',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '开始日期',
        dataIndex: '开始日期',
        key: '开始日期',
        width: 120,
        render: (text: string) => formatDate(text),
      },
      {
        title: '结束日期',
        dataIndex: '结束日期',
        key: '结束日期',
        width: 120,
        render: (text: string) => formatDate(text),
      },
      {
        title: '最小连住天数',
        dataIndex: '最小连住天数',
        key: '最小连住天数',
        width: 120,
        align: 'right',
        render: (value: number) => {
          if (value === null || value === undefined) return '-';
          return String(value);
        },
      },
      {
        title: '最大连住天数',
        dataIndex: '最大连住天数',
        key: '最大连住天数',
        width: 120,
        align: 'right',
        render: (value: number) => {
          if (value === null || value === undefined) return '-';
          return String(value);
        },
      },
      {
        title: '最小预订提前天数',
        dataIndex: '最小预订提前天数',
        key: '最小预订提前天数',
        width: 150,
        align: 'right',
        render: (value: number) => {
          if (value === null || value === undefined) return '-';
          return String(value);
        },
      },
      {
        title: '最大预订提前天数',
        dataIndex: '最大预订提前天数',
        key: '最大预订提前天数',
        width: 150,
        align: 'right',
        render: (value: number) => {
          if (value === null || value === undefined) return '-';
          return String(value);
        },
      },
      {
        title: '市场代码',
        dataIndex: '市场代码',
        key: '市场代码',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '市场名称',
        dataIndex: '市场名称',
        key: '市场名称',
        width: 150,
        render: (text: string) => text || '-',
      },
      {
        title: '来源代码',
        dataIndex: '来源代码',
        key: '来源代码',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '类别码',
        dataIndex: '类别码',
        key: '类别码',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '短备注',
        dataIndex: '短备注',
        key: '短备注',
        width: 150,
        render: (text: string) => text || '-',
      },
      {
        title: '长备注',
        dataIndex: '长备注',
        key: '长备注',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '发布渠道',
        dataIndex: '发布渠道',
        key: '发布渠道',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '分组名称',
        dataIndex: '分组名称',
        key: '分组名称',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '酒店代码',
        dataIndex: '酒店代码',
        key: '酒店代码',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '酒店名称',
        dataIndex: '酒店名称',
        key: '酒店名称',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '酒店类型',
        dataIndex: '酒店类型',
        key: '酒店类型',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '集团代码',
        dataIndex: '集团代码',
        key: '集团代码',
        width: 120,
        render: (text: string) => getGroupCodeDisplay(text || ''),
      },
      {
        title: 'PMS类型',
        dataIndex: 'PMS类型',
        key: 'PMS类型',
        width: 120,
        render: (text: string) => getPmsTypeDisplay(text || ''),
      },
      {
        title: '产权类型',
        dataIndex: '产权类型',
        key: '产权类型',
        width: 120,
        render: (text: string) => getPropertyTypeDisplay(text || ''),
      },
    ];
  }, []);

  // 加载酒店选项列表
  const loadHotelOptions = async () => {
    try {
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('pageSize', '1');
      
      const res = await fetch(`/api/product/revenue-management/price-management?${params.toString()}`);
      const json = await res.json();
      
      if (json.success && json.data && json.data.options) {
        if (json.data.options.hotelCodes && json.data.options.hotelCodes.length > 0) {
          setHotelCodeOptions(json.data.options.hotelCodes);
        }
        if (json.data.options.hotelNames && json.data.options.hotelNames.length > 0) {
          setHotelNameOptions(json.data.options.hotelNames);
        }
      }
    } catch (e) {
      console.error('加载酒店选项列表失败:', e);
      // 即使失败也不影响后续查询，选项会从查询响应中获取
    }
  };

  const handleQuery = async (toPage?: number, toPageSize?: number) => {
    try {
      setLoading(true);
      setError(null);
      const currentPage = toPage ?? page;
      const currentSize = toPageSize ?? pageSize;
      const params = new URLSearchParams();
      if (hotelCode) params.append('hotelCode', hotelCode);
      if (hotelName) params.append('hotelName', hotelName);
      if (groupCodes.length > 0) params.append('groupCodes', groupCodes.join(','));
      if (pmsTypes.length > 0) params.append('pmsTypes', pmsTypes.join(','));
      if (propertyTypes.length > 0) params.append('propertyTypes', propertyTypes.join(','));
      if (rateCode) params.append('rateCode', rateCode);
      if (rateCodeName) params.append('rateCodeName', rateCodeName);
      if (marketCode) params.append('marketCode', marketCode);
      if (sources) params.append('sources', sources);
      if (channels.length > 0) params.append('channels', channels.join(','));
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/revenue-management/price-management?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRows(json.data.items || []);
        setTotal(json.data.total || 0);
        setPage(currentPage);
        setPageSize(currentSize);

        // 从数据中提取选项
        const allData = json.data.items || [];
        const uniqueGroupCodes = Array.from(new Set(allData.map((r: any) => r.集团代码).filter(Boolean)));
        const uniquePmsTypes = Array.from(new Set(allData.map((r: any) => r.PMS类型).filter(Boolean)));
        const uniquePropertyTypes = Array.from(new Set(allData.map((r: any) => r.产权类型).filter(Boolean)));

        setGroupCodeOptions(uniqueGroupCodes.map((v: any) => ({ label: getGroupCodeDisplay(v), value: v })));
        setPmsTypeOptions(uniquePmsTypes.map((v: any) => ({ label: getPmsTypeDisplay(v), value: v })));
        setPropertyTypeOptions(uniquePropertyTypes.map((v: any) => ({ label: getPropertyTypeDisplay(v), value: v })));

        // 从 API 响应中获取酒店编号和酒店名称选项列表
        if (json.data.options) {
          if (json.data.options.hotelCodes && json.data.options.hotelCodes.length > 0) {
            setHotelCodeOptions(json.data.options.hotelCodes);
          }
          if (json.data.options.hotelNames && json.data.options.hotelNames.length > 0) {
            setHotelNameOptions(json.data.options.hotelNames);
          }
        }
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
    setHotelCode(undefined);
    setHotelName(undefined);
    setGroupCodes([]);
    setPmsTypes([]);
    setPropertyTypes([]);
    setRateCode('');
    setRateCodeName('');
    setMarketCode('');
    setSources('');
    setChannels([]);
    setPage(1);
    setPageSize(10);
    setRows([]);
    setTotal(0);
    setError(null);
  };

  // 已选择的查询条件
  const selectedConditions = useMemo(() => {
    const conditions: string[] = [];
    if (hotelCode) conditions.push(`酒店代码: ${hotelCode}`);
    if (hotelName) conditions.push(`酒店名称: ${hotelName}`);
    if (groupCodes.length > 0) conditions.push(`集团代码: ${groupCodes.map(c => getGroupCodeDisplay(c)).join(', ')}`);
    if (pmsTypes.length > 0) conditions.push(`PMS类型: ${pmsTypes.map(t => getPmsTypeDisplay(t)).join(', ')}`);
    if (propertyTypes.length > 0) conditions.push(`产权类型: ${propertyTypes.map(t => getPropertyTypeDisplay(t)).join(', ')}`);
    if (rateCode) conditions.push(`房价码: ${rateCode}`);
    if (rateCodeName) conditions.push(`房价名称: ${rateCodeName}`);
    if (marketCode) conditions.push(`市场代码: ${marketCode}`);
    if (sources) conditions.push(`来源代码: ${sources}`);
    if (channels.length > 0) conditions.push(`发布渠道: ${channels.map(c => getChannelDisplay(c)).join(', ')}`);
    return conditions;
  }, [hotelCode, hotelName, groupCodes, pmsTypes, propertyTypes, rateCode, rateCodeName, marketCode, sources, channels]);

  // 枚举选项
  const groupCodeEnumOptions = [
    { label: '集团1', value: 'GRP001' },
    { label: '集团2', value: 'GRP002' },
    { label: '建国', value: 'JG' },
    { label: '京伦', value: 'JL' },
    { label: '南苑', value: 'NY' },
    { label: '云荟', value: 'NH' },
    { label: '诺金', value: 'NI' },
    { label: '诺岚', value: 'NU' },
    { label: '凯宾斯基', value: 'KP' },
    { label: '逸扉', value: 'YF' },
    { label: '万信', value: 'WX' }
  ];

  const pmsTypeEnumOptions = [
    { label: 'PMS类型A', value: 'PMS_A' },
    { label: 'PMS类型B', value: 'PMS_B' },
    { label: '康桥', value: 'Cambridge' },
    { label: '手工填报', value: 'Opera' },
    { label: '如家P3', value: 'P3' },
    { label: '软连接', value: 'Soft' },
    { label: '西软X6', value: 'X6' },
    { label: '西软XMS', value: 'XMS' }
  ];

  const propertyTypeEnumOptions = [
    { label: '酒店', value: 'HOTEL' },
    { label: '度假村', value: 'RESORT' },
    { label: '北展', value: 'BZ' },
    { label: '非产权店', value: 'FCQD' },
    { label: '首酒集团', value: 'SJJT' },
    { label: '首旅集团', value: 'SLJT' },
    { label: '首旅置业', value: 'SLZY' },
    { label: '首副通', value: 'SFT' }
  ];

  const channelEnumOptions = [
    { label: '携程', value: 'CTP' },
    { label: '美团', value: 'MDI' },
    { label: '飞猪', value: 'OBR' },
    { label: '商旅', value: 'CTM' },
    { label: '官渠', value: 'WEB' }
  ];

  // 页面加载时先加载酒店选项列表，然后再执行查询
  useEffect(() => {
    const initialize = async () => {
      // 先加载酒店选项列表，等待完成后再执行查询
      await loadHotelOptions();
      // 然后执行查询
      handleQuery(1, 10);
    };
    initialize();
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">价格管理</h1>
                <p className="text-gray-600">查询和管理房价码信息</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店代码</label>
                <Select
                  allowClear
                  showSearch
                  placeholder="选择或输入酒店代码（支持自查询）..."
                  className="w-full"
                  value={hotelCode}
                  onChange={(val) => setHotelCode(val || undefined)}
                  options={hotelCodeOptions.length > 0 ? hotelCodeOptions : []}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店名称</label>
                <Select
                  allowClear
                  showSearch
                  placeholder="选择或输入酒店名称（支持自查询）..."
                  className="w-full"
                  value={hotelName}
                  onChange={(val) => setHotelName(val || undefined)}
                  options={hotelNameOptions.length > 0 ? hotelNameOptions : []}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">集团代码</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择集团代码"
                  className="w-full"
                  value={groupCodes}
                  onChange={(vals) => setGroupCodes(vals as string[])}
                  options={groupCodeEnumOptions}
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
                  options={pmsTypeEnumOptions}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
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
                  options={propertyTypeEnumOptions}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">房价码</label>
                <Input
                  placeholder="输入房价码..."
                  value={rateCode}
                  onChange={(e) => setRateCode(e.target.value)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">房价名称</label>
                <Input
                  placeholder="输入房价名称..."
                  value={rateCodeName}
                  onChange={(e) => setRateCodeName(e.target.value)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">市场代码</label>
                <Input
                  placeholder="输入市场代码..."
                  value={marketCode}
                  onChange={(e) => setMarketCode(e.target.value)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">来源代码</label>
                <Input
                  placeholder="输入来源代码..."
                  value={sources}
                  onChange={(e) => setSources(e.target.value)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">发布渠道</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择发布渠道"
                  className="w-full"
                  value={channels}
                  onChange={(vals) => setChannels(vals as string[])}
                  options={channelEnumOptions}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-6 flex gap-4">
              <Button
                type="primary"
                onClick={() => handleQuery(1, pageSize)}
                loading={loading}
              >
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

          {/* 已选择的查询条件 */}
          {selectedConditions.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-sm font-medium text-blue-900 mb-2">已选择的查询条件：</div>
              <div className="flex flex-wrap gap-2">
                {selectedConditions.map((condition, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 表格 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table
              columns={tableColumns}
              dataSource={rows}
              loading={loading}
              scroll={{ x: 3000, y: 600 }}
              pagination={false}
              rowKey={(record) => `${record.酒店代码 || ''}-${record.房价码 || ''}`}
            />
            <div className="p-4 border-t border-gray-200">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                pageSizeOptions={['10', '50', '100', '1000']}
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                onChange={(newPage, newPageSize) => {
                  handleQuery(newPage, newPageSize);
                }}
                onShowSizeChange={(current, size) => {
                  handleQuery(1, size);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
