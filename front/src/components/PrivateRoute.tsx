import React from 'react';
import { Navigate } from 'react-router-dom';

// 模拟用户登录状态，实际项目中应从状态管理或API获取
const isLoggedIn = true; // 暂时设置为true，方便测试

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  if (!isLoggedIn) {
    // 用户未登录，重定向到登录页
    return <Navigate to="/auth/login" replace />;
  }

  // 用户已登录，显示受保护的内容
  return <>{children}</>;
};

export default PrivateRoute; 