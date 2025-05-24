import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import QuizPage from '@/pages/quiz/QuizPage';
import CategoryQuizPage from '@/pages/quiz/CategoryQuizPage';
import ProfilePage from '@/pages/user/ProfilePage';
import AppLayout from '@/layouts/AppLayout';

// 管理后台页面
import AdminLayout from '@/layouts/AdminLayout';
import TestAdminPage from '@/pages/admin/TestAdminPage';
import UserListPage from '@/pages/admin/UserListPage';
import UserRolesPage from '@/pages/admin/UserRolesPage';
import AvatarReviewPage from '@/pages/admin/AvatarReviewPage';

// 社区页面
import TestCommunityPage from '@/pages/community/TestCommunityPage';
import PostDetailPage from '@/pages/community/PostDetailPage';

// 权限控制组件
import PrivateRoute from '@/components/PrivateRoute';
import AdminRoute from '@/components/AdminRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'category/:categoryId', element: <CategoryQuizPage /> },
      { 
        path: 'profile', 
        element: <PrivateRoute><ProfilePage /></PrivateRoute> 
      },
      
      // 社区模块路由
      { path: 'community', element: <TestCommunityPage /> },
      { path: 'community/post/:postId', element: <PostDetailPage /> },
      // 其他社区页面可以在此添加
      
      // 登录与注册页面
      { path: 'auth/login', element: <LoginPage /> },
      { path: 'auth/register', element: <RegisterPage /> },
      { path: 'auth/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <TestAdminPage /> },
      { path: 'user-list', element: <UserListPage /> },
      { path: 'user-roles', element: <UserRolesPage /> },
      { path: 'avatar-review', element: <AvatarReviewPage /> },
      // 其他后台管理页面路由
    ],
  },
  // 404页面重定向到首页
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router; 