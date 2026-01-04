'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { ConfigProvider, Button, Select, Pagination, Table, Input, DatePicker } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';
// @ts-ignore: dayjs types might be missing
import dayjs, { Dayjs } from 'dayjs';

export default function HotelGuestHistoryOrderPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询条件
  const [dateType, setDateType] = useState<string>('DepDate'); // 日期类型：CreateDate, ArrDate, DepDate
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [marketplaces, setMarketplaces] = useState<string[]>([]);
  const [agentCds, setAgentCds] = useState<string[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<string[]>([]);
  const [hotelCode, setHotelCode] = useState<string | undefined>(undefined);
  const [hotelName, setHotelName] = useState<string | undefined>(undefined);
  const [groupCodes, setGroupCodes] = useState<string[]>([]);
  const [pmsTypes, setPmsTypes] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [resAccount, setResAccount] = useState<string>('');
  const [pmsOrderNo, setPmsOrderNo] = useState<string>('');
  const [memberName, setMemberName] = useState<string>('');
  const [roomCode, setRoomCode] = useState<string>('');
  const [rateCode, setRateCode] = useState<string>('');

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 从数据中提取选项（用于下拉框）
  const [groupCodeOptions, setGroupCodeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [pmsTypeOptions, setPmsTypeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [provinceOptions, setProvinceOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [cityOptions, setCityOptions] = useState<Array<{ label: string; value: string }>>([]);
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
      'BZ': '北展',
      'FCQD': '非产权店',
      'SJJT': '首酒集团',
      'SLJT': '首旅集团',
      'SLZY': '首旅置业',
      'SFT': '首副通'
    };
    return propertyTypeMap[type] || type;
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return '-';
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toISOString().split('T')[0];
    } catch {
      return String(date);
    }
  };

  // 表格列定义
  const tableColumns: ColumnsType<any> = useMemo(() => {
    return [
      {
        title: 'CRS订单号',
        dataIndex: 'CRS订单号',
        key: 'CRS订单号',
        fixed: 'left',
        width: 180,
        render: (text: string) => text || '-',
      },
      {
        title: 'PMS订单号',
        dataIndex: 'PMS订单号',
        key: 'PMS订单号',
        width: 150,
        render: (text: string) => text || '-',
      },
      {
        title: '订单状态',
        dataIndex: '订单状态',
        key: '订单状态',
        width: 100,
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
        title: '渠道代码',
        dataIndex: '渠道代码',
        key: '渠道代码',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '市场代码',
        dataIndex: '市场代码',
        key: '市场代码',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '开始日期',
        dataIndex: '入住日期',
        key: '入住日期',
        width: 120,
        render: (text: string | Date) => formatDate(text),
      },
      {
        title: '结束日期',
        dataIndex: '离店日期',
        key: '离店日期',
        width: 120,
        render: (text: string | Date) => formatDate(text),
      },
      {
        title: '客人姓名',
        dataIndex: '客人姓名',
        key: '客人姓名',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '房型代码',
        dataIndex: '房型代码',
        key: '房型代码',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '房型名称',
        dataIndex: '房型名称',
        key: '房型名称',
        width: 150,
        render: (text: string) => text || '-',
      },
      {
        title: '房价码',
        dataIndex: '房价码',
        key: '房价码',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '房价码名称',
        dataIndex: '房价码名称',
        key: '房价码名称',
        width: 150,
        render: (text: string) => text || '-',
      },
      {
        title: '费用类型',
        dataIndex: '费用类型',
        key: '费用类型',
        width: 100,
        render: (text: string) => text || '-',
      },
      {
        title: '公司档案',
        dataIndex: '公司档案',
        key: '公司档案',
        width: 150,
        render: (text: string) => text || '-',
      },
      {
        title: '预订日期',
        dataIndex: '预订日期',
        key: '预订日期',
        width: 120,
        render: (text: string | Date) => formatDate(text),
      },
      {
        title: '间夜数',
        dataIndex: '间夜数',
        key: '间夜数',
        width: 100,
        align: 'right',
        render: (value: number) => {
          if (value === null || value === undefined) return '-';
          return formatNumber(value);
        },
      },
      {
        title: '客房收入',
        dataIndex: '客房收入',
        key: '客房收入',
        width: 120,
        align: 'right',
        render: (value: number) => {
          if (value === null || value === undefined) return '-';
          return formatNumber(value);
        },
      },
      {
        title: '餐饮收入',
        dataIndex: '餐饮收入',
        key: '餐饮收入',
        width: 120,
        align: 'right',
        render: (value: number) => {
          if (value === null || value === undefined) return '-';
          return formatNumber(value);
        },
      },
      {
        title: '其他收入',
        dataIndex: '其他收入',
        key: '其他收入',
        width: 120,
        align: 'right',
        render: (value: number) => {
          if (value === null || value === undefined) return '-';
          return formatNumber(value);
        },
      },
      {
        title: '总收入',
        dataIndex: '总收入',
        key: '总收入',
        width: 120,
        align: 'right',
        render: (value: number) => {
          if (value === null || value === undefined) return '-';
          return formatNumber(value);
        },
      },
    ];
  }, []);

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date ? date.format('YYYY-MM-DD') : '');
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDate(date ? date.format('YYYY-MM-DD') : '');
  };

  const handleQuery = async (toPage?: number, toPageSize?: number) => {
    try {
      setLoading(true);
      setError(null);
      const currentPage = toPage ?? page;
      const currentSize = toPageSize ?? pageSize;
      const params = new URLSearchParams();
      if (dateType) params.append('dateType', dateType);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (marketplaces.length > 0) params.append('marketplaces', marketplaces.join(','));
      if (agentCds.length > 0) params.append('agentCds', agentCds.join(','));
      if (orderStatuses.length > 0) params.append('orderStatuses', orderStatuses.join(','));
      if (hotelCode) params.append('hotelCode', hotelCode);
      if (hotelName) params.append('hotelName', hotelName);
      if (groupCodes.length > 0) params.append('groupCodes', groupCodes.join(','));
      if (pmsTypes.length > 0) params.append('pmsTypes', pmsTypes.join(','));
      if (propertyTypes.length > 0) params.append('propertyTypes', propertyTypes.join(','));
      if (provinces.length > 0) params.append('provinces', provinces.join(','));
      if (cities.length > 0) params.append('cities', cities.join(','));
      if (resAccount) params.append('resAccount', resAccount);
      if (pmsOrderNo) params.append('pmsOrderNo', pmsOrderNo);
      if (memberName) params.append('memberName', memberName);
      if (roomCode) params.append('roomCode', roomCode);
      if (rateCode) params.append('rateCode', rateCode);
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/order-management/hotel-guest-history-order?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRows(json.data.items || []);
        setTotal(json.data.total || 0);
        setPage(currentPage);
        setPageSize(currentSize);

        // 从数据中提取选项
        const allData = json.data.items || [];
        const uniqueGroupCodes = Array.from(new Set(allData.map((r: any) => r.管理公司).filter(Boolean)));
        const uniquePmsTypes = Array.from(new Set(allData.map((r: any) => r.PMS类型).filter(Boolean)));
        const uniquePropertyTypes = Array.from(new Set(allData.map((r: any) => r.产权类型).filter(Boolean)));
        const uniqueProvinces = Array.from(new Set(allData.map((r: any) => r.省份).filter(Boolean)));
        const uniqueCities = Array.from(new Set(allData.map((r: any) => r.城市).filter(Boolean)));

        setGroupCodeOptions(uniqueGroupCodes.map((v: any) => ({ label: getGroupCodeDisplay(v), value: v })));
        setPmsTypeOptions(uniquePmsTypes.map((v: any) => ({ label: getPmsTypeDisplay(v), value: v })));
        setPropertyTypeOptions(uniquePropertyTypes.map((v: any) => ({ label: getPropertyTypeDisplay(v), value: v })));
        setProvinceOptions(uniqueProvinces.map((v: any) => ({ label: v, value: v })));
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
    setDateType('DepDate');
    setStartDate('');
    setEndDate('');
    setMarketplaces([]);
    setAgentCds([]);
    setOrderStatuses([]);
    setHotelCode(undefined);
    setHotelName(undefined);
    setGroupCodes([]);
    setPmsTypes([]);
    setPropertyTypes([]);
    setProvinces([]);
    setCities([]);
    setResAccount('');
    setPmsOrderNo('');
    setMemberName('');
    setRoomCode('');
    setRateCode('');
    setPage(1);
    setPageSize(10);
    setRows([]);
    setTotal(0);
    setError(null);
  };

  // 页面加载时不自动查询，等待用户输入条件后手动查询

  // 已选择的查询条件
  const selectedConditions = useMemo(() => {
    const conditions: string[] = [];
    const dateTypeMap: Record<string, string> = {
      'CreateDate': '客史上传日期',
      'ArrDate': '入住日期',
      'DepDate': '离店日期'
    };
    if (dateType && (startDate || endDate)) {
      conditions.push(`日期类型: ${dateTypeMap[dateType] || dateType}`);
    }
    if (startDate) conditions.push(`开始日期: ${startDate}`);
    if (endDate) conditions.push(`结束日期: ${endDate}`);
    if (marketplaces.length > 0) conditions.push(`市场代码: ${marketplaces.join(', ')}`);
    if (agentCds.length > 0) conditions.push(`渠道代码: ${agentCds.join(', ')}`);
    if (orderStatuses.length > 0) conditions.push(`排除订单状态: ${orderStatuses.join(', ')}`);
    if (hotelCode) conditions.push(`酒店代码: ${hotelCode}`);
    if (hotelName) conditions.push(`酒店名称: ${hotelName}`);
    if (groupCodes.length > 0) conditions.push(`管理公司: ${groupCodes.map(c => getGroupCodeDisplay(c)).join(', ')}`);
    if (pmsTypes.length > 0) conditions.push(`PMS类型: ${pmsTypes.map(t => getPmsTypeDisplay(t)).join(', ')}`);
    if (propertyTypes.length > 0) conditions.push(`产权类型: ${propertyTypes.map(t => getPropertyTypeDisplay(t)).join(', ')}`);
    if (provinces.length > 0) conditions.push(`省份: ${provinces.join(', ')}`);
    if (cities.length > 0) conditions.push(`城市: ${cities.join(', ')}`);
    if (resAccount) conditions.push(`CRS订单号: ${resAccount}`);
    if (pmsOrderNo) conditions.push(`PMS订单号: ${pmsOrderNo}`);
    if (memberName) conditions.push(`客人姓名: ${memberName}`);
    if (roomCode) conditions.push(`房型代码: ${roomCode}`);
    if (rateCode) conditions.push(`房价码: ${rateCode}`);
    return conditions;
  }, [startDate, endDate, marketplaces, agentCds, orderStatuses, hotelCode, hotelName, groupCodes, pmsTypes, propertyTypes, provinces, cities, resAccount, pmsOrderNo, memberName, roomCode, rateCode]);

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

  const pmsTypeEnumOptions = [
    { label: '康桥', value: 'Cambridge' },
    { label: '手工填报', value: 'Opera' },
    { label: '如家P3', value: 'P3' },
    { label: '软连接', value: 'Soft' },
    { label: '西软X6', value: 'X6' },
    { label: '西软XMS', value: 'XMS' }
  ];

  const propertyTypeEnumOptions = [
    { label: '北展', value: 'BZ' },
    { label: '非产权店', value: 'FCQD' },
    { label: '首酒集团', value: 'SJJT' },
    { label: '首旅集团', value: 'SLJT' },
    { label: '首旅置业', value: 'SLZY' },
    { label: '首副通', value: 'SFT' }
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题和返回按钮 */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">酒店客史订单</h1>
                <p className="text-gray-600">查询和管理酒店客史订单信息</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">日期类型</label>
                <Select
                  className="w-full"
                  value={dateType}
                  onChange={(val) => setDateType(val)}
                  options={[
                    { label: '客史上传日期', value: 'CreateDate' },
                    { label: '入住日期', value: 'ArrDate' },
                    { label: '离店日期', value: 'DepDate' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  value={startDate ? dayjs(startDate, 'YYYY-MM-DD') : null}
                  onChange={handleStartDateChange as any}
                  placeholder="选择开始日期"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  value={endDate ? dayjs(endDate, 'YYYY-MM-DD') : null}
                  onChange={handleEndDateChange as any}
                  placeholder="选择结束日期"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">市场代码</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择市场代码"
                  className="w-full"
                  value={marketplaces}
                  onChange={(vals) => setMarketplaces(vals as string[])}
                  options={[] as Array<{ label: string; value: string }>}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">渠道代码</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择渠道代码"
                  className="w-full"
                  value={agentCds}
                  onChange={(vals) => setAgentCds(vals as string[])}
                  options={[] as Array<{ label: string; value: string }>}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">排除订单状态</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择要排除的订单状态"
                  className="w-full"
                  value={orderStatuses}
                  onChange={(vals) => setOrderStatuses(vals as string[])}
                  options={[
                    { label: 'Canceled', value: 'Canceled' },
                    { label: 'NW', value: 'NW' },
                    { label: 'C', value: 'C' }
                  ]}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">省份</label>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="选择省份"
                  className="w-full"
                  value={provinces}
                  onChange={(vals) => setProvinces(vals as string[])}
                  options={provinceOptions.length > 0 ? provinceOptions : []}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">CRS订单号</label>
                <Input
                  placeholder="输入CRS订单号..."
                  value={resAccount}
                  onChange={(e) => setResAccount(e.target.value)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PMS订单号</label>
                <Input
                  placeholder="输入PMS订单号..."
                  value={pmsOrderNo}
                  onChange={(e) => setPmsOrderNo(e.target.value)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">客人姓名</label>
                <Input
                  placeholder="输入客人姓名..."
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  allowClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">房型代码</label>
                <Input
                  placeholder="输入房型代码..."
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  allowClear
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
              rowKey={(record) => {
                // 使用多个字段组合生成唯一key，避免使用已弃用的index参数
                return `${record.CRS订单号 || ''}-${record.PMS订单号 || ''}-${record.酒店代码 || ''}-${record.入住日期 || ''}-${record.离店日期 || ''}-${record.客人姓名 || ''}`;
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
