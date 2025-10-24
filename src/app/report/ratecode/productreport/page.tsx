'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface ProductReportResult {
  房价码组名称: string;
  房价码: string;
  渠道: string;
  间夜数: number;
  客房收入: number;
  平均房价: number;
  房价码明细: string;
  渠道明细: string;
}

interface Hotel {
  HotelCode: string;
  HotelName: string;
}

export default function ProductReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rateCodes, setRateCodes] = useState('');
  const [channelCodes, setChannelCodes] = useState<string[]>([]);
  const [groupCodes, setGroupCodes] = useState<string[]>(['JG','JL','NY','NH','NI','NU','KP']);
  const [status, setStatus] = useState('1');
  const [isDelete, setIsDelete] = useState('0');
  const [pmsTypes, setPmsTypes] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [hotelSearchTerm, setHotelSearchTerm] = useState('');
  const [hotelList, setHotelList] = useState<Hotel[]>([]);
  const [hotelListLoading, setHotelListLoading] = useState(false);
  const [showHotelDropdown, setShowHotelDropdown] = useState(false);
  const [results, setResults] = useState<ProductReportResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRateCodeModal, setShowRateCodeModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [selectedRateCodes, setSelectedRateCodes] = useState<string>('');
  const [selectedChannels, setSelectedChannels] = useState<string>('');

  // 获取酒店列表
  const fetchHotelList = useCallback(async (searchTerm?: string) => {
    try {
      setHotelListLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        // 同时搜索酒店编号和酒店名称
        params.append('hotelCode', searchTerm);
      }
      // 应用当前查询条件中的 PropertyType、PMSType 和 GroupCode 过滤
      if (propertyTypes.length > 0) {
        params.append('propertyTypes', propertyTypes.join(','));
      }
      if (pmsTypes.length > 0) {
        params.append('pmsTypes', pmsTypes.join(','));
      }
      if (groupCodes.length > 0) {
        params.append('groupCodes', groupCodes.join(','));
      }
      // 只查询启用且未删除的酒店
      params.append('status', '1');
      params.append('isDelete', '0');
      
      const response = await fetch(`/api/hotels?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setHotelList(data.data || []);
      } else {
        setHotelList(data.data || []);
      }
    } catch (err) {
      console.error('获取酒店列表失败:', err);
      setHotelList([]);
    } finally {
      setHotelListLoading(false);
    }
  }, [propertyTypes, pmsTypes, groupCodes]);

  // 设置默认查询日期为近30天
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  // 当查询条件改变时重新获取酒店列表
  useEffect(() => {
    // 如果用户正在搜索酒店或有过滤条件时，重新获取酒店列表
    if (hotelSearchTerm.length > 0) {
      fetchHotelList(hotelSearchTerm);
    }
  }, [propertyTypes, pmsTypes, groupCodes, fetchHotelList, hotelSearchTerm]);

  // 酒店搜索处理
  const handleHotelSearch = (value: string) => {
    setHotelSearchTerm(value);
    if (value.length > 0) {
      setShowHotelDropdown(true);
      fetchHotelList(value);
    } else {
      setShowHotelDropdown(false);
      setSelectedHotel('');
    }
  };

  // 选择酒店
  const handleSelectHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel.HotelCode);
    setHotelSearchTerm(`${hotel.HotelCode} - ${hotel.HotelName}`);
    setShowHotelDropdown(false);
  };

  // 查询函数
  const handleQuery = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      params.append('rateCodes', rateCodes);
      if (channelCodes.length > 0) params.append('channelCodes', channelCodes.join(','));
      if (groupCodes.length > 0) params.append('groupCodes', groupCodes.join(','));
      if (selectedHotel) params.append('hotelCode', selectedHotel);
      params.append('status', status);
      params.append('isDelete', isDelete);
      if (pmsTypes.length > 0) params.append('pmsTypes', pmsTypes.join(','));
      if (propertyTypes.length > 0) params.append('propertyTypes', propertyTypes.join(','));

      const response = await fetch(`/api/report/ratecode/productreport?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || '查询失败');
        setResults([]);
      }
    } catch (err) {
      console.error('查询失败:', err);
      setError('网络请求失败，请检查网络连接');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 重置查询条件
  const handleReset = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
    setRateCodes('');
    setChannelCodes([]);
    setGroupCodes(['JG','JL','NY','NH','NI','NU','KP']);
    setStatus('1');
    setIsDelete('0');
    setPmsTypes([]);
    setPropertyTypes([]);
    setSelectedHotel('');
    setHotelSearchTerm('');
    setResults([]);
    setError(null);
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

  // 多选处理函数
  const handlePmsTypeChange = (type: string) => {
    setPmsTypes(prev => 
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

  const handleGroupCodeChange = (code: string) => {
    setGroupCodes(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleChannelCodeChange = (code: string) => {
    setChannelCodes(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.hotel-dropdown-container')) {
        setShowHotelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题和返回按钮 */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">房价码产量报表</h1>
              <p className="text-gray-600">查询指定日期段和条件下的房价码产量数据</p>
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

        {/* 查询条件 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">查询条件</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 开始日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                开始日期
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 结束日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                结束日期
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 酒店列表 */}
            <div className="relative hotel-dropdown-container">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                酒店列表
              </label>
              <input
                type="text"
                placeholder="搜索酒店"
                value={hotelSearchTerm}
                onChange={(e) => handleHotelSearch(e.target.value)}
                onFocus={() => {
                  if (hotelSearchTerm.length > 0) {
                    setShowHotelDropdown(true);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showHotelDropdown && hotelList.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {hotelList.map((hotel) => (
                    <div
                      key={hotel.HotelCode}
                      onClick={() => handleSelectHotel(hotel)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="text-sm font-medium text-gray-900">{hotel.HotelCode}</div>
                      <div className="text-xs text-gray-500">{hotel.HotelName}</div>
                    </div>
                  ))}
                </div>
              )}
              {hotelListLoading && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-center text-sm text-gray-500">
                  加载中...
                </div>
              )}
            </div>

            {/* 房价码列表 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                房价码列表
              </label>
              <input
                type="text"
                placeholder="逗号分隔"
                value={rateCodes}
                onChange={(e) => setRateCodes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 发布渠道列表 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                发布渠道列表
              </label>
              <div className="flex flex-wrap gap-2">
                {['CTP','MDI','OBR','CTM','WEB'].map(code => (
                  <label key={code} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={channelCodes.includes(code)}
                      onChange={() => handleChannelCodeChange(code)}
                      className="mr-1"
                    />
                    <span className="text-sm">{code} {getChannelDisplay(code)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 管理公司列表 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理公司列表
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

            {/* 状态列表 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">启用</option>
                <option value="0">停用</option>
              </select>
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

            {/* 产权类型 */}
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

            {/* 是否删除列表 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                是否删除
              </label>
              <select
                value={isDelete}
                onChange={(e) => setIsDelete(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">正常</option>
                <option value="1">已删除</option>
              </select>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleQuery}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? '查询中...' : '查询'}
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
              <span className="text-lg text-gray-600">正在查询数据...</span>
            </div>
          </div>
        )}

        {/* 结果表格 */}
        {!loading && results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 sticky left-0 z-10">
                      房价码组名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      房价码
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      渠道
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      间夜数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      客房收入
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      平均房价
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-0">
                        {result.房价码组名称}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setSelectedRateCodes(result.房价码明细);
                            setShowRateCodeModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {result.房价码}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setSelectedChannels(result.渠道明细);
                            setShowChannelModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {result.渠道}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.间夜数}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ¥{result.客房收入.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ¥{result.平均房价.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!loading && results.length === 0 && !error && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无数据</h3>
            <p className="text-gray-500">请设置查询条件后点击查询按钮</p>
          </div>
        )}

        {/* 结果统计 */}
        {!loading && results.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            共找到 {results.length} 条记录
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

        {/* 房价码详情弹窗 */}
        {showRateCodeModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowRateCodeModal(false)}></div>
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative z-10">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">房价码明细</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-2">
                    {selectedRateCodes.split(',').map((rateCodeItem, index) => {
                      const parts = rateCodeItem.trim().split(' ');
                      const code = parts[0];
                      const name = parts.slice(1).join(' ');
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{code}</span>
                            {name && <span className="text-xs text-gray-500">{name}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowRateCodeModal(false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 渠道详情弹窗 */}
        {showChannelModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowChannelModal(false)}></div>
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative z-10">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">渠道明细</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-2">
                    {selectedChannels.split(',').map((channelItem, index) => {
                      const parts = channelItem.trim().split(' ');
                      const code = parts[0];
                      const name = parts.slice(1).join(' ');
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{code}</span>
                            {name && <span className="text-xs text-gray-500">{name}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowChannelModal(false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

