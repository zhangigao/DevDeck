import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 用户类型定义
export interface User {
  id?: number;
  uuid: string;
  username: string;
  email: string;
  nickname?: string;
  avatarUrl?: string;
}

// 认证状态类型定义
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// 初始状态
const token = localStorage.getItem('token');
let storedUser = null;

try {
  const userString = localStorage.getItem('user');
  if (userString) {
    storedUser = JSON.parse(userString);
  }
} catch (error) {
  console.error('解析用户信息出错:', error);
}

const initialState: AuthState = {
  isAuthenticated: !!token, // 如果有token则设置为已认证
  user: storedUser,
  token: token,
  loading: false,
  error: null,
};

// 添加调试信息
console.log('authSlice初始状态 - 从localStorage获取的token:', token);
console.log('authSlice初始状态 - 从localStorage获取的用户信息:', storedUser);
console.log('authSlice初始状态 - isAuthenticated:', !!token);

// 创建 slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 登录成功
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user)); // 存储用户信息
    },
    // 登录失败
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // 移除用户信息
    },
    // 退出登录
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // 移除用户信息
    },
    // 更新用户信息
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user)); // 同步更新localStorage
      }
    },
    // 开始加载
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
  },
});

// 导出 actions
export const { login, loginFailure, logout, updateUserProfile, startLoading } = authSlice.actions;

// 导出 reducer
export default authSlice.reducer; 