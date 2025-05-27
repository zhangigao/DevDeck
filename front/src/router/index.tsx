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

// 题目相关页面
import CreateQuestionPage from '@/pages/questions/CreateQuestionPage';
import MyQuestionsPage from '@/pages/questions/MyQuestionsPage';
import FavoritesPage from '@/pages/questions/FavoritesPage';
import QuestionListPage from '@/pages/questions/QuestionListPage';

// 管理后台页面
import AdminLayout from '@/layouts/AdminLayout';
import AdminHomePage from '@/pages/admin/AdminHomePage';
import PermissionManagePage from '@/pages/admin/PermissionManagePage';
import UserRolesPage from '@/pages/admin/UserRolesPage';
import UserRoleManagePage from '@/pages/admin/UserRoleManagePage';
import UserListPage from '@/pages/admin/UserListPage';
import UserManagePage from '@/pages/admin/UserManagePage';
import AvatarReviewPage from '@/pages/admin/AvatarReviewPage';
import CategoryManagePage from '@/pages/admin/CategoryManagePage';
import QuestionManagePage from '@/pages/admin/QuestionManagePage';
import QuestionReviewPage from '@/pages/admin/QuestionReviewPage';
import PostReviewPage from '@/pages/admin/PostReviewPage';

// 社区页面
import CommunityPage from '@/pages/community/CommunityPage';
import CommunityHomePage from '@/pages/community/CommunityHomePage';
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
      { path: 'quiz/category/:categoryId', element: <CategoryQuizPage /> },
      { path: 'quiz/:slug', element: <QuizPage /> },
      { 
        path: 'profile', 
        element: <PrivateRoute><ProfilePage /></PrivateRoute> 
      },
      
      // 题目相关路由
      { path: 'questions', element: <QuestionListPage /> },
      { path: 'questions/category/:categoryId', element: <QuestionListPage /> },
      { 
        path: 'questions/create', 
        element: <PrivateRoute><CreateQuestionPage /></PrivateRoute> 
      },
      { 
        path: 'questions/my', 
        element: <PrivateRoute><MyQuestionsPage /></PrivateRoute> 
      },
      { 
        path: 'questions/favorites', 
        element: <PrivateRoute><FavoritesPage /></PrivateRoute> 
      },
      
      // 社区模块路由
      { path: 'community', element: <PrivateRoute><CommunityPage /></PrivateRoute> },
      { path: 'community/home', element: <PrivateRoute><CommunityHomePage /></PrivateRoute> },
      { path: 'community/post/:postId', element: <PrivateRoute><PostDetailPage /></PrivateRoute> },
      
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
      { path: 'dashboard', element: <AdminHomePage /> },
      { path: 'categories', element: <CategoryManagePage /> },
      { path: 'questions', element: <QuestionManagePage /> },
      { path: 'permissions', element: <PermissionManagePage /> },
      { path: 'roles', element: <UserRolesPage /> },
      { path: 'user-roles', element: <UserRoleManagePage /> },
      { path: 'users', element: <UserManagePage /> },
      { path: 'avatar-review', element: <AvatarReviewPage /> },
      { path: 'question-review', element: <QuestionReviewPage /> },
      { path: 'post-review', element: <PostReviewPage /> },
    ],
  },
  // 404页面重定向到首页
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router; 