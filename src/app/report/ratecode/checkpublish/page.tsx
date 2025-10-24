'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RateCodeCheckResult {
  酒店编码: string;
  酒店名称: string;
  酒店类型: string;
  PMSType: string;
  发布渠道: string;
  房价码发布数量: number;
  房价码明细列表: string;
}

export default function RateCodeCheckPublish() {
  const [queryDate, setQueryDate] = useState('');
  const [rateCodes, setRateCodes] = useState('');
  const [channelCodes, setChannelCodes] = useState('');
  const [groupCodes, setGroupCodes] = useState<string[]>(['JG','JL','NY','NH','NI','NU','KP']);
  const [status, setStatus] = useState('1');
  const [isDelete, setIsDelete] = useState('0');
  const [pmsTypes, setPmsTypes] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [results, setResults] = useState<RateCodeCheckResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRateCodes, setSelectedRateCodes] = useState<string>('');

  // 设置默认查询日期为今天
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setQueryDate(today);
  }, []);

  // 查询函数
  const handleQuery = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('queryDate', queryDate);
      params.append('rateCodes', rateCodes);
      params.append('channelCodes', channelCodes);
      if (groupCodes.length > 0) params.append('groupCodes', groupCodes.join(','));
      params.append('status', status);
      params.append('isDelete', isDelete);
      if (pmsTypes.length > 0) params.append('pmsTypes', pmsTypes.join(','));
      if (propertyTypes.length > 0) params.append('propertyTypes', propertyTypes.join(','));

      const response = await fetch(`/api/report/ratecode/checkpublish?${params.toString()}`);
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
    const today = new Date().toISOString().split('T')[0];
    setQueryDate(today);
    setRateCodes('');
    setChannelCodes('');
    setGroupCodes(['JG','JL','NY','NH','NI','NU','KP']);
    setStatus('1');
    setIsDelete('0');
    setPmsTypes([]);
    setPropertyTypes([]);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题和返回按钮 */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">检查RateCode是否发布</h1>
              <p className="text-gray-600">查询指定日期和条件下的房价码发布状态</p>
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
            {/* 查询日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                查询日期
              </label>
              <input
                type="date"
                value={queryDate}
                onChange={(e) => setQueryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 房价码列表 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                房价码列表
              </label>
              <input
                type="text"
                placeholder=""
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
              <select
                value={channelCodes}
                onChange={(e) => setChannelCodes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部</option>
                <option value="CTP">CTP 携程</option>
                <option value="MDI">MDI 美团</option>
                <option value="OBR">OBR 飞猪</option>
                <option value="CTM">CTM 商旅</option>
                <option value="WEB">WEB 官渠</option>
              </select>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      酒店编号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      酒店名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      酒店类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      PMS类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      发布渠道
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      房价码数量
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                        {result.酒店编码}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.酒店名称}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getPropertyTypeDisplay(result.酒店类型)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getPmsTypeDisplay(result.PMSType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {result.发布渠道}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setSelectedRateCodes(result.房价码明细列表);
                            setShowModal(true);
                          }}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                        >
                          {result.房价码发布数量}
                        </button>
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
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
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
                    onClick={() => setShowModal(false)}
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
