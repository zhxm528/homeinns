import React, { useState, useEffect, useContext } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaChevronDown, FaChevronUp, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import request from '@/utils/request';
import Toast from '@/components/Toast';
import { Spin } from 'antd';
import TokenCheck from '@/components/common/TokenCheck';
import PropertyTypeSelect from '@/components/common/PropertyTypeSelect';
import ManageTypeSelect from '@/components/common/ManageTypeSelect';
import ChainSelect from '@/components/common/ChainSelect';
import CitySelect from '@/components/common/CitySelect';
import PmsSelect from '@/components/common/PmsSelect';
import Pagination from '@/components/common/Pagesize';
import { TabContext } from '../../App';

interface Hotel {
  hotelId: string;
  chainId: string;
  chainName: string;
  hotelCode: string;
  hotelName: string;
  ownershipType: string;
  managementModel: string;
  managementCompany: string;
  address: string;
  description: string;
  cityId: string;
  country: string;
  cityArea: string;
  contactEmail: string;
  contactPhone: string;
  status: 1 | 0;
  cityName: string;
  province: string;
  region: string;
  brand: string;
  pmsVersion: string;
}

interface SearchParams {
  chainId: string;
  hotelCode: string;
  hotelName: string;
  ownershipType: string;
  managementModel: string;
  managementCompany: string;
  address: string;
  description: string;
  cityId: string;
  region: string;
  brand: string;
  cityArea: string;
  status: number;
  pmsVersion: string;
}

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}



