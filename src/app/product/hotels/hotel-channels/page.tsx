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

export default function HotelChannelsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询条件
  const [hotelCode, setHotelCode] = useState<string | undefined>(undefined);
  const [hotelName, setHotelName] = useState<string | undefined>(undefined);
  const [groupCodes, setGroupCodes] = useState<string[]>([]);
  const [hotelTypes, setHotelTypes] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [pmsTypes, setPmsTypes] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [urbanAreas, setUrbanAreas] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [isDelete, setIsDelete] = useState<string>('');
  const [channelCode, setChannelCode] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 从数据中提取选项（用于下拉框）
  const [groupCodeOptions, setGroupCodeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [hotelTypeOptions, setHotelTypeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [pmsTypeOptions, setPmsTypeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [areaOptions, setAreaOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [urbanAreaOptions, setUrbanAreaOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [cityOptions, setCityOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [hotelCodeOptions, setHotelCodeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [hotelNameOptions, setHotelNameOptions] = useState<Array<{ label: string; value: string }>>([]);

  // 枚举转换函数
  const getGroupCodeDisplay = (code: string) => {
    const groupCodeMap: Record<string, string> = {
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

  const getHotelTypeDisplay = (type: string) => {
    const hotelTypeMap: Record<string, string> = {
      'H002': '托管',
      'H003': '加盟',
      'H004': '直营/全委'
    };
    return hotelTypeMap[type] || type;
  };

  const getPropertyTypeDisplay = (type: string) => {
    const propertyTypeMap: Record<string, string> = {
      'BZ': '北展',
      'FCQD': '非产权店',
      'SJJT': '首酒集团',
      'SLJT': '首旅集团',
      'SLZY': '首旅置业',
      'SFT': '首副通'
    };
    return propertyTypeMap[type] || type;
  };

  const getPmsTypeDisplay = (type: string) => {
    const pmsTypeMap: Record<string, string> = {
      'Cambridge': '康桥',
      'Opera': '手工填报',
      'P3': '如家P3',
      'Soft': '软连接',
      'X6': '西软X6',
      'XMS': '西软XMS'
    };
    return pmsTypeMap[type] || type;
  };

  const getStatusDisplay = (status: number | string) => {
    const statusMap: Record<number | string, string> = {
      1: '启用',
      0: '停用',
      '': '全部'
    };
    return statusMap[status] || '未知';
  };

  const getIsDeleteDisplay = (isDelete: number | string) => {
    const isDeleteMap: Record<number | string, string> = {
      1: '已删除',
      0: '正常',
      '': '全部'
    };
    return isDeleteMap[isDelete] || '未知';
  };

  // 表格列定义
  const tableColumns: ColumnsType<any> = useMemo(() => {
    return [
      {
        title: '渠道代码',
        dataIndex: '渠道代码',
        key: '渠道代码',
        fixed: 'left',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '渠道名称',
        dataIndex: '渠道名称',
        key: '渠道名称',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '酒店编号',
        dataIndex: '酒店编号',
        key: '酒店编号',
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
        title: '管理公司',
        dataIndex: '管理公司',
        key: '管理公司',
        width: 120,
        render: (text: string) => getGroupCodeDisplay(text || ''),
      },
      {
        title: '酒店类型',
        dataIndex: '酒店类型',
        key: '酒店类型',
        width: 120,
        render: (text: string) => getHotelTypeDisplay(text || ''),
      },
      {
        title: '产权类型',
        dataIndex: '产权类型',
        key: '产权类型',
        width: 120,
        render: (text: string) => getPropertyTypeDisplay(text || ''),
      },
      {
        title: 'PMS类型',
        dataIndex: 'PMS类型',
        key: 'PMS类型',
        width: 120,
        render: (text: string) => getPmsTypeDisplay(text || ''),
      },
      {
        title: '大区',
        dataIndex: '大区',
        key: '大区',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '城区',
        dataIndex: '城区',
        key: '城区',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '省份',
        dataIndex: '省份',
        key: '省份',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '城市',
        dataIndex: '城市',
        key: '城市',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '状态',
        dataIndex: '状态',
        key: '状态',
        width: 100,
        render: (text: number | string) => getStatusDisplay(text),
      },
      {
        title: '是否删除',
        dataIndex: '是否删除',
        key: '是否删除',
        width: 100,
        render: (text: number | string) => getIsDeleteDisplay(text),
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
      if (hotelCode) params.append('hotelCode', hotelCode);
      if (hotelName) params.append('hotelName', hotelName);
      if (groupCodes.length > 0) params.append('groupCodes', groupCodes.join(','));
      if (hotelTypes.length > 0) params.append('hotelTypes', hotelTypes.join(','));
      if (propertyTypes.length > 0) params.append('propertyTypes', propertyTypes.join(','));
      if (pmsTypes.length > 0) params.append('pmsTypes', pmsTypes.join(','));
      if (areas.length > 0) params.append('areas', areas.join(','));
      if (urbanAreas.length > 0) params.append('urbanAreas', urbanAreas.join(','));
      if (cities.length > 0) params.append('cities', cities.join(','));
      if (status !== '') params.append('status', status);
      if (isDelete !== '') params.append('isDelete', isDelete);
      if (channelCode) params.append('channelCode', channelCode);
      if (channelName) params.append('channelName', channelName);
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/hotels/hotel-channels?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRows(json.data.items || []);
        setTotal(json.data.total || 0);
        setPage(currentPage);
        setPageSize(currentSize);

        // 从数据中提取选项
        const allData = json.data.items || [];
        const uniqueGroupCodes = Array.from(new Set(allData.map((r: any) => r.管理公司).filter(Boolean)));
        const uniqueHotelTypes = Array.from(new Set(allData.map((r: any) => r.酒店类型).filter(Boolean)));
        const uniquePropertyTypes = Array.from(new Set(allData.map((r: any) => r.产权类型).filter(Boolean)));
        const uniquePmsTypes = Array.from(new Set(allData.map((r: any) => r.PMS类型).filter(Boolean)));
        const uniqueAreas = Array.from(new Set(allData.map((r: any) => r.大区).filter(Boolean)));
        const uniqueUrbanAreas = Array.from(new Set(allData.map((r: any) => r.城区).filter(Boolean)));
        const uniqueCities = Array.from(new Set(allData.map((r: any) => r.城市).filter(Boolean)));

        setGroupCodeOptions(uniqueGroupCodes.map((v: any) => ({ label: getGroupCodeDisplay(v), value: v })));
        setHotelTypeOptions(uniqueHotelTypes.map((v: any) => ({ label: getHotelTypeDisplay(v), value: v })));
        setPropertyTypeOptions(uniquePropertyTypes.map((v: any) => ({ label: getPropertyTypeDisplay(v), value: v })));
        setPmsTypeOptions(uniquePmsTypes.map((v: any) => ({ label: getPmsTypeDisplay(v), value: v })));
        setAreaOptions(uniqueAreas.map((v: any) => ({ label: v, value: v })));
        setUrbanAreaOptions(uniqueUrbanAreas.map((v: any) => ({ label: v, value: v })));
        setCityOptions(uniqueCities.map((v: any) => ({ label: v, value: v })));

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
    setHotelTypes([]);
    setPropertyTypes([]);
    setPmsTypes([]);
    setAreas([]);
    setUrbanAreas([]);
    setCities([]);
    setStatus('');
    setIsDelete('');
    setChannelCode('');
    setChannelName('');
    setPage(1);
    setPageSize(10);
    setRows([]);
    setTotal(0);
    setError(null);
  };

  // 页面加载时自动查询
  useEffect(() => {
    handleQuery(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 已选择的查询条件
  const selectedConditions = useMemo(() => {
    const conditions: string[] = [];
    if (hotelCode) conditions.push(`酒店编号: ${hotelCode}`);
    if (hotelName) conditions.push(`酒店名称: ${hotelName}`);
    if (groupCodes.length > 0) conditions.push(`管理公司: ${groupCodes.map(c => getGroupCodeDisplay(c)).join(', ')}`);
    if (hotelTypes.length > 0) conditions.push(`酒店类型: ${hotelTypes.map(t => getHotelTypeDisplay(t)).join(', ')}`);
    if (propertyTypes.length > 0) conditions.push(`产权类型: ${propertyTypes.map(t => getPropertyTypeDisplay(t)).join(', ')}`);
    if (pmsTypes.length > 0) conditions.push(`PMS类型: ${pmsTypes.map(t => getPmsTypeDisplay(t)).join(', ')}`);
    if (areas.length > 0) conditions.push(`大区: ${areas.join(', ')}`);
    if (urbanAreas.length > 0) conditions.push(`城区: ${urbanAreas.join(', ')}`);
    if (cities.length > 0) conditions.push(`城市: ${cities.join(', ')}`);
    if (status !== '') conditions.push(`状态: ${getStatusDisplay(status)}`);
    if (isDelete !== '') conditions.push(`是否删除: ${getIsDeleteDisplay(isDelete)}`);
    if (channelCode) conditions.push(`渠道代码: ${channelCode}`);
    if (channelName) conditions.push(`渠道名称: ${channelName}`);
    return conditions;
  }, [hotelCode, hotelName, groupCodes, hotelTypes, propertyTypes, pmsTypes, areas, urbanAreas, cities, status, isDelete, channelCode, channelName]);

  // 枚举选项
  const groupCodeEnumOptions = [
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

  const hotelTypeEnumOptions = [
    { label: '托管', value: 'H002' },
    { label: '加盟', value: 'H003' },
    { label: '直营/全委', value: 'H004' }
  ];

  const propertyTypeEnumOptions = [
    { label: '北展', value: 'BZ' },
    { label: '非产权店', value: 'FCQD' },
    { label: '首酒集团', value: 'SJJT' },
    { label: '首旅集团', value: 'SLJT' },
    { label: '首旅置业', value: 'SLZY' },
    { label: '首副通', value: 'SFT' }
  ];

  const pmsTypeEnumOptions = [
    { label: '康桥', value: 'Cambridge' },
    { label: '手工填报', value: 'Opera' },
    { label: '如家P3', value: 'P3' },
    { label: '软连接', value: 'Soft' },
    { label: '西软X6', value: 'X6' },
    { label: '西软XMS', value: 'XMS' }
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题和返回按钮 */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">酒店渠道</h1>
                <p className="text-gray-600">查询和管理酒店渠道信息</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店编号</label>
                <Select
                  allowClear
                  showSearch
                  placeholder="选择或输入酒店编号（支持自查询）..."
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
                <label className="block text-sm font-medium text-gray-700 mb-2">管理公司</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择管理公司"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店类型</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择酒店类型"
                  className="w-full"
                  value={hotelTypes}
                  onChange={(vals) => setHotelTypes(vals as string[])}
                  options={hotelTypeEnumOptions}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">大区</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择大区"
                  className="w-full"
                  value={areas}
                  onChange={(vals) => setAreas(vals as string[])}
                  options={areaOptions.length > 0 ? areaOptions : []}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">城区</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择城区"
                  className="w-full"
                  value={urbanAreas}
                  onChange={(vals) => setUrbanAreas(vals as string[])}
                  options={urbanAreaOptions.length > 0 ? urbanAreaOptions : []}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
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
                  options={cityOptions.length > 0 ? cityOptions : []}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                <Select
                  allowClear
                  placeholder="选择状态"
                  className="w-full"
                  value={status || undefined}
                  onChange={(val) => setStatus(val || '')}
                  options={[
                    { label: '全部', value: '' },
                    { label: '启用', value: '1' },
                    { label: '停用', value: '0' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">是否删除</label>
                <Select
                  allowClear
                  placeholder="选择是否删除"
                  className="w-full"
                  value={isDelete || undefined}
                  onChange={(val) => setIsDelete(val || '')}
                  options={[
                    { label: '全部', value: '' },
                    { label: '正常', value: '0' },
                    { label: '已删除', value: '1' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">渠道代码</label>
                <Input
                  placeholder="输入渠道代码..."
                  value={channelCode}
                  onChange={(e) => setChannelCode(e.target.value)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">渠道名称</label>
                <Input
                  placeholder="输入渠道名称..."
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  allowClear
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
              scroll={{ x: 2000, y: 600 }}
              pagination={false}
              rowKey={(record) => {
                return `${record.渠道代码 || ''}-${record.酒店编号 || ''}-${record.渠道名称 || ''}`;
              }}
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
