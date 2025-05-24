import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 通知类型
export interface Notification {
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

// UI 状态类型定义
export interface UIState {
  sidebarCollapsed: boolean;
  notification: Notification | null;
  darkMode: boolean;
}

// 初始状态
const initialState: UIState = {
  sidebarCollapsed: false,
  notification: null,
  darkMode: false,
};

// 创建 slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // 切换侧边栏状态
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    // 设置侧边栏状态
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    // 显示通知
    showNotification: (state, action: PayloadAction<Notification>) => {
      state.notification = action.payload;
    },
    // 清除通知
    clearNotification: (state) => {
      state.notification = null;
    },
    // 切换暗黑模式
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    // 设置暗黑模式
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

// 导出 actions
export const {
  toggleSidebar,
  setSidebarCollapsed,
  showNotification,
  clearNotification,
  toggleDarkMode,
  setDarkMode,
} = uiSlice.actions;

// 导出 reducer
export default uiSlice.reducer; 