import React, { useState, useEffect, useContext } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { TabContext } from '../../App';
import HotelSelect from '../../components/common/HotelSelect';
import Pagination from '../../components/common/Pagesize';
import request from '../../utils/request';
import { message } from 'antd';
import TokenCheck from '../../components/common/TokenCheck';

interface RoomType {
  roomTypeId: string;
  chainId: string;
  hotelId: string;
  hotelName: string;  
  roomTypeName: string;
  roomTypeCode: string;
  description: string;
  standardPrice: number | null;
  maxOccupancy: number | null;
  physicalInventory: number | null;
  status: string | null;
  createdAt: number;
  updatedAt: number | null;
}

interface SearchParams {
  hotelId: string;
  roomTypeCode: string;
  roomTypeName: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: RoomType[];
  total?: number;
  current?: number;
  pageSize?: number;
}

const RoomTypeList: React.FC = () => {
  const navigate = useNavigate();
  const tabContext = useContext(TabContext);
  
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // 从 localStorage 获取默认的 hotelId
  const getDefaultHotelId = () => {
    return localStorage.getItem('hotelId') || '';
  };
  
  const [searchParams, setSearchParams] = useState<SearchParams>({
    hotelId: getDefaultHotelId(),
    roomTypeCode: '',
    roomTypeName: ''
  });

  // 初始化时设置默认酒店ID
  useEffect(() => {
    const defaultHotelId = getDefaultHotelId();
    if (defaultHotelId && defaultHotelId !== searchParams.hotelId) {
      setSearchParams(prev => ({
        ...prev,
        hotelId: defaultHotelId
      }));
    }
  }, []);

  const fetchRoomTypes = async (params: SearchParams, page: number) => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      
      const requestBody = {
        chainId: userInfo.chainId,
        hotelId: params.hotelId || null,
        roomTypeCode: params.roomTypeCode || null,
        roomTypeName: params.roomTypeName || null,
        pagination: {
          current: page,
          pageSize: pageSize
        },
        user: {
          userId: userInfo.userId,
          loginName: userInfo.loginName,
          userName: userInfo.userName,
          roleId: userInfo.roleId,
          roleName: userInfo.roleName,
          chainId: userInfo.chainId,
          chainName: userInfo.chainName
        }
      };

      console.log('获取房型列表 - 请求体:', JSON.stringify(requestBody, null, 2));

      const response = await request.post<ApiResponse>('/api/roomtype/list', requestBody);
      console.log('获取房型列表 - 响应数据:', response.data);

      if (response.data.success) {
        setRoomTypes(response.data.data || []);
        setTotal(response.data.total || response.data.data.length);
        setCurrentPage(response.data.current || 1);
      } else {
        message.error(response.data.message || '获取房型列表失败');
        setRoomTypes([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('获取房型列表失败:', error);
      if (error instanceof Error) {
        console.error('错误类型:', error.name);
        console.error('错误信息:', error.message);
        console.error('错误堆栈:', error.stack);
      }
      message.error('获取房型列表失败');
      setRoomTypes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes(searchParams, currentPage);
  }, [currentPage]);

  const handleSearchChange = (field: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchRoomTypes(searchParams, 1);
  };

  const handleReset = () => {
    const defaultHotelId = getDefaultHotelId();
    const resetParams = {
      hotelId: defaultHotelId, // 重置时保持默认酒店ID
      roomTypeCode: '',
      roomTypeName: ''
    };
    setSearchParams(resetParams);
    setCurrentPage(1);
    fetchRoomTypes(resetParams, 1);
  };

  const handleAddRoomType = () => {
    if (tabContext && tabContext.addTab) {
      tabContext.addTab({
        id: '/api/roomtype/add',
        title: '添加房型',
        path: '/api/roomtype/add',
      });
    } else {
      navigate('/api/roomtype/add');
    }
  };

  const handleEditRoomType = (roomTypeId: string) => {
    if (tabContext && tabContext.addTab) {
      tabContext.addTab({
        id: `/api/roomtype/edit/${roomTypeId}`,
        title: '编辑房型',
        path: `/api/roomtype/edit/${roomTypeId}`,
      });
    } else {
      navigate(`/api/roomtype/edit/${roomTypeId}`);
    }
  };

  const handleDelete = async (roomTypeId: string) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      
      const requestBody = {
        roomTypeId: roomTypeId,
        chainId: userInfo.chainId,
        user: {
          userId: userInfo.userId,
          loginName: userInfo.loginName,
          userName: userInfo.userName,
          roleId: userInfo.roleId,
          roleName: userInfo.roleName,
          chainId: userInfo.chainId,
          chainName: userInfo.chainName
        }
      };

      console.log('删除房型 - 请求体:', JSON.stringify(requestBody, null, 2));
      const response = await request.delete(`/api/roomtype/${roomTypeId}`);
      console.log('删除房型 - 响应数据:', response.data);

      if (response.data.success) {
        message.success('删除房型成功');
        // 重新加载列表
        fetchRoomTypes(searchParams, currentPage);
      } else {
        message.error(response.data.message || '删除房型失败');
      }
    } catch (error) {
      console.error('删除房型失败:', error);
      if (error instanceof Error) {
        console.error('错误类型:', error.name);
        console.error('错误信息:', error.message);
        console.error('错误堆栈:', error.stack);
      }
      message.error('删除房型失败');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    fetchRoomTypes(searchParams, 1);
  };

  return (
    <TokenCheck>
    <div className="p-6 flex-1 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">房型列表</h1>
      </div>

      {/* 搜索面板 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsSearchPanelOpen(!isSearchPanelOpen)}
        >
          <div className="flex items-center">
            <FaSearch className="mr-2 text-gray-500" />
            <span className="font-medium">搜索条件</span>
          </div>
          {isSearchPanelOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {isSearchPanelOpen && (
          <div className="p-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所属酒店</label>
                <HotelSelect
                  value={searchParams.hotelId}
                  onChange={(value) => handleSearchChange('hotelId', value)}
                  placeholder="请选择酒店"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">房型代码</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.roomTypeCode}
                  onChange={(e) => handleSearchChange('roomTypeCode', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">房型名称</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.roomTypeName}
                  onChange={(e) => handleSearchChange('roomTypeName', e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={handleReset}
              >
                重置
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleSearch}
              >
                搜索
              </button>
                <button
                  type="button"
                  onClick={handleAddRoomType}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                >
                  <FaPlus className="mr-2" />
                  添加房型
                </button>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属酒店</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">房型代码</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">房型名称</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">房型描述</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标准房价</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">入住人数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">房间数量</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                        加载中...
                      </td>
                    </tr>
                  ) : roomTypes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    roomTypes.map((roomType, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomType.hotelName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomType.roomTypeCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomType.roomTypeName}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{roomType.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{roomType.standardPrice}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomType.maxOccupancy}人</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomType.physicalInventory}间</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleEditRoomType(roomType.roomTypeId)}
                            className="text-blue-600 hover:text-blue-900 mr-3 border border-blue-600 rounded p-1"
                            title="编辑"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(roomType.roomTypeId)}
                            className="text-red-600 hover:text-red-800 p-1 border border-red-600 rounded"
                            title="删除"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 分页控件 */}
      <Pagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        showSizeChanger={true}
        showTotal={true}
        pageSizeOptions={[10, 50, 100, 200]}
        className="mt-4 rounded-lg shadow"
      />
    </div>
    </TokenCheck>
  );
};

export default RoomTypeList; 