import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const { Title } = Typography;

interface LoginForm {
  loginName: string;
  password: string;
}

interface UserInfo {
  userId: string;
  loginName: string;
  userName: string;
  roleId: string;
  roleName: string;
  chainId: string;
  chainCode: string;
  chainName: string;
  hotelId: string;
  hotelName: string;
  hotelCode: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginForm) => {
    try {
      console.log('=== 开始登录 ===');
      console.log('登录信息:', values);
      console.log('API完整路径:', `${API_BASE_URL}/login/userlogin`);
      
      setLoading(true);
      const response = await request.post('/login/userlogin', values);
      
      console.log('登录响应:', response.data);
      
      if (response.data.success) {
        // 检查响应数据是否包含必要的用户信息
        const userData = response.data.user;
        if (!userData || !userData.userId || !userData.chainId) {
          console.error('登录响应缺少必要的用户信息:', response.data);
          message.error('登录响应数据不完整，请联系管理员');
          return;
        }

        // 存储token
        localStorage.setItem('token', response.data.token);
        
        // 存储用户信息
        const userInfo: UserInfo = {
          userId: userData.userId,
          loginName: userData.loginName,
          userName: userData.userName,
          roleId: userData.roleId,
          roleName: userData.roleName,
          chainId: userData.chainId,
          chainCode: userData.chainCode,
          chainName: userData.chainName,
          hotelId: userData.hotelId,
          hotelName: userData.hotelName,
          hotelCode: userData.hotelCode
        };
        console.log('登录成功 - 保存的用户信息:', userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
        localStorage.setItem('userId', userInfo.userId);
        localStorage.setItem('loginName', userInfo.loginName);
        localStorage.setItem('userName', userInfo.userName);
        localStorage.setItem('roleId', userInfo.roleId);
        localStorage.setItem('roleName', userInfo.roleName);
        localStorage.setItem('chainId', userInfo.chainId);
        localStorage.setItem('chainCode', userInfo.chainCode);
        localStorage.setItem('chainName', userInfo.chainName);
        localStorage.setItem('hotelId', userInfo.hotelId);
        localStorage.setItem('hotelName', userInfo.hotelName);
        localStorage.setItem('hotelCode', userInfo.hotelCode);
        
        message.success('登录成功');
        // 跳转到首页
        navigate('/home');
      } else {
        message.error(response.data.message || '登录失败');
      }
    } catch (error: any) {
      console.error('登录失败:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          message.error('用户名或密码错误');
        } else {
          message.error(data?.message || '登录失败，请稍后重试');
        }
      } else {
        message.error('网络错误，请检查网络连接');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card 
        style={{ 
          width: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>系统登录</Title>
        </div>
        
        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="loginName"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 1, message: '用户名至少1个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 1, message: '密码至少1个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
