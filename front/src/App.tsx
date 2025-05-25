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

const { Content } = Layout;

// 定义受保护的路由
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const sidebarCollapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const [isInitializing, setIsInitializing] = useState(true);

  // 在组件加载时检查用户登录状态
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('===== 应用初始化开始 =====');
      
      const token = localStorage.getItem('token');
      let storedUserString = localStorage.getItem('user');
      let storedUser = null;
      
      try {
        if (storedUserString) {
          storedUser = JSON.parse(storedUserString);
        }
      } catch (error) {
        console.error('解析localStorage中的用户信息失败:', error);
        localStorage.removeItem('user'); // 清除无效的用户信息
      }
      
      console.log('App初始化 - 检查localStorage中的token:', token);
      console.log('App初始化 - localStorage中的用户信息:', storedUser);
      console.log('App初始化 - Redux中的用户信息:', user);
      console.log('App初始化 - isAuthenticated:', isAuthenticated);
      
      // 如果有token，需要验证和恢复用户状态
      if (token) {
        // 1. 首先检查是否已经有Redux用户信息
        if (user && user.uuid) {
          console.log('App初始化 - Redux中已有用户信息，无需恢复');
        }
        // 2. 如果没有Redux用户信息但有localStorage用户信息，从localStorage恢复
        else if (storedUser && storedUser.uuid) {
          console.log('App初始化 - 从localStorage恢复用户状态:', storedUser);
          
          // 恢复Redux状态
          dispatch(login({
            token,
            user: storedUser
          }));
        }
        // 3. 如果没有任何用户信息，尝试从服务器获取
        else {
          console.log('App初始化 - 尝试从服务器获取用户信息');
          
          try {
            // 调用API验证token并获取用户信息
            const response = await getCurrentUser();
            
            if (response && response.code === 200) {
              const userData = response.data;
              
              if (!userData || !userData.uuid) {
                console.error('服务器返回的用户数据不完整:', userData);
                throw new Error('服务器返回的用户数据不完整');
              }
              
              // 构建用户对象
              const user = {
                uuid: userData.uuid,
                username: userData.email,
                email: userData.email,
                nickname: userData.nickname || '用户',
                avatarUrl: userData.avatarUrl,
                id: userData.id
              };
              
              // 更新Redux状态
              dispatch(login({
                token,
                user
              }));
              
              // 保存到localStorage
              localStorage.setItem('user', JSON.stringify(user));
              
              console.log('App初始化 - 从服务器获取用户状态成功:', user);
            } else {
              console.log('App初始化 - token验证失败，清除本地状态');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              dispatch(logout());
            }
          } catch (error) {
            console.error('App初始化 - 从服务器获取用户状态失败:', error);
            
            // 可能是网络错误，不清除token，但标记为未认证
            dispatch(logout());
          }
        }
      } else {
        console.log('App初始化 - 未找到token，用户未登录');
        // 确保登出状态
        if (isAuthenticated) {
          dispatch(logout());
        }
      }
      
      console.log('===== 应用初始化完成 =====');
      setIsInitializing(false);
    };

    initializeAuth();
  }, [dispatch, user, isAuthenticated]);

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