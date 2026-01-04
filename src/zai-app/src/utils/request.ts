// src/utils/request.ts
import axios from 'axios';
import { API_BASE_URL } from '../config';

const request = axios.create({
  baseURL: API_BASE_URL,
  // 其他全局配置
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    console.log('请求拦截器 - 当前token:', token);
    
    // 如果token存在，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('请求拦截器 - 最终请求配置:', config);
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('响应拦截器错误:', error);
    return Promise.reject(error);
  }
);

export default request;