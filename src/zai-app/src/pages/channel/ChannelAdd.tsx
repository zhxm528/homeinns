import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import Toast from '../../components/Toast';
import request from '../../utils/request';
import TokenCheck from '../../components/common/TokenCheck';

interface ChannelFormData {
  channelCode: string;
  channelName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
}

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

const ChannelAdd: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<ChannelFormData>({
    channelCode: '',
    channelName: '',
    description: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  // 显示消息提示
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 获取渠道详情
  const fetchChannelDetail = async (channelId: string) => {
    setLoading(true);
    try {
      const res = await request.get(`/channel/detail/${channelId}`);
      const channelData = res.data.data || res.data;
      setFormData({
        channelCode: channelData.channelCode,
        channelName: channelData.channelName,
        description: channelData.description,
        contactEmail: channelData.contactEmail,
        contactPhone: channelData.contactPhone
      });
    } catch (error: any) {
      showToast(error.response?.data?.message || '获取渠道详情失败', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const channelId = searchParams.get('channelId');
    if (channelId) {
      setIsEdit(true);
      fetchChannelDetail(channelId);
    }
  }, [location]);

  const handleInputChange = (field: keyof ChannelFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const searchParams = new URLSearchParams(location.search);
      const channelId = searchParams.get('channelId');
      
      const channelData = {
        channelId: channelId,
        channelCode: formData.channelCode,
        channelName: formData.channelName,
        description: formData.description,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone
      };

      let res;
      if (isEdit && channelId) {
        res = await request.put('/channel/update', channelData);
      } else {
        res = await request.post('/channel/add', channelData);
      }

      showToast(res.data.message || (isEdit ? '更新成功' : '添加成功'), 'success');
      setTimeout(() => {
        navigate('/channel/list');
      }, 1500);
    } catch (error: any) {
      showToast(error.response?.data?.message || (isEdit ? '更新失败' : '添加失败'), 'error');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigate('/channel/list');
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{isEdit ? '编辑渠道' : '添加渠道'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">渠道代码</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.channelCode}
                onChange={(e) => handleInputChange('channelCode', e.target.value)}
                disabled={isEdit}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">渠道名称</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.channelName}
                onChange={(e) => handleInputChange('channelName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
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
    </TokenCheck>
  );
};

export default ChannelAdd; 