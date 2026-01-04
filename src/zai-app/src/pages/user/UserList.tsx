import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaEdit, FaTrash } from 'react-icons/fa';
import Toast from '../../components/Toast';
import request from '../../utils/request';
import TokenCheck from '../../components/common/TokenCheck';
import ChainsSelect from '../../components/common/ChainsSelect';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    chainIds: [] as string[],
    loginName: '',
    username: '',
    email: '',
    phone: '',
    status: '',
    type: ''
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);


  // 角色类型映射
  const roleMap: { [key: number]: string } = {
    0: '管理员',
    1: '集团',
    2: '酒店'
  };

  // 状态映射
  const statusMap: { [key: number]: string } = {
    0: '停用',
    1: '启用'
  };

  // 显示消息提示
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 构建请求体
      const requestBody: any = {};
      Object.entries(searchParams).forEach(([key, value]) => {
        if (key === 'chainIds' && Array.isArray(value) && value.length > 0) {
          // 对于集团ID数组，直接传递数组
          requestBody.chainIds = value;
        } else if (value && typeof value === 'string' && value.trim() !== '') {
          requestBody[key] = value;
        }
      });
      
      // 从localStorage获取token
      const token = localStorage.getItem('token');
      console.log('用户列表 - 当前token:', token);
      
      if (!token) {
        showToast('未登录或登录已过期，请重新登录', 'error');
        navigate('/login');
        return;
      }

      console.log('用户列表 - 请求URL:', '/user/list');
      console.log('用户列表 - 请求体:', JSON.stringify(requestBody, null, 2));

      const res = await request.post('/user/list', requestBody);
      console.log('用户列表 - 响应数据:', res.data);

      // 检查响应数据结构
      if (!Array.isArray(res.data)) {
        console.error('用户列表 - 响应数据格式错误:', res.data);
        showToast('服务器返回数据格式错误', 'error');
        setUsers([]);
        return;
      }

      // 直接使用返回的数组作为数据
      setUsers(res.data);
    } catch (error: any) {
      console.error('用户列表 - 请求失败:', error);
      console.error('用户列表 - 错误详情:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data
      });
      
      if (error.response?.status === 401) {
        showToast('登录已过期，请重新登录', 'error');
        navigate('/login');
      } else {
        showToast(error.response?.data?.message || '获取用户列表失败', 'error');
      }
      setUsers([]);
    }
    setLoading(false);
  };



  // 使用useRef来跟踪是否是首次渲染
  const isFirstRender = React.useRef(true);

  useEffect(() => {
    // 只在首次渲染时调用
    if (isFirstRender.current) {
      fetchUsers();
      isFirstRender.current = false;
    }
  }, []); // 空依赖数组，只在组件挂载时执行一次

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 重置搜索条件
  const handleReset = () => {
    setSearchParams({
      chainIds: [],
      loginName: '',
      username: '',
      email: '',
      phone: '',
      status: '',
      type: ''
    });
    fetchUsers();
  };

  // 处理编辑用户
  const handleEdit = async (userId: string) => {
    try {
      console.log('开始编辑用户，userId:', userId);
      
      // 获取用户详细信息
      console.log('正在请求用户详情，URL:', `/user/${userId}`);
      const res = await request.get(`/user/${userId}`);
      console.log('用户详情 - 响应数据:', res.data);
      
      if (!res.data) {
        console.error('用户详情响应数据为空');
        showToast('获取用户详情失败：响应数据为空', 'error');
        return;
      }
      
      // 将用户数据存储到 localStorage
      const userData = res.data;
      console.log('准备存储到 localStorage 的用户数据:', userData);
      localStorage.setItem('editUserData', JSON.stringify(userData));
      
      // 验证数据是否正确存储
      const storedData = localStorage.getItem('editUserData');
      console.log('验证 localStorage 中的数据:', storedData);
      
      // 跳转到编辑页面，使用正确的路由路径
      const editPath = `/user/edit/${userId}`;
      console.log('准备跳转到编辑页面:', editPath);
      console.log('跳转参数:', { mode: 'edit', userId });
      
      navigate(editPath, { 
        state: { 
          mode: 'edit', 
          userId,
          userData // 同时通过 state 传递数据
        } 
      });
    } catch (error: any) {
      console.error('获取用户详情失败:', error);
      console.error('错误详情:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      showToast(error.response?.data?.message || '获取用户详情失败', 'error');
    }
  };

  // 处理删除用户
  const handleDelete = async (userId: string) => {
    if (!window.confirm('确定要删除该用户吗？')) {
      return;
    }

    try {
      const res = await request.delete(`/user/${userId}`);
      console.log('删除用户 - 响应数据:', res.data);
      showToast('删除成功', 'success');
      // 重新加载用户列表
      fetchUsers();
    } catch (error: any) {
      console.error('删除用户失败:', error);
      showToast(error.response?.data?.message || '删除用户失败', 'error');
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
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">选择集团</label>
                    <ChainsSelect
                      value={searchParams.chainIds}
                      onChange={(value) => handleInputChange('chainIds', value)}
                      placeholder="请选择集团"
                      size="large"
                      allowClear={true}
                      maxTagCount={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">登录名</label>
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full"
                      placeholder="请输入登录名"
                      value={searchParams.loginName}
                      onChange={e => handleInputChange('loginName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">显示名</label>
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full"
                      placeholder="请输入显示名"
                      value={searchParams.username}
                      onChange={e => handleInputChange('username', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full"
                      placeholder="请输入邮箱"
                      value={searchParams.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">手机</label>
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full"
                      placeholder="请输入手机号"
                      value={searchParams.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                    <select
                      className="border rounded px-3 py-2 w-full"
                      value={searchParams.type}
                      onChange={e => handleInputChange('type', e.target.value)}
                    >
                      <option value="">全部</option>
                      <option value="0">管理员</option>
                      <option value="1">集团</option>
                      <option value="2">酒店</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                    <select
                      className="border rounded px-3 py-2 w-full"
                      value={searchParams.status}
                      onChange={e => handleInputChange('status', e.target.value)}
                    >
                      <option value="">全部</option>
                      <option value="1">启用</option>
                      <option value="0">停用</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
                  >
                    重置
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? '查询中...' : '查询'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">用户列表</h2>
            <button
              onClick={() => navigate('/user/add')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              新增
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-400">加载中...</div>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="px-2 py-2 border">登录名</th>
                  <th className="px-2 py-2 border">显示名</th>
                  <th className="px-2 py-2 border">邮箱</th>
                  <th className="px-2 py-2 border">手机</th>
                  <th className="px-2 py-2 border">角色</th>
                  <th className="px-2 py-2 border">状态</th>
                  <th className="px-2 py-2 border">默认酒店</th>
                  <th className="px-2 py-2 border">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50 text-center">
                    <td className="px-2 py-2 border">{user.loginName}</td>
                    <td className="px-2 py-2 border">{user.username}</td>
                    <td className="px-2 py-2 border">{user.email}</td>
                    <td className="px-2 py-2 border">{user.phone}</td>
                    <td className="px-2 py-2 border">{roleMap[user.type] || '未知'}</td>
                    <td className="px-2 py-2 border">
                      {user.status === 1 ? (
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1 align-middle"></span>
                      ) : (
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1 align-middle"></span>
                      )}
                      {statusMap[user.status] || '未知'}
                    </td>
                    <td className="px-2 py-2 border" title={user.hotelName || '无默认酒店'}>
                      {user.hotelCode || '-'}
                    </td>
                    <td className="px-2 py-2 border">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(user.userId)}
                          className="text-blue-600 hover:text-blue-800 p-1 border border-blue-600 rounded"
                          title="编辑"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user.userId)}
                          className="text-red-600 hover:text-red-800 p-1 border border-red-600 rounded"
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
            <span>共 {users.length} 条数据</span>
            {/* 分页组件可后续补充 */}
          </div>
        </div>
      </div>
    </TokenCheck>
  );
};

export default UserList; 