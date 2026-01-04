import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Select } from 'antd';
import ChainSelect from '../../components/common/ChainSelect';
import WeekdaySelect from '../../components/common/WeekdaySelect';

interface AdditionalService {
  chainId: string;
  serviceCode: string;
  serviceName: string;
  description: string;
  unitPrice: number;
  unitNum: number;
  limitStartTime: string;
  limitEndTime: string;
  availWeeks: string[];
}

const weekOptions = [
  { value: '1', label: '周一' },
  { value: '2', label: '周二' },
  { value: '3', label: '周三' },
  { value: '4', label: '周四' },
  { value: '5', label: '周五' },
  { value: '6', label: '周六' },
  { value: '7', label: '周日' },
];

const AdditionalServiceList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    chainId: '',
    serviceCode: '',
    serviceName: '',
    description: '',
    unitPrice: '',
    unitNum: '',
    limitStartTime: '',
    limitEndTime: '',
    availWeeks: [] as string[]
  });

  // Mock data - replace with actual API call
  const [services] = useState<AdditionalService[]>([
    {
      chainId: '1',
      serviceCode: 'BREAKFAST',
      serviceName: '早餐',
      description: '标准双人早餐',
      unitPrice: 88.00,
      unitNum: 2,
      limitStartTime: '07:00',
      limitEndTime: '10:00',
      availWeeks: ['1', '2', '3', '4', '5', '6', '7']
    }
  ]);

  const handleInputChange = (field: keyof typeof searchParams, value: string | string[]) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search params:', searchParams);
  };

  const handleAdd = () => {
    navigate('/additionalservice/add');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">包价列表</h1>
      </div>

      {/* Search Panel */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">查询条件</h2>
        </div>
        <form onSubmit={handleSearch} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所属集团</label>
              <ChainSelect
                value={searchParams.chainId}
                onChange={(value: string) => handleInputChange('chainId', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">包价代码</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchParams.serviceCode}
                onChange={(e) => handleInputChange('serviceCode', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">包价名称</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchParams.serviceName}
                onChange={(e) => handleInputChange('serviceName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchParams.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">单价</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchParams.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchParams.unitNum}
                onChange={(e) => handleInputChange('unitNum', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
              <input
                type="time"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchParams.limitStartTime}
                onChange={(e) => handleInputChange('limitStartTime', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
              <input
                type="time"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchParams.limitEndTime}
                onChange={(e) => handleInputChange('limitEndTime', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">选择星期</label>
              <WeekdaySelect
                value={searchParams.availWeeks}
                onChange={(value: string[]) => handleInputChange('availWeeks', value)}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-3">
            <button
              type="button"
              onClick={() => setSearchParams({
                chainId: '',
                serviceCode: '',
                serviceName: '',
                description: '',
                unitPrice: '',
                unitNum: '',
                limitStartTime: '',
                limitEndTime: '',
                availWeeks: []
              })}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
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
              添加包价
            </button>
          </div>
        </form>
      </div>

      {/* Service List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                所属集团
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                包价代码
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                包价名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                描述
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                单价
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                数量
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                开始时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                结束时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                星期限制
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.serviceCode}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.chainId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.serviceCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.serviceName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.unitPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.unitNum}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.limitStartTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.limitEndTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.availWeeks.map(week => 
                    weekOptions.find(opt => opt.value === week)?.label
                  ).join(', ')}
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
      </div>
    </div>
  );
};

export default AdditionalServiceList; 