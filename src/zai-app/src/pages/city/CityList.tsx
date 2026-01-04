import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaSync } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';
import Toast from '../../components/Toast';
import TokenCheck from '../../components/common/TokenCheck';

interface City {
  cityId: string;
  cityCode: string;
  cityName: string;
  province: string;
}

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

const CityList: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useState({
    cityId: '',
    cityCode: '',
    cityName: '',
    province: ''
  });
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // 显示消息提示
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 获取城市列表
  const fetchCities = async () => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const res = await request.get(`/city/list?${params.toString()}`);
      console.log('F2 - 城市列表数据:', res.data);
      setCities(res.data.data || res.data);
    } catch (error: any) {
      console.error('F2 - 获取城市列表失败:', error);
      setCities([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCities();
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(cities.length / itemsPerPage);

  const handleInputChange = (field: keyof typeof searchParams, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdd = () => {
    navigate('/city/add');
  };

  const handleSync = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (file.type !== 'application/json') {
      showToast('请选择JSON格式的文件', 'error');
      return;
    }

    try {
      // 读取文件内容
      const text = await file.text();
      const jsonData = JSON.parse(text);

      // 调用同步接口
      const res = await request.post('/city/sync', jsonData);
      showToast(res.data.message || '同步成功', 'success');
      fetchCities(); // 刷新列表
    } catch (error: any) {
      showToast(error.response?.data?.message || '同步失败', 'error');
    }

    // 清空文件输入，允许重复选择同一文件
    e.target.value = '';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cities.slice(startIndex, endIndex);

  return (
    <TokenCheck>
    <div className="p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">城市列表</h1>
      </div>

      {/* Search Panel */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div 
          className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
          onClick={() => setIsSearchPanelOpen(!isSearchPanelOpen)}
        >
          <h2 className="text-lg font-medium text-gray-900">查询条件</h2>
          {isSearchPanelOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {isSearchPanelOpen && (
          <form onSubmit={handleSearch} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">城市编号</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.cityId}
                  onChange={(e) => handleInputChange('cityId', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">城市代码</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.cityCode}
                  onChange={(e) => handleInputChange('cityCode', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">城市名称</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.cityName}
                  onChange={(e) => handleInputChange('cityName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所属省份</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                type="button"
                onClick={() => setSearchParams({
                  cityId: '',
                  cityCode: '',
                  cityName: '',
                  province: ''
                })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                重置
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
              >
                <FaSearch className="mr-2" />
                查询
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
              >
                <FaPlus className="mr-2" />
                添加城市
              </button>
              <button
                type="button"
                onClick={handleSync}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
              >
                <FaSync className="mr-2" />
                同步城市
              </button>
            </div>
          </form>
        )}
      </div>

      {/* City List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                城市代码
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                城市名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                所属省份
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((city) => (
              <tr key={city.cityId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {city.cityCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {city.cityName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {city.province}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex justify-center space-x-2">
                    <button
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-400 transition-colors duration-200"
                      onClick={() => {/* TODO: Implement edit */}}
                      title="编辑"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-200 hover:border-red-400 transition-colors duration-200"
                      onClick={() => {/* TODO: Implement delete */}}
                      title="删除"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              上一页
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                显示第 <span className="font-medium">{startIndex + 1}</span> 到{' '}
                <span className="font-medium">{Math.min(endIndex, cities.length)}</span> 条，共{' '}
                <span className="font-medium">{cities.length}</span> 条记录
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page <= 10 || page === totalPages)
                  .map((page, index, array) => {
                    // 如果当前页大于10且不是最后一页，添加省略号
                    if (index === 10 && page !== totalPages) {
                      return (
                        <span
                          key="ellipsis"
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    </TokenCheck>
  );
};

export default CityList; 