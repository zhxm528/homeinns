import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import request from '../../utils/request';
import Toast from '../../components/Toast';
import TokenCheck from '../../components/common/TokenCheck';

interface CityFormData {
  cityId: string;
  cityCode: string;
  cityName: string;
  province: string;
}

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

const CityAdd: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<CityFormData>({
    cityId: '',
    cityCode: '',
    cityName: '',
    province: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  // 显示消息提示
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 获取城市详情
  const fetchCityDetail = async (cityId: string) => {
    setLoading(true);
    try {
      const res = await request.get(`/city/detail/${cityId}`);
      const cityData = res.data.data || res.data;
      setFormData({
        cityId: cityData.cityId,
        cityCode: cityData.cityCode,
        cityName: cityData.cityName,
        province: cityData.province
      });
    } catch (error: any) {
      showToast(error.response?.data?.message || '获取城市详情失败', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cityId = searchParams.get('cityId');
    if (cityId) {
      setIsEdit(true);
      fetchCityDetail(cityId);
    }
  }, [location]);

  const handleInputChange = (field: keyof CityFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await request.post('/city/save', formData);
      showToast(res.data.message || '保存成功', 'success');
      setTimeout(() => {
        navigate('/city/list');
      }, 1500);
    } catch (error: any) {
      showToast(error.response?.data?.message || '保存失败', 'error');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigate('/city/list');
  };

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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{isEdit ? '编辑城市' : '添加城市'}</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">城市代码</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.cityCode}
                  onChange={(e) => handleInputChange('cityCode', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">城市名称</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.cityName}
                  onChange={(e) => handleInputChange('cityName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所属省份</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                disabled={loading}
              >
                <FaTimes className="mr-2" />
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <FaSave className="mr-2" />
                {loading ? '保存中...' : (isEdit ? '更新' : '保存')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </TokenCheck>
  );
};

export default CityAdd; 