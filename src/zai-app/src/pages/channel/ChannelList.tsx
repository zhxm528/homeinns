import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Toast from '../../components/Toast';
import request from '../../utils/request';
import TokenCheck from '../../components/common/TokenCheck';

interface Channel {
    channelId: string;
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

const ChannelList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    channelCode: '',
    channelName: ''
  });
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // 显示消息提示
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 获取渠道列表
  const fetchChannels = async () => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const res = await request.get(`/channel/list?${params.toString()}`);
      setChannels(res.data.data || res.data);
      if (res.data.message) {
        showToast(res.data.message, 'success');
      }
    } catch (e: any) {
      setChannels([]);
      showToast(e.response?.data?.message || '获取渠道列表失败', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchChannels();
  };

  const handleInputChange = (field: keyof typeof searchParams, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdd = () => {
    navigate('/channel/add');
  };

  const handleEdit = (channelId: string) => {
    navigate(`/channel/add?channelId=${channelId}`);
  };

  const handleDelete = async (channelId: string) => {
    if (window.confirm('确定要删除该渠道吗？')) {
      try {
        const res = await request.delete(`/channel/delete/${channelId}`);
        showToast(res.data.message || '删除成功', 'success');
        fetchChannels(); // 刷新列表
      } catch (error: any) {
        showToast(error.response?.data?.message || '删除失败', 'error');
      }
    }
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
          <h1 className="text-2xl font-bold text-gray-800">渠道列表</h1>
        </div>

        {/* Search Panel */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">查询条件</h2>
          </div>
          <form onSubmit={handleSearch} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">渠道代码</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.channelCode}
                  onChange={(e) => handleInputChange('channelCode', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">渠道名称</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchParams.channelName}
                  onChange={(e) => handleInputChange('channelName', e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setSearchParams({
                  channelCode: '',
                  channelName: ''
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
                添加渠道
              </button>
            </div>
          </form>
        </div>

        {/* Channel List Table */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="text-center py-8 text-gray-400">加载中...</div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  渠道代码
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  渠道名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  描述
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  邮箱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  电话
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {channels.map((channel) => (
                  <tr key={channel.channelId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {channel.channelCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {channel.channelName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {channel.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {channel.contactEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {channel.contactPhone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-400 transition-colors duration-200"
                          onClick={() => handleEdit(channel.channelId)}
                        title="编辑"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-200 hover:border-red-400 transition-colors duration-200"
                          onClick={() => handleDelete(channel.channelId)}
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
          )}
          <div className="flex justify-between items-center p-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-700">
                共 <span className="font-medium">{channels.length}</span> 条记录
                </p>
            </div>
          </div>
        </div>
      </div>
    </TokenCheck>
  );
};

export default ChannelList; 