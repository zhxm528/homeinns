'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { ConfigProvider, Button, Input, Table, Pagination } from 'antd';
// @ts-ignore: antd types might be missing
import type { ColumnsType } from 'antd/es/table';
// @ts-ignore: antd locale types might be missing
import zhCN from 'antd/locale/zh_CN';

interface Hotel {
  hotel_code: string;
  hotel_name: string;
  hotel_en_name?: string;
  hotel_type?: string;
  hotel_star?: number;
  group_code?: string;
  hotel_address?: string;
  mdm_city?: string;
  mdm_province?: string;
  status?: string;
  is_delete?: boolean;
  is_active?: boolean;
}

interface RoomType {
  hotel_code: string;
  room_type_code: string;
  room_type_name: string;
  room_type_class?: string;
  number?: number;
  max_number?: number;
  area?: number;
  sort?: number;
  is_valid?: number;
  is_delete?: number;
  is_main_room?: boolean;
  room_type_name_en?: string;
}

export default function CRSHotelPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);

  // 查询条件
  const [hotelCode, setHotelCode] = useState<string>('');
  const [hotelName, setHotelName] = useState<string>('');
  const [roomTypeCode, setRoomTypeCode] = useState<string>('');
  const [roomTypeName, setRoomTypeName] = useState<string>('');

  // 数据
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [allRoomTypes, setAllRoomTypes] = useState<RoomType[]>([]);
  const [selectedHotelCode, setSelectedHotelCode] = useState<string | null>(null);

  // 分页
  const [hotelPage, setHotelPage] = useState<number>(1);
  const [hotelPageSize, setHotelPageSize] = useState<number>(10);
  const [roomTypePage, setRoomTypePage] = useState<number>(1);
  const [roomTypePageSize, setRoomTypePageSize] = useState<number>(10);

  // 酒店表格列定义
  const hotelColumns: ColumnsType<Hotel> = useMemo(() => {
    return [
      {
        title: '酒店代码',
        dataIndex: 'hotel_code',
        key: 'hotel_code',
        width: 120,
        fixed: 'left',
        render: (text: string) => text || '-',
      },
      {
        title: '酒店名称',
        dataIndex: 'hotel_name',
        key: 'hotel_name',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '英文名称',
        dataIndex: 'hotel_en_name',
        key: 'hotel_en_name',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '酒店类型',
        dataIndex: 'hotel_type',
        key: 'hotel_type',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '星级',
        dataIndex: 'hotel_star',
        key: 'hotel_star',
        width: 80,
        align: 'center',
        render: (value: number) => value !== null && value !== undefined ? `${value}星` : '-',
      },
      {
        title: '集团代码',
        dataIndex: 'group_code',
        key: 'group_code',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '城市',
        dataIndex: 'mdm_city',
        key: 'mdm_city',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '省份',
        dataIndex: 'mdm_province',
        key: 'mdm_province',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (text: string) => text || '-',
      },
      {
        title: '是否删除',
        dataIndex: 'is_delete',
        key: 'is_delete',
        width: 100,
        render: (value: boolean) => value ? '是' : '否',
      },
      {
        title: '是否激活',
        dataIndex: 'is_active',
        key: 'is_active',
        width: 100,
        render: (value: boolean) => value ? '是' : '否',
      },
    ];
  }, []);

  // 房型表格列定义
  const roomTypeColumns: ColumnsType<RoomType> = useMemo(() => {
    return [
      {
        title: '酒店代码',
        dataIndex: 'hotel_code',
        key: 'hotel_code',
        width: 120,
        fixed: 'left',
        render: (text: string) => text || '-',
      },
      {
        title: '房型代码',
        dataIndex: 'room_type_code',
        key: 'room_type_code',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '房型名称',
        dataIndex: 'room_type_name',
        key: 'room_type_name',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '英文名称',
        dataIndex: 'room_type_name_en',
        key: 'room_type_name_en',
        width: 200,
        render: (text: string) => text || '-',
      },
      {
        title: '房型分类',
        dataIndex: 'room_type_class',
        key: 'room_type_class',
        width: 120,
        render: (text: string) => text || '-',
      },
      {
        title: '房间数',
        dataIndex: 'number',
        key: 'number',
        width: 100,
        align: 'right',
        render: (value: number) => value !== null && value !== undefined ? value : '-',
      },
      {
        title: '最大房间数',
        dataIndex: 'max_number',
        key: 'max_number',
        width: 120,
        align: 'right',
        render: (value: number) => value !== null && value !== undefined ? value : '-',
      },
      {
        title: '面积(㎡)',
        dataIndex: 'area',
        key: 'area',
        width: 100,
        align: 'right',
        render: (value: number) => value !== null && value !== undefined ? value.toFixed(2) : '-',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        width: 80,
        align: 'right',
        render: (value: number) => value !== null && value !== undefined ? value : '-',
      },
      {
        title: '是否有效',
        dataIndex: 'is_valid',
        key: 'is_valid',
        width: 100,
        render: (value: number) => value === 1 ? '是' : value === 2 ? '否' : '-',
      },
      {
        title: '是否删除',
        dataIndex: 'is_delete',
        key: 'is_delete',
        width: 100,
        render: (value: number) => value === 1 ? '是' : value === 2 ? '否' : '-',
      },
      {
        title: '是否主推',
        dataIndex: 'is_main_room',
        key: 'is_main_room',
        width: 100,
        render: (value: boolean) => value ? '是' : '否',
      },
    ];
  }, []);

  // 查询数据
  const handleQuery = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (hotelCode) params.append('hotelCode', hotelCode);
      if (hotelName) params.append('hotelName', hotelName);
      if (roomTypeCode) params.append('roomTypeCode', roomTypeCode);
      if (roomTypeName) params.append('roomTypeName', roomTypeName);

      const res = await fetch(`/api/crs/hotel?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setHotels(json.data.hotels || []);
        setAllRoomTypes(json.data.roomTypes || []);
      } else {
        setHotels([]);
        setAllRoomTypes([]);
        setError(json.error || '加载数据失败');
      }
    } catch (e: any) {
      console.error('加载数据失败:', e);
      setError('网络请求失败，请检查网络连接');
      setHotels([]);
      setAllRoomTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // 重置查询条件
  const handleReset = () => {
    setHotelCode('');
    setHotelName('');
    setRoomTypeCode('');
    setRoomTypeName('');
    setSelectedHotelCode(null);
    setHotels([]);
    setAllRoomTypes([]);
    setError(null);
    setHotelPage(1);
    setRoomTypePage(1);
  };

  // 同步数据
  const handleSync = async () => {
    try {
      setSyncing(true);
      setSyncResult(null);
      setError(null);

      const res = await fetch('/api/crs/hotel/sync', {
        method: 'POST',
      });
      const json = await res.json();

      if (json.success) {
        setSyncResult({
          success: true,
          message: `同步完成！成功: ${json.data.success} 条，失败: ${json.data.error} 条`,
          data: json.data,
        });
        // 同步成功后刷新数据
        await handleQuery();
      } else {
        setSyncResult({
          success: false,
          message: json.error || '同步失败',
        });
      }
    } catch (e: any) {
      console.error('同步失败:', e);
      setSyncResult({
        success: false,
        message: '网络请求失败，请检查网络连接',
      });
    } finally {
      setSyncing(false);
    }
  };

  // 选择酒店行
  const handleHotelRowClick = (record: Hotel) => {
    setSelectedHotelCode(record.hotel_code);
    setRoomTypePage(1);
  };

  // 根据选中的酒店代码过滤房型
  const filteredRoomTypes = useMemo(() => {
    if (!selectedHotelCode) {
      return allRoomTypes;
    }
    return allRoomTypes.filter(rt => rt.hotel_code === selectedHotelCode);
  }, [allRoomTypes, selectedHotelCode]);

  // 页面加载时自动查询
  useEffect(() => {
    handleQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 分页后的酒店数据
  const paginatedHotels = useMemo(() => {
    const start = (hotelPage - 1) * hotelPageSize;
    const end = start + hotelPageSize;
    return hotels.slice(start, end);
  }, [hotels, hotelPage, hotelPageSize]);

  // 分页后的房型数据
  const paginatedRoomTypes = useMemo(() => {
    const start = (roomTypePage - 1) * roomTypePageSize;
    const end = start + roomTypePageSize;
    return filteredRoomTypes.slice(start, end);
  }, [filteredRoomTypes, roomTypePage, roomTypePageSize]);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="flex h-[calc(100vh-8rem)]">
        <Sidebar />
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">基础信息</h1>
                <p className="text-gray-600">查询和管理酒店及房型信息</p>
              </div>
              <Link
                href="/"
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

          {/* 左右布局：酒店列表和房型列表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：酒店查询条件和列表 */}
            <div className="space-y-6">
              {/* 酒店查询条件 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">酒店查询</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">酒店代码</label>
                    <Input
                      placeholder="输入酒店代码..."
                      value={hotelCode}
                      onChange={(e) => setHotelCode(e.target.value)}
                      allowClear
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">酒店名称</label>
                    <Input
                      placeholder="输入酒店名称..."
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      allowClear
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <Button
                    type="primary"
                    onClick={handleQuery}
                    loading={loading}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      setHotelCode('');
                      setHotelName('');
                      handleQuery();
                    }}
                    style={{ backgroundColor: '#9ca3af', borderColor: '#9ca3af', color: '#ffffff' }}
                  >
                    重置
                  </Button>
                  <Button
                    type="default"
                    onClick={handleSync}
                    loading={syncing}
                    style={{ borderColor: '#52c41a', color: '#52c41a' }}
                  >
                    同步
                  </Button>
                </div>
                {syncResult && (
                  <div className={`mt-4 p-3 rounded-md ${
                    syncResult.success 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={`text-sm ${
                      syncResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {syncResult.message}
                    </p>
                    {syncResult.data && syncResult.data.errors && syncResult.data.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-red-600 font-semibold">错误详情（前10条）:</p>
                        <ul className="text-xs text-red-600 list-disc list-inside mt-1">
                          {syncResult.data.errors.map((err: string, index: number) => (
                            <li key={index}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 酒店列表 */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">酒店列表</h2>
                  <p className="text-sm text-gray-500 mt-1">共 {hotels.length} 条记录</p>
                </div>
              <div className="overflow-x-auto">
                <Table
                  columns={hotelColumns}
                  dataSource={paginatedHotels}
                  loading={loading}
                  scroll={{ x: 1200, y: 600 }}
                  pagination={false}
                  rowKey="hotel_code"
                  onRow={(record) => ({
                    onClick: () => handleHotelRowClick(record),
                    style: {
                      cursor: 'pointer',
                      backgroundColor: selectedHotelCode === record.hotel_code ? '#e6f7ff' : undefined,
                    },
                  })}
                />
              </div>
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  current={hotelPage}
                  pageSize={hotelPageSize}
                  total={hotels.length}
                  showSizeChanger
                  pageSizeOptions={['10', '20', '50', '100']}
                  showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                  onChange={(newPage, newPageSize) => {
                    setHotelPage(newPage);
                    setHotelPageSize(newPageSize);
                  }}
                  onShowSizeChange={(current, size) => {
                    setHotelPage(1);
                    setHotelPageSize(size);
                  }}
                />
              </div>
            </div>

            </div>

            {/* 右侧：房型查询条件和列表 */}
            <div className="space-y-6">
              {/* 房型查询条件 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">房型查询</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">房型代码</label>
                    <Input
                      placeholder="输入房型代码..."
                      value={roomTypeCode}
                      onChange={(e) => setRoomTypeCode(e.target.value)}
                      allowClear
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">房型名称</label>
                    <Input
                      placeholder="输入房型名称..."
                      value={roomTypeName}
                      onChange={(e) => setRoomTypeName(e.target.value)}
                      allowClear
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <Button
                    type="primary"
                    onClick={handleQuery}
                    loading={loading}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      setRoomTypeCode('');
                      setRoomTypeName('');
                      handleQuery();
                    }}
                    style={{ backgroundColor: '#9ca3af', borderColor: '#9ca3af', color: '#ffffff' }}
                  >
                    重置
                  </Button>
                </div>
              </div>

              {/* 房型列表 */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">房型列表</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    共 {filteredRoomTypes.length} 条记录
                    {selectedHotelCode && ` (已筛选: ${selectedHotelCode})`}
                  </p>
                </div>
              <div className="overflow-x-auto">
                <Table
                  columns={roomTypeColumns}
                  dataSource={paginatedRoomTypes}
                  loading={loading}
                  scroll={{ x: 1400, y: 600 }}
                  pagination={false}
                  rowKey={(record) => `${record.hotel_code}-${record.room_type_code}`}
                />
              </div>
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  current={roomTypePage}
                  pageSize={roomTypePageSize}
                  total={filteredRoomTypes.length}
                  showSizeChanger
                  pageSizeOptions={['10', '20', '50', '100']}
                  showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                  onChange={(newPage, newPageSize) => {
                    setRoomTypePage(newPage);
                    setRoomTypePageSize(newPageSize);
                  }}
                  onShowSizeChange={(current, size) => {
                    setRoomTypePage(1);
                    setRoomTypePageSize(size);
                  }}
                />
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

