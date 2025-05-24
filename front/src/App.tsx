import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';
import { RootState } from '@/store';

// 导入布局组件
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import AppFooter from '@/components/layout/AppFooter';
import NotificationContainer from '@/components/common/NotificationContainer';

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
import NotFoundPage from '@/pages/NotFoundPage';

const { Content } = Layout;

// 定义受保护的路由
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const sidebarCollapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);

  // 在组件加载时检查用户登录状态
  useEffect(() => {
    // 这里可以添加验证令牌有效性的逻辑
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout className={sidebarCollapsed ? 'ml-[80px]' : 'ml-[200px]'} style={{ transition: 'margin-left 0.2s' }}>
        <AppHeader />
        <Content className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* 受保护的路由 */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path="/quiz/category/:categoryId" element={<ProtectedRoute><CategoryQuizPage /></ProtectedRoute>} />
            <Route path="/questions/create" element={<ProtectedRoute><CreateQuestionPage /></ProtectedRoute>} />
            <Route path="/questions/my" element={<ProtectedRoute><MyQuestionsPage /></ProtectedRoute>} />
            <Route path="/questions/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
            
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