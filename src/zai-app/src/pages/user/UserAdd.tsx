import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Toast from '../../components/Toast';
import request from '../../utils/request';
import { TabContext } from '../../App';
import HotelSelect from '../../components/common/HotelSelect';
import TokenCheck from '@/components/common/TokenCheck';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface FormData {
  loginName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  type: string;
  status: string;
  hotelId: string;
  [key: string]: string | undefined;
}

const UserAdd: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabContext = useContext(TabContext);
  const isEditMode = location.pathname.includes('/edit/');
  const userId = location.pathname.split('/edit/')[1];

  console.log('UserAdd 组件初始化，当前状态:', {
    isEditMode,
    userId,
    location: location.pathname,
    state: location.state
  });

  const [formData, setFormData] = useState<FormData>({
    loginName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    type: '2',
    status: '1',
    hotelId: ''
  });

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [loading, setLoading] = useState(false);

  // 显示消息提示
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // 加载用户数据
  useEffect(() => {
    console.log('UserAdd 组件初始化，当前状态:', {
      isEditMode,
      userId,
      location: location.pathname,
      state: location.state
    });

    if (isEditMode) {
      console.log('进入编辑模式，尝试获取用户数据');
      
      // 首先尝试从 state 中获取数据
      if (location.state?.userData) {
        console.log('从 state 中获取到用户数据:', location.state.userData);
        const userData = location.state.userData;
        setFormData({
          loginName: userData.loginName || '',
          username: userData.username || '',
          email: userData.email || '',
          phone: userData.phone || '',
          password: '', // 编辑时不显示密码
          type: userData.type?.toString() || '2',
          status: userData.status?.toString() || '1',
          hotelId: userData.hotelId || ''
        });
        return;
      }

      // 如果 state 中没有数据，尝试从 localStorage 获取
      const editUserData = localStorage.getItem('editUserData');
      console.log('从 localStorage 获取到的数据:', editUserData);
      
      if (editUserData) {
        try {
          const userData = JSON.parse(editUserData);
          console.log('解析后的用户数据:', userData);
          
          setFormData({
            loginName: userData.loginName || '',
            username: userData.username || '',
            email: userData.email || '',
            phone: userData.phone || '',
            password: '', // 编辑时不显示密码
            type: userData.type?.toString() || '2',
            status: userData.status?.toString() || '1',
            hotelId: userData.hotelId || ''
          });
          
          // 清除 localStorage 中的数据
          localStorage.removeItem('editUserData');
          console.log('已清除 localStorage 中的用户数据');
        } catch (error) {
          console.error('解析用户数据失败:', error);
          showToast('解析用户数据失败', 'error');
        }
      } else {
        console.warn('未找到用户数据，localStorage 为空');
      }
    } else {
      console.log('新增模式，初始化空表单');
    }
  }, [isEditMode, location.state, userId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 从localStorage获取token
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('未登录或登录已过期，请重新登录', 'error');
        navigate('/login');
        return;
      }

      // 准备提交的数据
      const submitData: Record<string, string | undefined> = { ...formData };
      
      // 编辑模式下添加回显用户的 userId
      if (isEditMode) {
        if (!userId) {
          showToast('用户ID不能为空', 'error');
          return;
        }
        submitData.userId = userId;
        console.log('编辑模式 - 添加回显用户的 userId:', userId);
      } else {
        // 新增模式下，从 localStorage 获取 chainId
        const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
        if (userInfo.chainId) {
          submitData.chainId = userInfo.chainId;
          console.log('新增模式 - 添加 chainId:', userInfo.chainId);
        }
      }

      // 移除空值属性
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null || submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      // 确保所有值都是字符串类型
      const finalData: Record<string, string> = {};
      Object.entries(submitData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          finalData[key] = String(value);
        }
      });

      console.log('准备提交的数据:', {
        isEditMode,
        userId: isEditMode ? userId : undefined,
        finalData
      });

      if (isEditMode) {
        // 编辑模式
        console.log('编辑用户 - 请求体:', JSON.stringify(finalData, null, 2));
        console.log('编辑用户 - 请求URL:', `/user/${userId}`);
        console.log('编辑用户 - 请求方法:', 'PUT');
        console.log('编辑用户 - 完整请求信息:', {
          url: `/user/${userId}`,
          method: 'PUT',
          data: finalData,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const res = await request.put(`/user/${userId}`, finalData);
        console.log('编辑用户 - 响应数据:', res.data);
        showToast('编辑成功', 'success');
      } else {
        // 新增模式
        console.log('新增用户 - 请求体:', JSON.stringify(finalData, null, 2));
        console.log('新增用户 - 请求URL:', '/user/add');
        console.log('新增用户 - 请求方法:', 'POST');
        console.log('新增用户 - 完整请求信息:', {
          url: '/user/add',
          method: 'POST',
          data: finalData,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const res = await request.post('/user/add', finalData);
        console.log('新增用户 - 响应数据:', res.data);
        showToast('新增成功', 'success');
      }


      setTimeout(() => {
        if (tabContext && tabContext.removeTab) {
          if (isEditMode) {
            tabContext.removeTab(`/user/edit/${userId}`);
          } else {
            tabContext.removeTab('/user/add');
          }
        }
        if (tabContext && tabContext.setActiveTab) {
          tabContext.setActiveTab('/user/list');
      }
        navigate('/user/list');
      }, 1500);

    } catch (error: any) {
      console.error(isEditMode ? '编辑用户失败:' : '新增用户失败:', error);
      showToast(error.response?.data?.message || (isEditMode ? '编辑用户失败' : '新增用户失败'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!userId) {
        showToast('用户ID不能为空', 'error');
        return;
      }

      const requestBody = {
        userId: userId,
        userLogin: formData.loginName
      };

      console.log('重置密码 - 请求URL:', `/user/${userId}/reset-password`);
      console.log('重置密码 - 请求体:', JSON.stringify(requestBody, null, 2));

      const res = await request.post(`/user/${userId}/reset-password`, requestBody);
      console.log('重置密码 - 响应数据:', res.data);
      showToast('密码重置成功', 'success');
    } catch (error: any) {
      console.error('重置密码失败:', error);
      showToast(error.response?.data?.message || '重置密码失败', 'error');
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
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4">{isEditMode ? '编辑用户' : '新增用户'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">登录名</label>
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
                  value={formData.loginName}
                  onChange={e => handleInputChange('loginName', e.target.value)}
                  required
                  disabled={isEditMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">显示名</label>
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
                  value={formData.username}
                  onChange={e => handleInputChange('username', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  className="border rounded px-3 py-2 w-full"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">手机</label>
                <input
                  type="tel"
                  className="border rounded px-3 py-2 w-full"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                  <input
                    type="password"
                    className="border rounded px-3 py-2 w-full"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={formData.type}
                  onChange={e => handleInputChange('type', e.target.value)}
                  required
                >
                  <option value="0">管理员</option>
                  <option value="1">集团</option>
                  <option value="2">酒店</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={formData.status}
                  onChange={e => handleInputChange('status', e.target.value)}
                  required
                >
                  <option value="1">启用</option>
                  <option value="0">停用</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">默认酒店</label>
                <HotelSelect
                  value={formData.hotelId}
                  onChange={(value: string) => handleInputChange('hotelId', value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  重置密码
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  console.log('点击关闭按钮');
                  if (tabContext) {
                    tabContext.removeTab(location.pathname);
                  }
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                关闭
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? '提交中...' : '保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </TokenCheck>
  );
};

export default UserAdd; 