const HotelList: React.FC = () => {
  const navigate = useNavigate();
  const tabContext = useContext(TabContext);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 每页显示条数
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据
  const [totalCount, setTotalCount] = useState(0); // 总数据量
  const [isBatchEdit, setIsBatchEdit] = useState(false); // 是否处于批量编辑模式
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]); // 选中的酒店ID列表
  const [sortField, setSortField] = useState<string>(''); // 当前排序字段
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // 排序方向
  const [batchEditData, setBatchEditData] = useState({
    brand: '',
    region: '',
    cityArea: '',
    cityId: '',
    managementModel: '',
    ownershipType: '',
    pmsVersion: ''
  });
  const [batchEditLoading, setBatchEditLoading] = useState(false); // 批量修改加载状态
  const [searchParams, setSearchParams] = useState<SearchParams>(() => {
    // 从 localStorage 获取用户信息
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.chainId) {
        return {
          chainId: user.chainId,
          hotelCode: '',
          hotelName: '',
          ownershipType: '',
          managementModel: '',
          managementCompany: '',
          address: '',
          description: '',
          cityId: '',
          region: '',
          brand: '',
          cityArea: '',
          status: 0,
          pmsVersion: ''
        };
      }
    }
    return {
      chainId: '',
      hotelCode: '',
      hotelName: '',
      ownershipType: '',
      managementModel: '',
      managementCompany: '',
      address: '',
      description: '',
      cityId: '',
      region: '',
      brand: '',
      cityArea: '',
      status: 0,
      pmsVersion: ''
    };
  });

  // 显示消息提示
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 获取酒店列表
  const fetchHotels = async (page: number = 1, isSearch: boolean = false, customPageSize?: number) => {
    setLoading(true);
    try {
      // 如果是搜索操作，清空现有数据
      if (isSearch) {
        setHotels([]);
        setTotalCount(0);
      }

             // 从localStorage获取token
       const token = localStorage.getItem('token');
       
       if (!token) {
         showToast('未登录或登录已过期，请重新登录', 'error');
         navigate('/login');
         return;
       }

       // 从localStorage获取用户信息
       const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

       // 使用传入的 customPageSize 或当前的 pageSize
       const currentPageSize = customPageSize || pageSize;
       
       // 构建请求体
       const requestBody = {
         ...searchParams,
         page,
         pageSize: currentPageSize,
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

      const res = await request.post(`/api/hotel/list`, requestBody);

      // 检查响应数据结构
      if (res.data && typeof res.data === 'object') {
        // 新的数据结构：{ data: Hotel[], total: number, page: number, pageSize: number }
        const { data, total, page: currentPageFromServer, pageSize: pageSizeFromServer } = res.data;
        
        if (Array.isArray(data)) {
          // 更新总数据量
          setTotalCount(total || data.length);
          
          // 设置是否还有更多数据
          setHasMore(data.length === currentPageSize);
          
          // 更新酒店列表
          if (page === 1 || isSearch) {
            setHotels(data);
          } else {
            setHotels(prev => [...prev, ...data]);
          }
        } else {
          showToast('服务器返回数据格式错误', 'error');
          setHotels([]);
          setTotalCount(0);
        }
      } else if (Array.isArray(res.data)) {
        // 兼容旧的数据结构：直接返回数组
        const data = res.data;
        
        // 更新总数据量（使用前端计算，不够准确）
        if (page === 1 || isSearch) {
          setTotalCount(data.length);
        } else {
          setTotalCount(prev => prev + data.length);
        }
        
        // 设置是否还有更多数据
        setHasMore(data.length === currentPageSize);
        
        // 更新酒店列表
        if (page === 1 || isSearch) {
          setHotels(data);
        } else {
          setHotels(prev => [...prev, ...data]);
        }
      } else {
        showToast('服务器返回数据格式错误', 'error');
        setHotels([]);
        setTotalCount(0);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        showToast('登录已过期，请重新登录', 'error');
        navigate('/login');
      } else {
        showToast(error.response?.data?.message || '获取酒店列表失败', 'error');
      }
      setHotels([]);
      setTotalCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    // 从localStorage获取用户信息
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

    // 构建请求体
    const requestBody = {
      ...searchParams,
      page: 0,
      pageSize: pageSize, // 使用当前的 pageSize 状态
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

    fetchHotels(0, true); // 初始化时使用 page=0，并标记为搜索操作
  }, []);

  const handleSearchChange = (field: keyof SearchParams, value: string | number) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理表头排序点击
  const handleSort = (field: string) => {
    if (sortField === field) {
      // 如果点击的是当前排序字段，切换排序方向
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 如果点击的是新字段，设置为升序
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 获取排序后的酒店列表
  const getSortedHotels = () => {
    if (!sortField) return hotels;

    return [...hotels].sort((a, b) => {
      const aValue = a[sortField as keyof Hotel];
      const bValue = b[sortField as keyof Hotel];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue, 'zh-CN')
          : bValue.localeCompare(aValue, 'zh-CN');
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  };

  // 渲染排序图标
  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <FaSortUp className="ml-1 text-blue-500" />
      : <FaSortDown className="ml-1 text-blue-500" />;
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchHotels(0, true); // 搜索时使用 page=0，并标记为搜索操作
  };

  const handleReset = () => {
    setSearchParams({
      chainId: '',
      hotelCode: '',
      hotelName: '',
      ownershipType: '',
      managementModel: '',
      managementCompany: '',
      address: '',
      description: '',
      cityId: '',
      region: '',
      brand: '',
      cityArea: '',
      status: 0,
      pmsVersion: ''
    });
    setCurrentPage(1);
    fetchHotels(0, true); // 重置时使用 page=0，并标记为搜索操作
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // 计算当前页需要的数据范围
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    
    // 如果当前数据不足，且还有更多数据，则加载更多
    if (endIndex > hotels.length && hasMore) {
      const nextPage = Math.floor(hotels.length / pageSize) + 1;
      fetchHotels(nextPage, false); // 翻页时不标记为搜索操作
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // 重置到第一页
    // 重新加载数据，使用新的 pageSize
    fetchHotels(1, true, newPageSize);
  };

  const handleAddHotel = () => {
    if (!tabContext) return;
    tabContext.addTab({
      id: '/hotel/add',
      title: '添加酒店',
      path: '/hotel/add',
    });
  };

  const handleEditHotel = (hotelId: string) => {
    if (!tabContext) return;
    tabContext.addTab({
      id: `/hotel/edit/${hotelId}`,
      title: '编辑酒店',
      path: `/hotel/edit/${hotelId}`,
    });
  };

  const handleDeleteHotel = async (hotelId: string) => {
    if (window.confirm('确定要删除这个酒店吗？')) {
      try {
        await request.delete(`/api/hotel/${hotelId}`);
        showToast('删除成功', 'success');
        // 重新加载列表
        fetchHotels(currentPage, true);
      } catch (error: any) {
        showToast(error.response?.data?.message || '删除失败', 'error');
      }
    }
  };

  // 批量编辑相关函数
  const handleBatchEdit = () => {
    setIsBatchEdit(true);
    setSelectedHotels([]);
    setBatchEditData({
      brand: '',
      region: '',
      cityArea: '',
      cityId: '',
      managementModel: '',
      ownershipType: '',
      pmsVersion: ''
    });
  };

  const handleCancelBatchEdit = () => {
    setIsBatchEdit(false);
    setSelectedHotels([]);
    setBatchEditData({
      brand: '',
      region: '',
      cityArea: '',
      cityId: '',
      managementModel: '',
      ownershipType: '',
      pmsVersion: ''
    });
  };

  // 获取当前页面已选择的酒店数量
  const getCurrentPageSelectedCount = () => {
    return currentHotels.filter(hotel => selectedHotels.includes(hotel.hotelId)).length;
  };

  // 检查当前页面是否全选
  const isCurrentPageAllSelected = () => {
    return currentHotels.length > 0 && getCurrentPageSelectedCount() === currentHotels.length;
  };

  // 检查当前页面是否部分选择
  const isCurrentPagePartiallySelected = () => {
    const selectedCount = getCurrentPageSelectedCount();
    return selectedCount > 0 && selectedCount < currentHotels.length;
  };

  const handleSelectHotel = (hotelId: string, checked: boolean) => {
    if (checked) {
      // 添加酒店到选择列表，避免重复
      setSelectedHotels(prev => {
        if (!prev.includes(hotelId)) {
          return [...prev, hotelId];
        }
        return prev;
      });
    } else {
      // 从选择列表中移除酒店
      setSelectedHotels(prev => prev.filter(id => id !== hotelId));
    }
  };

  const handleSelectAllHotels = (checked: boolean) => {
    if (checked) {
      // 全选当前页的酒店，并保留之前已选择的酒店
      const currentPageHotelIds = currentHotels.map(hotel => hotel.hotelId);
      setSelectedHotels(prev => {
        const newSelection = [...prev];
        currentPageHotelIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    } else {
      // 取消选择当前页的所有酒店，但保留其他页面的选择
      const currentPageHotelIds = currentHotels.map(hotel => hotel.hotelId);
      setSelectedHotels(prev => prev.filter(id => !currentPageHotelIds.includes(id)));
    }
  };

  const handleBatchEditChange = (field: keyof typeof batchEditData, value: string) => {
    setBatchEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveBatchEdit = async () => {
    if (selectedHotels.length === 0) {
      showToast('请选择要修改的酒店', 'error');
      return;
    }

    try {
      setBatchEditLoading(true); // 开始加载状态
      
      const updateData = Object.fromEntries(
        Object.entries(batchEditData).filter(([_, value]) => value !== '')
      );

      if (Object.keys(updateData).length === 0) {
        showToast('请至少修改一个字段', 'error');
        setBatchEditLoading(false); // 结束加载状态
        return;
      }

      // 这里应该调用批量更新API
      // 暂时使用循环更新单个酒店的方式
      for (const hotelId of selectedHotels) {
        const requestUrl = `/api/hotel/${hotelId}`;
        const requestBody = {
          ...updateData,
          hotelId: hotelId
        };

        await request.put(requestUrl, requestBody);
      }

      showToast(`成功更新 ${selectedHotels.length} 个酒店`, 'success');
      handleCancelBatchEdit();
      fetchHotels(currentPage, true);
    } catch (error: any) {
      showToast(error.response?.data?.message || '批量更新失败', 'error');
    } finally {
      setBatchEditLoading(false); // 结束加载状态
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = Math.max(0, (currentPage - 1) * pageSize);
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const sortedHotels = getSortedHotels();
  const currentHotels = sortedHotels.slice(startIndex, endIndex);

  return (
    <TokenCheck>
    <div className="p-6 flex-1 overflow-x-auto">
      <style>{`
        .sticky-column {
          position: sticky;
          z-index: 10;
          background-color: white;
        }
        .sticky-column:hover {
          background-color: #f9fafb !important;
        }
        .sticky-header {
          position: sticky;
          z-index: 20;
          background-color: #f9fafb;
        }
        .sticky-header:hover {
          background-color: #f3f4f6 !important;
        }
      `}</style>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所属集团</label>
                <ChainSelect
                  value={searchParams.chainId}
                  onChange={(value) => handleSearchChange('chainId', value)}
                  placeholder="请选择所属集团"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">酒店代码</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.hotelCode}
                  onChange={(e) => handleSearchChange('hotelCode', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">酒店名称</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.hotelName}
                  onChange={(e) => handleSearchChange('hotelName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">产权类型</label>
                <PropertyTypeSelect
                  value={searchParams.ownershipType}
                  onChange={(value) => handleSearchChange('ownershipType', value || '')}
                  placeholder="请选择产权类型"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">管理类型</label>
                <ManageTypeSelect
                  value={searchParams.managementModel}
                  onChange={(value) => handleSearchChange('managementModel', value || '')}
                  placeholder="请选择管理类型"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.address}
                  onChange={(e) => handleSearchChange('address', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.description}
                  onChange={(e) => handleSearchChange('description', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">品牌</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.brand}
                  onChange={(e) => handleSearchChange('brand', e.target.value)}
                  placeholder="请输入品牌"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">大区</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.region}
                  onChange={(e) => handleSearchChange('region', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">城区</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.cityArea}
                  onChange={(e) => handleSearchChange('cityArea', e.target.value)}
                  placeholder="请输入城区"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">城市</label>
                <CitySelect
                  value={searchParams.cityId}
                  onChange={(value) => handleSearchChange('cityId', value || '')}
                  placeholder="请选择城市"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PMS类型</label>
                <PmsSelect
                  value={searchParams.pmsVersion}
                  onChange={(value) => handleSearchChange('pmsVersion', value || '')}
                  placeholder="请选择PMS类型"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.status}
                  onChange={(e) => handleSearchChange('status', e.target.value === '' ? 0 : parseInt(e.target.value))}
                >
                  <option value={0}>全部</option>
                  <option value={1}>启用</option>
                  <option value={0}>停用</option>
                </select>
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                onClick={handleAddHotel}
              >
                <FaPlus className="mr-2" />
                添加酒店
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                onClick={handleBatchEdit}
              >
                批量修改
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* 批量编辑面板 */}
        {isBatchEdit && (
          <div className="p-4 border-b border-gray-200 bg-yellow-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">批量修改模式</h3>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                  onClick={handleCancelBatchEdit}
                >
                  取消
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm flex items-center ${
                    batchEditLoading
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  onClick={handleSaveBatchEdit}
                  disabled={batchEditLoading}
                >
                  {batchEditLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                      保存中...
                    </>
                  ) : (
                    '保存修改'
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">品牌</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={batchEditData.brand}
                  onChange={(e) => handleBatchEditChange('brand', e.target.value)}
                  placeholder="请输入品牌"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">大区</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={batchEditData.region}
                  onChange={(e) => handleBatchEditChange('region', e.target.value)}
                  placeholder="请输入大区"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">城区</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={batchEditData.cityArea}
                  onChange={(e) => handleBatchEditChange('cityArea', e.target.value)}
                  placeholder="请输入城区"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">城市</label>
                <CitySelect
                  value={batchEditData.cityId}
                  onChange={(value) => handleBatchEditChange('cityId', value || '')}
                  placeholder="请选择城市"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">管理类型</label>
                <ManageTypeSelect
                  value={batchEditData.managementModel}
                  onChange={(value) => handleBatchEditChange('managementModel', value || '')}
                  placeholder="请选择管理类型"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">产权类型</label>
                <PropertyTypeSelect
                  value={batchEditData.ownershipType}
                  onChange={(value) => handleBatchEditChange('ownershipType', value || '')}
                  placeholder="请选择产权类型"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PMS类型</label>
                <PmsSelect
                  value={batchEditData.pmsVersion}
                  onChange={(value) => handleBatchEditChange('pmsVersion', value || '')}
                  placeholder="请选择PMS类型"
                />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              已选择 {selectedHotels.length} 个酒店
              {selectedHotels.length > 0 && (
                <span className="ml-2 text-blue-600">
                  (当前页: {getCurrentPageSelectedCount()}/{currentHotels.length})
                </span>
              )}
            </div>
          </div>
        )}

        <Spin spinning={loading} tip="加载中...">
          <div className="overflow-x-auto max-h-96 overflow-y-auto" style={{ position: 'relative', minHeight: '650px' }}>
            <table className="min-w-full divide-y divide-gray-200" style={{ tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0, minWidth: '1200px' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: '#f9fafb' }}>
                    <tr>
                                                                    {isBatchEdit && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky-header" style={{ left: 0, width: '50px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
                          <input
                            type="checkbox"
                            checked={isCurrentPageAllSelected()}
                            ref={(input) => {
                              if (input) {
                                input.indeterminate = isCurrentPagePartiallySelected();
                              }
                            }}
                            onChange={(e) => handleSelectAllHotels(e.target.checked)}
                            className="mr-2"
                          />
                         
                        </th>
                      )}
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 sticky-header"
                        style={{ left: isBatchEdit ? '50px' : 0, width: '120px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}
                        onClick={() => handleSort('hotelCode')}
                      >
                        <div className="flex items-center">
                          代码
                          {renderSortIcon('hotelCode')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb', width: '150px' }}
                        onClick={() => handleSort('hotelName')}
                      >
                        <div className="flex items-center">
                          酒店名称
                          {renderSortIcon('hotelName')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb', width: '120px' }}
                        onClick={() => handleSort('chainName')}
                      >
                        <div className="flex items-center">
                          所属集团
                          {renderSortIcon('chainName')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleSort('brand')}
                      >
                        <div className="flex items-center">
                          品牌
                          {renderSortIcon('brand')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleSort('ownershipType')}
                      >
                        <div className="flex items-center">
                          产权类型
                          {renderSortIcon('ownershipType')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleSort('managementModel')}
                      >
                        <div className="flex items-center">
                          管理类型
                          {renderSortIcon('managementModel')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb', width: '200px' }}
                        onClick={() => handleSort('address')}
                      >
                        <div className="flex items-center">
                          地址
                          {renderSortIcon('address')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleSort('region')}
                      >
                        <div className="flex items-center">
                          大区
                          {renderSortIcon('region')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleSort('cityArea')}
                      >
                        <div className="flex items-center">
                          城区
                          {renderSortIcon('cityArea')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleSort('cityName')}
                      >
                        <div className="flex items-center">
                          城市
                          {renderSortIcon('cityName')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleSort('pmsVersion')}
                      >
                        <div className="flex items-center">
                          PMS类型
                          {renderSortIcon('pmsVersion')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleSort('contactEmail')}
                      >
                        <div className="flex items-center">
                          邮箱
                          {renderSortIcon('contactEmail')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleSort('contactPhone')}
                      >
                        <div className="flex items-center">
                          电话
                          {renderSortIcon('contactPhone')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        style={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          状态
                          {renderSortIcon('status')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ backgroundColor: '#f9fafb', width: '100px' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentHotels.length > 0 ? (
                      currentHotels.map((hotel) => (
                        <tr key={hotel.hotelId} className="hover:bg-gray-50 group">
                          {isBatchEdit && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 group-hover:bg-gray-50 sticky-column" style={{ left: 0, width: '50px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
                              <input
                                type="checkbox"
                                checked={selectedHotels.includes(hotel.hotelId)}
                                onChange={(e) => handleSelectHotel(hotel.hotelId, e.target.checked)}
                                className="mr-2"
                              />
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 group-hover:bg-gray-50 sticky-column" style={{ left: isBatchEdit ? '50px' : 0, width: '120px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>{hotel.hotelCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.hotelName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.chainName || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.brand}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.ownershipType || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.managementModel || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.address}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.region || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.cityArea || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.cityName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.pmsVersion || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.contactEmail}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.contactPhone}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              hotel.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {hotel.status === 1 ? '启用' : '停用'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                className="text-blue-600 hover:text-blue-900 mr-3 border border-blue-600 rounded p-1"
                                onClick={() => handleEditHotel(hotel.hotelId)}
                              >
                              <FaEdit />
                            </button>
                              <button 
                                className="text-red-600 hover:text-red-900 border border-red-600 rounded p-1"
                                onClick={() => handleDeleteHotel(hotel.hotelId)}
                              >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={isBatchEdit ? 16 : 15} className="px-6 py-4 text-center text-sm text-gray-500 sticky-column" style={{ left: isBatchEdit ? '50px' : 0 }}>
                          暂无数据
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
        </Spin>

        {/* 分页控件 */}
        <Pagination
          current={currentPage}
          total={totalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showSizeChanger={true}
          showTotal={true}
          pageSizeOptions={[10, 50, 100, 200]}
          className="mt-4 rounded-lg shadow"
        />
      </div>
    </div>
    </TokenCheck>
  );
};

export default HotelList; 