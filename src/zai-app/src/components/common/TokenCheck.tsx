import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';

interface TokenCheckProps {
  children: React.ReactNode;
  checkToken?: boolean;
}

const TokenCheck: React.FC<TokenCheckProps> = ({ children, checkToken = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkTokenExists = async () => {
      if (checkToken) {
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('未登录或登录已过期，请重新登录');
          // 保存当前路径，登录后可以跳转回来
          localStorage.setItem('redirectPath', location.pathname);
          navigate('/login', { replace: true });
          return;
        }
      }
      setIsChecking(false);
    };

    checkTokenExists();
  }, [checkToken, navigate, location]);

  if (isChecking) {
    return null; // 或者返回一个加载指示器
  }

  return <>{children}</>;
};

export default TokenCheck; 