'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Hotel {
  HotelCode: string;
  HotelName: string;
  GroupCode: string;
  HotelType: string;
  PropertyType: string;
  PMSType: string;
  Status: number;
  IsDelete: number;
}

export default function HotelList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hotelCode, setHotelCode] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [groupCodes, setGroupCodes] = useState<string[]>(['JG','JL','NY','NH','NI','KP','YF','WX']);
  const [hotelTypes, setHotelTypes] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [pmsTypes, setPmsTypes] = useState<string[]>([]);
  const [status, setStatus] = useState<boolean | null>(null);
  const [isDelete, setIsDelete] = useState<boolean | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // API调用函数
  const fetchHotels = async () => {
    try {
      const params = new URLSearchParams();
      
      if (hotelCode) params.append('hotelCode', hotelCode);
      if (hotelName) params.append('hotelName', hotelName);
      if (groupCodes.length > 0) params.append('groupCodes', groupCodes.join(','));
      if (hotelTypes.length > 0) params.append('hotelTypes', hotelTypes.join(','));
      if (propertyTypes.length > 0) params.append('propertyTypes', propertyTypes.join(','));
      if (pmsTypes.length > 0) params.append('pmsTypes', pmsTypes.join(','));
      if (status !== null) params.append('status', status ? '1' : '0');
      if (isDelete !== null) params.append('isDelete', isDelete ? '1' : '0');
      
      const url = `/api/hotels?${params.toString()}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setHotels(result.data);
        setError(null);
        setIsInitialized(true);
      } else {
        setHotels(result.data || []);
        setError(result.error || '获取酒店数据失败');
        setIsInitialized(result.fallback || false);
      }
    } catch (err) {
      console.error('API调用失败:', err);
      setError('网络请求失败，请检查网络连接');
      setIsInitialized(false);
    }
  };

  // 初始化加载酒店数据
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);
      await fetchHotels();
      setLoading(false);
    };

    initializeData();
  }, []);

  // 查询酒店
  const handleSearch = async () => {
    try {
      setLoading(true);
      await fetchHotels();
    } catch (err) {
      console.error('查询失败:', err);
      setError('查询失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置查询条件
  const handleReset = () => {
    setHotelCode('');
    setHotelName('');
    setGroupCodes(['JG','JL','NY','NH','NI','KP','YF','WX']);
    setHotelTypes([]);
    setPropertyTypes([]);
    setPmsTypes([]);
    setStatus(null);
    setIsDelete(null);
  };

  // 多选处理函数
  const handleGroupCodeChange = (code: string) => {
    setGroupCodes(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleHotelTypeChange = (type: string) => {
    setHotelTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handlePropertyTypeChange = (type: string) => {
    setPropertyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handlePmsTypeChange = (type: string) => {
    setPmsTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
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

  // 状态枚举转换函数
  const getStatusDisplay = (status: number) => {
    const statusMap: Record<number, string> = {
      1: '启用',
      0: '停用'
    };
    return statusMap[status] || '未知';
  };

  const getIsDeleteDisplay = (isDelete: number) => {
    const isDeleteMap: Record<number, string> = {
      1: '已删除',
      0: '正常'
    };
    return isDeleteMap[isDelete] || '未知';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题和返回按钮 */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">诺金酒店列表查询</h1>
              <p className="text-gray-600">查询和管理酒店基础信息，列表按管理公司、酒店编号字母顺序排序</p>
            </div>
            {/* 右上角返回按钮 */}
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

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 酒店编码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                酒店编码
              </label>
              <input
                type="text"
                placeholder="输入酒店编码..."
                value={hotelCode}
                onChange={(e) => setHotelCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 酒店名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                酒店名称
              </label>
              <input
                type="text"
                placeholder="输入酒店名称..."
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 集团编码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理公司
              </label>
              <div className="flex flex-wrap gap-2">
                {['JG','JL','NY','NH','NI','NU','KP','YF','WX'].map(code => (
                  <label key={code} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={groupCodes.includes(code)}
                      onChange={() => handleGroupCodeChange(code)}
                      className="mr-1"
                    />
                    <span className="text-sm">{getGroupCodeDisplay(code)}</span>
              </label>
                ))}
          </div>
        </div>

            {/* 酒店类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                酒店类型
              </label>
              <div className="flex flex-wrap gap-2">
                {['H002','H003','H004'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hotelTypes.includes(type)}
                      onChange={() => handleHotelTypeChange(type)}
                      className="mr-1"
                    />
                    <span className="text-sm">{getHotelTypeDisplay(type)}</span>
                  </label>
                ))}
          </div>
                </div>

            {/* 物业类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产权类型
              </label>
              <div className="flex flex-wrap gap-2">
                {['BZ','FCQD','SJJT','SLJT','SLZY','SFT'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={propertyTypes.includes(type)}
                      onChange={() => handlePropertyTypeChange(type)}
                      className="mr-1"
                    />
                    <span className="text-sm">{getPropertyTypeDisplay(type)}</span>
                  </label>
                ))}
                </div>
              </div>

            {/* PMS类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PMS类型
              </label>
              <div className="flex flex-wrap gap-2">
                {['Cambridge','Opera','P3','Soft','X6','XMS'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={pmsTypes.includes(type)}
                      onChange={() => handlePmsTypeChange(type)}
                      className="mr-1"
                    />
                    <span className="text-sm">{getPmsTypeDisplay(type)}</span>
                  </label>
                ))}
              </div>
                </div>

            {/* 状态筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={status === true}
                    onChange={() => setStatus(true)}
                    className="mr-1"
                  />
                  <span className="text-sm">启用</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={status === false}
                    onChange={() => setStatus(false)}
                    className="mr-1"
                  />
                  <span className="text-sm">停用</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={status === null}
                    onChange={() => setStatus(null)}
                    className="mr-1"
                  />
                  <span className="text-sm">全部</span>
                </label>
              </div>
                </div>

            {/* 删除状态 */}
                  <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                是否删除
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isDelete"
                    checked={isDelete === false}
                    onChange={() => setIsDelete(false)}
                    className="mr-1"
                  />
                  <span className="text-sm">正常</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isDelete"
                    checked={isDelete === true}
                    onChange={() => setIsDelete(true)}
                    className="mr-1"
                  />
                  <span className="text-sm">已删除</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isDelete"
                    checked={isDelete === null}
                    onChange={() => setIsDelete(null)}
                    className="mr-1"
                  />
                  <span className="text-sm">全部</span>
                </label>
              </div>
            </div>
                  </div>

          {/* 操作按钮 */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              查询
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              重置
                  </button>
                </div>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg text-gray-600">正在加载酒店数据...</span>
              </div>
            </div>
        )}

        {/* 结果统计 */}
        {!loading && hotels.length > 0 && (
          <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="text-gray-800 font-medium">
              共找到 <span className="text-blue-600 font-bold">{hotels.length}</span> 家酒店
            </div>
            {error && (
              <span className="text-sm text-orange-600">
                (使用备用数据)
              </span>
            )}
          </div>
        )}

        {/* 酒店列表 */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      酒店编号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      酒店名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      管理公司
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      酒店类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      产权类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PMS类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      是否删除
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hotels.map((hotel, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {hotel.HotelCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {hotel.HotelName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getGroupCodeDisplay(hotel.GroupCode)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getHotelTypeDisplay(hotel.HotelType) || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getPropertyTypeDisplay(hotel.PropertyType) || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getPmsTypeDisplay(hotel.PMSType) || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hotel.Status === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getStatusDisplay(hotel.Status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hotel.IsDelete === 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getIsDeleteDisplay(hotel.IsDelete)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
        )}

        {/* 空状态 */}
        {!loading && hotels.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到符合条件的酒店</h3>
            <p className="text-gray-500">请尝试调整查询条件</p>
          </div>
        )}

        {/* 结果统计 */}
        {!loading && (
        <div className="mt-8 text-center text-gray-600">
            共找到 {hotels.length} 家酒店
            {error && (
              <span className="ml-2 text-sm text-orange-600">
                (使用备用数据)
              </span>
            )}
        </div>
        )}

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
  );
}
