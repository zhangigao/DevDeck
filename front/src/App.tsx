import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout } from 'antd';
import { RootState } from '@/store';
import { login, logout } from '@/store/slices/authSlice';
import { getCurrentUser } from '@/api/userApi';

// 导入布局组件
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import AppFooter from '@/components/layout/AppFooter';
import NotificationContainer from '@/components/common/NotificationContainer';
import LoadingScreen from '@/components/common/LoadingScreen';

// 导入页面组件
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ProfilePage from '@/pages/user/ProfilePage';
import QuizPage from '@/pages/quiz/QuizPage';
import CategoryQuizPage from '@/pages/quiz/CategoryQuizPage';
import CreateQuestionPage from '@/pages/questions/CreateQuestionPage';
import MyQuestionsPage from '@/pages/questions/MyQuestionsPage';
import FavoritesPage from '@/pages/questions/FavoritesPage';
import QuestionListPage from '@/pages/questions/QuestionListPage';
import NotFoundPage from '@/pages/NotFoundPage';

// 社区页面
import CommunityPage from '@/pages/community/CommunityPage';
import CommunityHomePage from '@/pages/community/CommunityHomePage';
import PostDetailPage from '@/pages/community/PostDetailPage';

// 后台管理页面
import AdminHomePage from '@/pages/admin/AdminHomePage';
import PermissionManagePage from '@/pages/admin/PermissionManagePage';
import UserRolesPage from '@/pages/admin/UserRolesPage';
import UserRoleManagePage from '@/pages/admin/UserRoleManagePage';
import UserListPage from '@/pages/admin/UserListPage';
import AvatarReviewPage from '@/pages/admin/AvatarReviewPage';
import QuestionReviewPage from '@/pages/admin/QuestionReviewPage';
import PostReviewPage from '@/pages/admin/PostReviewPage';
import CategoryManagePage from '@/pages/admin/CategoryManagePage';
import QuestionManagePage from '@/pages/admin/QuestionManagePage';

const { Content } = Layout;

// 定义受保护的路由
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  // 临时允许访问，用于开发测试
  return true ? <>{children}</> : <Navigate to="/auth/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const sidebarCollapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const [isInitializing, setIsInitializing] = useState(true);

  // 简化初始化逻辑，直接设置为已初始化
  useEffect(() => {
    console.log('===== 应用初始化开始 =====');
    // 临时跳过复杂的认证逻辑，直接设置为已初始化
    setIsInitializing(false);
    console.log('===== 应用初始化完成 =====');
  }, []);

  // 如果正在初始化，显示加载屏幕
  if (isInitializing) {
    return <LoadingScreen tip="正在初始化应用..." />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout className={sidebarCollapsed ? 'ml-[80px]' : 'ml-[200px]'} style={{ transition: 'margin-left 0.2s' }}>
        <AppHeader />
        <Content className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/auth/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* 受保护的路由 */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path="/quiz/category/:categoryId" element={<ProtectedRoute><CategoryQuizPage /></ProtectedRoute>} />
            <Route path="/questions" element={<QuestionListPage />} />
            <Route path="/questions/category/:categoryId" element={<QuestionListPage />} />
            <Route path="/questions/create" element={<ProtectedRoute><CreateQuestionPage /></ProtectedRoute>} />
            <Route path="/questions/my" element={<ProtectedRoute><MyQuestionsPage /></ProtectedRoute>} />
            <Route path="/questions/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
            
            {/* 社区路由 */}
            <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
            <Route path="/community/home" element={<ProtectedRoute><CommunityHomePage /></ProtectedRoute>} />
            <Route path="/community/post/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
            
            {/* 后台管理路由 */}
            <Route path="/admin" element={<ProtectedRoute><AdminHomePage /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminHomePage /></ProtectedRoute>} />
            <Route path="/admin/permissions" element={<ProtectedRoute><PermissionManagePage /></ProtectedRoute>} />
            <Route path="/admin/roles" element={<ProtectedRoute><UserRolesPage /></ProtectedRoute>} />
            <Route path="/admin/user-roles" element={<ProtectedRoute><UserRoleManagePage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><UserListPage /></ProtectedRoute>} />
            <Route path="/admin/avatar-review" element={<ProtectedRoute><AvatarReviewPage /></ProtectedRoute>} />
            <Route path="/admin/question-review" element={<ProtectedRoute><QuestionReviewPage /></ProtectedRoute>} />
            <Route path="/admin/post-review" element={<ProtectedRoute><PostReviewPage /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute><CategoryManagePage /></ProtectedRoute>} />
            <Route path="/admin/questions" element={<ProtectedRoute><QuestionManagePage /></ProtectedRoute>} />
            
            {/* 404页面 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Content>
        <AppFooter />
      </Layout>
      <NotificationContainer />
    </Layout>
  );
}

export default App; 