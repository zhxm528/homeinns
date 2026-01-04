import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Toast from '../../components/Toast';
import { TabContext } from '../../App';
import { API_BASE_URL } from '../../config';
import request from '../../utils/request';
import StatusSelect from '../../components/common/StatusSelect';
import TokenCheck from '../../components/common/TokenCheck';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

const ChainList: React.FC = () => {
  const navigate = useNavigate();
  const tabContext = useContext(TabContext);
  const [searchParams, setSearchParams] = useState({
    chainName: '',
    chainCode: '',
    contactEmail: '',
    contactPhone: '',
    status: ''
  });
  const [chains, setChains] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // 显示消息提示
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 获取集团列表
  const fetchChains = async () => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const res = await request.get(`/chain/list?${params.toString()}`);
      setChains(res.data.data || res.data);
      if (res.data.message) {
        showToast(res.data.message, 'success');
      }
    } catch (e: any) {
      setChains([]);
      showToast(e.response?.data?.message || '获取集团列表失败', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChains();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchChains();
  };

  const handleInputChange = (field: string, value: string | number | undefined) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = async (chainId: string) => {
    try {
      console.log('=== 编辑集团 ===');
      console.log('集团ID:', chainId);
      console.log('请求URL:', `/chain/${chainId}`);
      
      const res = await request.get(`/chain/${chainId}`);
      console.log('响应数据:', JSON.stringify(res.data, null, 2));
      
      const chainDetail = res.data.data;
      if (tabContext && tabContext.addTab) {
        tabContext.addTab({
          id: `/chain/edit/${chainId}`,
          title: '编辑集团',
          path: `/chain/edit/${chainId}`,
        });
      } else {
        navigate(`/chain/edit/${chainId}`);
      }
    } catch (error: any) {
      console.error('获取集团详情失败:', error);
      showToast(error.response?.data?.message || '获取集团详情失败', 'error');
    }
  };

  const handleDelete = async (chainId: string) => {
    if (window.confirm('确定要删除该集团吗？')) {
      try {
        console.log('=== 删除集团 ===');
        console.log('集团ID:', chainId);
        console.log('请求URL:', `/chain/${chainId}`);
        
        const res = await request.delete(`/chain/${chainId}`);
        console.log('响应数据:', JSON.stringify(res.data, null, 2));
        
        showToast(res.data.message || '删除成功', 'success');
        fetchChains(); // 刷新列表
      } catch (error: any) {
        console.error('删除集团失败:', error);
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
        <div className="bg-white rounded shadow mb-4">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer border-b"
            onClick={() => setIsPanelExpanded(!isPanelExpanded)}
          >
            <h3 className="text-lg font-medium">查询条件</h3>
            {isPanelExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {isPanelExpanded && (
            <div className="p-4">
              <form className="space-y-4" onSubmit={handleSearch}>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">集团名称</label>
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full"
                      placeholder="请输入集团名称"
                      value={searchParams.chainName}
                      onChange={e => handleInputChange('chainName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">集团代码</label>
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full"
                      placeholder="请输入集团代码"
                      value={searchParams.chainCode || ''}
                      onChange={e => handleInputChange('chainCode', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full"
                      placeholder="请输入邮箱"
                      value={searchParams.contactEmail}
                      onChange={e => handleInputChange('contactEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full"
                      placeholder="请输入电话"
                      value={searchParams.contactPhone}
                      onChange={e => handleInputChange('contactPhone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                    <StatusSelect
                      value={searchParams.status}
                      onChange={(value) => handleInputChange('status', value?.toString() || '')}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSearchParams({
                      chainName: '',
                      chainCode: '',
                      contactEmail: '',
                      contactPhone: '',
                      status: ''
                    })}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    重置
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    查询
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (tabContext && tabContext.addTab) {
                        tabContext.addTab({
                          id: '/chain/add',
                          title: '添加集团',
                          path: '/chain/add',
                        });
                      } else {
                        navigate('/chain/add');
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    添加集团
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="bg-white rounded shadow p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-400">加载中...</div>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="px-2 py-2 border">集团名称</th>
                  <th className="px-2 py-2 border">集团代码</th>
                  <th className="px-2 py-2 border">邮箱</th>
                  <th className="px-2 py-2 border">电话</th>
                  <th className="px-2 py-2 border">地址</th>
                  <th className="px-2 py-2 border">状态</th>
                  <th className="px-2 py-2 border">操作</th>
                </tr>
              </thead>
              <tbody>
                {chains.map((chain) => (
                  <tr key={chain.chainId} className="hover:bg-gray-50 text-center">
                    <td className="px-2 py-2 border">{chain.chainName}</td>
                    <td className="px-2 py-2 border">{chain.chainCode}</td>
                    <td className="px-2 py-2 border">{chain.contactEmail}</td>
                    <td className="px-2 py-2 border">{chain.contactPhone}</td>
                    <td className="px-2 py-2 border">{chain.headquartersAddress}</td>
                    <td className="px-2 py-2 border">
                      <span className={`px-2 py-1 rounded text-sm ${
                        Number(chain.status) === 1 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {Number(chain.status) === 1 ? '启用' : '停用'}
                      </span>
                    </td>
                    <td className="px-2 py-2 border">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(chain.chainId)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-400 transition-colors duration-200"
                          title="编辑"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(chain.chainId)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-200 hover:border-red-400 transition-colors duration-200"
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
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>共 {chains.length} 条数据</span>
          </div>
        </div>
      </div>
    </TokenCheck>
  );
};

export default ChainList; 