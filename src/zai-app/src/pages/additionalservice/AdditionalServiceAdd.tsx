import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import ChainSelect from '../../components/common/ChainSelect';
import WeekdaySelect from '../../components/common/WeekdaySelect';

interface AdditionalServiceFormData {
  chainId: string;
  serviceCode: string;
  serviceName: string;
  description: string;
  unitPrice: string;
  unitNum: string;
  limitStartTime: string;
  limitEndTime: string;
  availWeeks: string[];
}

const AdditionalServiceAdd: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AdditionalServiceFormData>({
    chainId: '',
    serviceCode: '',
    serviceName: '',
    description: '',
    unitPrice: '',
    unitNum: '',
    limitStartTime: '',
    limitEndTime: '',
    availWeeks: []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AdditionalServiceFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AdditionalServiceFormData, string>> = {};

    if (!formData.chainId) {
      newErrors.chainId = '请选择所属集团';
    }
    if (!formData.serviceCode) {
      newErrors.serviceCode = '请输入包价代码';
    }
    if (!formData.serviceName) {
      newErrors.serviceName = '请输入包价名称';
    }
    if (!formData.unitPrice) {
      newErrors.unitPrice = '请输入单价';
    } else if (isNaN(Number(formData.unitPrice)) || Number(formData.unitPrice) <= 0) {
      newErrors.unitPrice = '单价必须大于0';
    }
    if (!formData.unitNum) {
      newErrors.unitNum = '请输入数量';
    } else if (!Number.isInteger(Number(formData.unitNum)) || Number(formData.unitNum) <= 0) {
      newErrors.unitNum = '数量必须为正整数';
    }
    if (!formData.limitStartTime) {
      newErrors.limitStartTime = '请选择开始时间';
    }
    if (!formData.limitEndTime) {
      newErrors.limitEndTime = '请选择结束时间';
    }
    if (formData.availWeeks.length === 0) {
      newErrors.availWeeks = '请选择星期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AdditionalServiceFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      const response = await fetch('http://localhost:8081/additionalservice/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chain_id: formData.chainId,
          service_code: formData.serviceCode,
          service_name: formData.serviceName,
          description: formData.description,
          unit_price: parseFloat(formData.unitPrice),
          unit_num: parseInt(formData.unitNum),
          limit_start_time: formData.limitStartTime,
          limit_end_time: formData.limitEndTime,
          avail_weeks: formData.availWeeks
        }),
      });

      if (!response.ok) {
        throw new Error('添加包价失败');
      }

      // 添加成功后返回列表页
      navigate('/additionalservice/list');
    } catch (error) {
      console.error('Error adding additional service:', error);
      // TODO: Show error message to user
    }
  };

  const handleCancel = () => {
    navigate('/additionalservice/list');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">添加包价</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                所属集团 <span className="text-red-500">*</span>
              </label>
              <ChainSelect
                value={formData.chainId}
                onChange={(value: string) => handleInputChange('chainId', value)}
              />
              {errors.chainId && (
                <p className="mt-1 text-sm text-red-600">{errors.chainId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                包价代码 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.serviceCode}
                onChange={(e) => handleInputChange('serviceCode', e.target.value)}
              />
              {errors.serviceCode && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceCode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                包价名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.serviceName}
                onChange={(e) => handleInputChange('serviceName', e.target.value)}
              />
              {errors.serviceName && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                单价 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', e.target.value)}
              />
              {errors.unitPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                数量 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.unitNum}
                onChange={(e) => handleInputChange('unitNum', e.target.value)}
              />
              {errors.unitNum && (
                <p className="mt-1 text-sm text-red-600">{errors.unitNum}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                开始时间 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.limitStartTime}
                onChange={(e) => handleInputChange('limitStartTime', e.target.value)}
              />
              {errors.limitStartTime && (
                <p className="mt-1 text-sm text-red-600">{errors.limitStartTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                结束时间 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.limitEndTime}
                onChange={(e) => handleInputChange('limitEndTime', e.target.value)}
              />
              {errors.limitEndTime && (
                <p className="mt-1 text-sm text-red-600">{errors.limitEndTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                选择星期 <span className="text-red-500">*</span>
              </label>
              <WeekdaySelect
                value={formData.availWeeks}
                onChange={(value: string[]) => handleInputChange('availWeeks', value)}
              />
              {errors.availWeeks && (
                <p className="mt-1 text-sm text-red-600">{errors.availWeeks}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <FaTimes className="mr-2" />
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
            >
              <FaSave className="mr-2" />
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdditionalServiceAdd; 