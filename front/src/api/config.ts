import axios from 'axios';
import { message } from 'antd';

// 接口基础URL
export const API_BASE_URL = 'http://localhost:8080/dev-deck';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    
    console.log('请求拦截器 - 从localStorage获取的token:', token);
    console.log('请求拦截器 - token类型:', typeof token);
    console.log('请求拦截器 - token长度:', token ? token.length : 0);
    console.log('请求URL:', config.url);
    console.log('请求方法:', config.method);
    
    // 如果有token且不为空则添加到请求头
    if (token && token.trim() !== '') {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('请求拦截器 - 已设置Authorization头:', config.headers['Authorization']);
    } else {
      console.log('请求拦截器 - 没有找到有效token');
    }
    
    // 打印完整的请求头
    console.log('请求拦截器 - 完整请求头:', JSON.stringify(config.headers, null, 2));
    
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 处理响应数据
    const res = response.data;
    
    if (res.code !== 200) {
      message.error(res.message || '操作失败');
      
      // 401: 未登录或token过期
      if (res.code === 401) {
        // 清除本地token和用户信息
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        console.log('API响应401 - 清除用户状态并跳转到登录页');
        
        // 立即重定向到登录页
        window.location.href = '/auth/login';
        
        return Promise.reject(new Error('登录已过期，请重新登录'));
      }
      
      return Promise.reject(new Error(res.message || '未知错误'));
    }
    
    // 直接返回后端的响应数据，保留原始结构
    return res;
  },
  (error) => {
    let errorMsg = '请求失败';
    
    if (error.response) {
      const status = error.response.status;
      
      // 根据状态码处理不同错误
      switch (status) {
        case 401:
          errorMsg = '未授权，请重新登录';
          // 清除本地token和用户信息
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          console.log('HTTP 401错误 - 清除用户状态并跳转到登录页');
          
          // 立即重定向到登录页
          window.location.href = '/auth/login';
          break;
        case 403:
          errorMsg = '拒绝访问';
          break;
        case 404:
          errorMsg = '请求的资源不存在';
          break;
        case 500:
          errorMsg = '服务器内部错误';
          break;
        default:
          errorMsg = `请求错误 (${status})`;
      }
    } else if (error.request) {
      errorMsg = '服务器无响应';
    }
    
    message.error(errorMsg);
    return Promise.reject(error);
  }
);

export default api;
export { api as request }; 