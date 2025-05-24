import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 用户类型定义
export interface User {
  id: number;
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
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

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
    },
    // 登录失败
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
    },
    // 退出登录
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    // 更新用户信息
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
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