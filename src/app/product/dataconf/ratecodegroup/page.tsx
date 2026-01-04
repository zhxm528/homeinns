'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState } from 'react';
import Link from 'next/link';
// @ts-ignore: antd may not have types installed in this environment
import 'antd/dist/reset.css';
// @ts-ignore: antd types might be missing
import { Select } from 'antd';

interface RateCodeGroup {
  ID: number;
  品牌代码: string;
  房价码组名称: string;
  房价码数量: number;
  房价码明细列表: string[];
  级别: number;
  酒店代码: string;
  酒店名称: string;
  管理公司: string;
  渠道码: string;
}

export default function RateCodeGroupPage() {
  const [groupCodes, setGroupCodes] = useState<string[]>([]);
  const [rateCode, setRateCode] = useState('');
  const [channelCodes, setChannelCodes] = useState<string[]>([]);
  const [results, setResults] = useState<RateCodeGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRateCodes, setSelectedRateCodes] = useState<string[]>([]);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [selectedChannelCode, setSelectedChannelCode] = useState('');

  // 查询函数
  const handleQuery = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (groupCodes.length > 0) params.append('groupCodes', groupCodes.join(','));
      if (rateCode) params.append('rateCode', rateCode);
      if (channelCodes.length > 0) params.append('channelCodes', channelCodes.join(','));

      const response = await fetch(`/api/product/dataconf/ratecodegroup?${params.toString()}`);
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
    setGroupCodes([]);
    setRateCode('');
    setChannelCodes([]);
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

  const getChannelCodeDisplay = (code: string) => {
    const channelCodeMap: Record<string, string> = {
      'CTP': '携程',
      'MDI': '美团',
      'OBR': '飞猪',
      'CTM': '商旅',
      'WEB': '官渠'
    };
    return channelCodeMap[code] || code;
  };

  // 管理公司枚举选项
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

  // 渠道码枚举选项
  const channelCodeEnumOptions = [
    { label: '携程', value: 'CTP' },
    { label: '美团', value: 'MDI' },
    { label: '飞猪', value: 'OBR' },
    { label: '商旅', value: 'CTM' },
    { label: '官渠', value: 'WEB' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题和返回按钮 */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">数据配置-房价码分组</h1>
              <p className="text-gray-600">查询和展示房价码分组配置信息</p>
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
            {/* 酒店管理公司 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                酒店管理公司
              </label>
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="选择酒店管理公司"
                className="w-full"
                value={groupCodes}
                onChange={(vals) => setGroupCodes(vals as string[])}
                options={groupCodeEnumOptions}
                filterOption={(input, option) =>
                  ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            {/* 房价码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                房价码（模糊查询）
              </label>
              <input
                type="text"
                placeholder="输入房价码"
                value={rateCode}
                onChange={(e) => setRateCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 渠道码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                渠道码
              </label>
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="选择渠道码"
                className="w-full"
                value={channelCodes}
                onChange={(vals) => setChannelCodes(vals as string[])}
                options={channelCodeEnumOptions}
                filterOption={(input, option) =>
                  ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleQuery}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              style={{ color: '#ffffff' }}
            >
              {loading ? '查询中...' : '查询'}
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
              style={{ color: '#ffffff' }}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 left-0 z-10">
                      房价码组名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      房价码数量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      渠道码
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      级别
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      酒店名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                      品牌名称
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                        {result.房价码组名称}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setSelectedRateCodes(result.房价码明细列表);
                            setShowModal(true);
                          }}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                        >
                          {result.房价码数量}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setSelectedChannelCode(result.渠道码 || '暂无');
                            setShowChannelModal(true);
                          }}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer"
                        >
                          {result.渠道码 ? getChannelCodeDisplay(result.渠道码) : '--'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.级别}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.酒店名称}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getGroupCodeDisplay(result.品牌代码)}
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

        {/* 房价码明细弹窗 */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative z-10">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">房价码明细</h3>
                </div>
                <div className="px-6 py-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {selectedRateCodes.length > 0 ? (
                      selectedRateCodes.map((rateCode, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-900">{rateCode}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">暂无数据</p>
                    )}
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

        {/* 渠道码详情弹窗 */}
        {showChannelModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowChannelModal(false)}></div>
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative z-10">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">渠道码详情</h3>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm text-gray-900">{selectedChannelCode}</p>
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
