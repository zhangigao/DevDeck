import React from 'react';
import { Navigate } from 'react-router-dom';

// 模拟用户角色状态，实际项目中应从状态管理或API获取
const isAdmin = true; // 暂时设置为true，方便测试

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // 检查用户是否有管理员权限
  if (!isAdmin) {
    // 没有管理员权限，重定向到首页
    return <Navigate to="/" replace />;
  }

  // 有管理员权限，显示管理后台内容
  return <>{children}</>;
};

export default AdminRoute; 