'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useMemo } from 'react';
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
// @ts-ignore: xlsx types might be missing
import * as XLSX from 'xlsx';

export default function ChannelOrderPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // 查询条件
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [hotelCode, setHotelCode] = useState<string>('');
  const [hotelName, setHotelName] = useState<string>('');
  const [agentCd, setAgentCd] = useState<string>('');
  const [groupCode, setGroupCode] = useState<string>('YF');
  const [crsStatus, setCrsStatus] = useState<string>('');

  // 表格数据与分页
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 从数据中提取选项（用于下拉框）
  const [hotelCodeOptions, setHotelCodeOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [hotelNameOptions, setHotelNameOptions] = useState<Array<{ label: string; value: string }>>([]);
  
  // 渠道代码枚举值（固定值）
  const agentCdEnumOptions = [
    { label: '凯悦', value: 'HYATT' },
    { label: 'Agoda', value: 'CHAGDA' },
    { label: '美团', value: 'CHMTTG' },
    { label: '逸扉小程序', value: 'UCW' },
    { label: '飞猪', value: 'CHFZLX' },
    { label: '携程', value: 'CHCTRP' },
    { label: '逸扉万信商旅小程序', value: 'UCC' },
    { label: '抖音', value: 'CHDYRL' },
    { label: '商旅大客户', value: 'CTM' },
    { label: '官网', value: '800333' },
    { label: 'Booking', value: 'CHDBBK' },
    { label: '首享会', value: 'CHZKTS' }
  ];

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(Number(value))) return '';
    const num = Number(value);
    const fixed = num.toFixed(2);
    const trimmed = fixed.replace(/\.00$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
        title: '订单号',
        dataIndex: 'OrderNo',
        key: 'OrderNo',
        fixed: 'left',
        width: 150,
        render: (text: string) => text || '-',
      },
      {
        title: 'PMS订单号',
        dataIndex: 'PMSOrderNo',
        key: 'PMSOrderNo',
        width: 150,
        render: (text: string) => text || '-',
      },
      {
        title: '酒店代码',
        dataIndex: 'HotelCd',
        key: 'HotelCd',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '酒店名称',
        dataIndex: 'HotelName',
        key: 'HotelName',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '房价码',
        dataIndex: 'RateCode',
        key: 'RateCode',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '房型代码',
        dataIndex: 'RoomTypeCode',
        key: 'RoomTypeCode',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '入住日期',
        dataIndex: 'ArrDate',
        key: 'ArrDate',
        width: 120,
        render: (text: string | Date) => formatDate(text),
      },
      {
        title: '离店日期',
        dataIndex: 'DepDate',
        key: 'DepDate',
        width: 120,
        render: (text: string | Date) => formatDate(text),
      },
      {
        title: '房间数',
        dataIndex: 'RoomNum',
        key: 'RoomNum',
        width: 100,
        align: 'right',
        render: (value: number) => {
          if (value === null || value === undefined) return '-';
          return String(value);
        },
      },
      {
        title: '实际价格',
        dataIndex: 'ActualRt',
        key: 'ActualRt',
        width: 120,
        align: 'right',
        render: (value: number) => {
          if (value === null || value === undefined) return '-';
          return formatNumber(value);
        },
      },
      {
        title: '订单状态',
        dataIndex: 'CrsStatus',
        key: 'CrsStatus',
        width: 100,
        render: (text: string) => text || '-',
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
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (hotelCode) params.append('hotelCode', hotelCode);
      if (hotelName) params.append('hotelName', hotelName);
      if (agentCd) params.append('agentCd', agentCd);
      if (groupCode) params.append('groupCode', groupCode);
      if (crsStatus) params.append('crsStatus', crsStatus);
      params.append('page', String(currentPage));
      params.append('pageSize', String(currentSize));

      const res = await fetch(`/api/product/yifei/channel-order?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRows(json.data.items || []);
        setTotal(json.data.total || 0);
        setPage(currentPage);
        setPageSize(currentSize);

        // 从数据中提取选项
        const allData = json.data.items || [];
        const uniqueHotelCodes = Array.from(new Set(allData.map((r: any) => r.HotelCd).filter(Boolean)));
        const uniqueHotelNames = Array.from(new Set(allData.map((r: any) => r.HotelName).filter(Boolean)));
        const uniqueAgentCds = Array.from(new Set(allData.map((r: any) => r.AgentCd).filter(Boolean)));

        setHotelCodeOptions(uniqueHotelCodes.map((v: any) => ({ label: v, value: v })));
        setHotelNameOptions(uniqueHotelNames.map((v: any) => ({ label: v, value: v })));

        // 从 API 响应中获取选项列表
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
    setStartDate('');
    setEndDate('');
    setHotelCode('');
    setHotelName('');
    setAgentCd('');
    setGroupCode('YF');
    setCrsStatus('');
    setPage(1);
    setPageSize(10);
    setRows([]);
    setTotal(0);
    setError(null);
  };

  // 导出Excel
  const handleExport = async () => {
    try {
      setExporting(true);
      setError(null);

      // 获取所有数据（不分页）
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (hotelCode) params.append('hotelCode', hotelCode);
      if (hotelName) params.append('hotelName', hotelName);
      if (agentCd) params.append('agentCd', agentCd);
      if (groupCode) params.append('groupCode', groupCode);
      if (crsStatus) params.append('crsStatus', crsStatus);
      params.append('page', '1');
      params.append('pageSize', '10000'); // 获取全部数据

      const res = await fetch(`/api/product/yifei/channel-order?${params.toString()}`);
      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || json.message || '获取数据失败');
      }

      const allItems = json.data.items || [];

      if (allItems.length === 0) {
        setError('没有数据可导出');
        return;
      }

      // 准备Excel数据，使用表格中的列名
      const excelData = allItems.map((item: any) => ({
        '订单号': item.OrderNo || '',
        'PMS订单号': item.PMSOrderNo || '',
        '酒店代码': item.HotelCd || '',
        '酒店名称': item.HotelName || '',
        '房价码': item.RateCode || '',
        '房型代码': item.RoomTypeCode || '',
        '入住日期': formatDate(item.ArrDate),
        '离店日期': formatDate(item.DepDate),
        '房间数': item.RoomNum || 0,
        '实际价格': formatNumber(item.ActualRt),
        '订单状态': item.CrsStatus || '',
      }));

      // 创建工作簿和工作表
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // 设置列宽
      ws['!cols'] = [
        { wch: 18 }, // 订单号
        { wch: 18 }, // PMS订单号
        { wch: 12 }, // 酒店代码
        { wch: 25 }, // 酒店名称
        { wch: 12 }, // 房价码
        { wch: 12 }, // 房型代码
        { wch: 12 }, // 入住日期
        { wch: 12 }, // 离店日期
        { wch: 10 }, // 房间数
        { wch: 15 }, // 实际价格
        { wch: 12 }, // 订单状态
      ];

      // 添加工作表到工作簿
      XLSX.utils.book_append_sheet(wb, ws, '渠道订单');

      // 生成文件名
      const dateRange = startDate && endDate 
        ? `${startDate}_${endDate}` 
        : startDate 
        ? startDate 
        : dayjs().format('YYYY-MM-DD');
      const fileName = `渠道订单_${dateRange}_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;

      // 导出文件
      XLSX.writeFile(wb, fileName);
      setError(null);
    } catch (e) {
      console.error('导出Excel失败:', e);
      setError('导出Excel失败，请检查网络连接');
    } finally {
      setExporting(false);
    }
  };

  // 已选择的查询条件
  const selectedConditions = useMemo(() => {
    const conditions: Array<{ key: string; label: string; onRemove: () => void }> = [];
    if (startDate) {
      conditions.push({
        key: 'startDate',
        label: `开始日期: ${startDate}`,
        onRemove: () => setStartDate('')
      });
    }
    if (endDate) {
      conditions.push({
        key: 'endDate',
        label: `结束日期: ${endDate}`,
        onRemove: () => setEndDate('')
      });
    }
    if (hotelCode) {
      conditions.push({
        key: 'hotelCode',
        label: `酒店代码: ${hotelCode}`,
        onRemove: () => setHotelCode('')
      });
    }
    if (hotelName) {
      conditions.push({
        key: 'hotelName',
        label: `酒店名称: ${hotelName}`,
        onRemove: () => setHotelName('')
      });
    }
    if (agentCd) {
      conditions.push({
        key: 'agentCd',
        label: `渠道代码: ${agentCd}`,
        onRemove: () => setAgentCd('')
      });
    }
    if (groupCode) {
      conditions.push({
        key: 'groupCode',
        label: `集团代码: ${groupCode}`,
        onRemove: () => setGroupCode('YF')
      });
    }
    if (crsStatus) {
      conditions.push({
        key: 'crsStatus',
        label: `订单状态: ${crsStatus}`,
        onRemove: () => setCrsStatus('')
      });
    }
    return conditions;
  }, [startDate, endDate, hotelCode, hotelName, agentCd, groupCode, crsStatus]);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题和返回按钮 */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">渠道订单</h1>
                <p className="text-gray-600">查看渠道订单信息</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">酒店代码</label>
                <Select
                  allowClear
                  showSearch
                  placeholder="选择或输入酒店代码（支持自查询）..."
                  className="w-full"
                  value={hotelCode || undefined}
                  onChange={(val) => setHotelCode(val || '')}
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
                  value={hotelName || undefined}
                  onChange={(val) => setHotelName(val || '')}
                  options={hotelNameOptions.length > 0 ? hotelNameOptions : []}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">渠道代码</label>
                <Select
                  allowClear
                  showSearch
                  placeholder="选择渠道代码..."
                  className="w-full"
                  value={agentCd || undefined}
                  onChange={(val) => setAgentCd(val || '')}
                  options={agentCdEnumOptions}
                  filterOption={(input, option) =>
                    ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">集团代码</label>
                <Select
                  allowClear
                  className="w-full"
                  value={groupCode || undefined}
                  onChange={(val) => setGroupCode(val || 'YF')}
                  options={[
                    { label: '逸扉', value: 'YF' },
                    { label: '建国', value: 'JG' },
                    { label: '京伦', value: 'JL' },
                    { label: '南苑', value: 'NY' },
                    { label: '云荟', value: 'NH' },
                    { label: '诺金', value: 'NI' },
                    { label: '诺岚', value: 'NU' },
                    { label: '凯宾斯基', value: 'KP' },
                    { label: '万信', value: 'WX' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">订单状态</label>
                <Input
                  placeholder="输入订单状态..."
                  value={crsStatus}
                  onChange={(e) => setCrsStatus(e.target.value)}
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
                {selectedConditions.map((condition) => (
                  <span
                    key={condition.key}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                    onClick={condition.onRemove}
                  >
                    {condition.label}
                    <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 导出按钮 */}
          <div className="mb-4 flex justify-end">
            <Button 
              type="default" 
              loading={exporting} 
              onClick={handleExport}
              disabled={rows.length === 0}
            >
              导出Excel
            </Button>
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table
              columns={tableColumns}
              dataSource={rows}
              loading={loading}
              scroll={{ x: 1500, y: 600 }}
              pagination={false}
              rowKey={(record) => {
                return `${record.OrderNo || ''}-${record.HotelCd || ''}-${record.ArrDate || ''}-${record.DepDate || ''}`;
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
