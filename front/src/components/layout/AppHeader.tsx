import React from 'react';
import { Layout, Button, Avatar, Dropdown, Input, Space, Badge, message } from 'antd';
import { 
  UserOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { logout as apiLogout } from '@/api/userApi';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);

  // 处理侧边栏折叠/展开
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // 处理退出登录
  const handleLogout = async () => {
    try {
      // 调用退出登录API
      await apiLogout();
      
      // 清除本地状态
      dispatch(logoutAction());
      message.success('退出登录成功');
      navigate('/auth/login');
    } catch (error) {
      console.error('退出登录失败:', error);
      
      // 即使API失败，也执行本地登出
      dispatch(logoutAction());
      navigate('/auth/login');
    }
  };

  // 未登录状态的菜单项
  const guestActions = (
    <Space>
      <Link to="/auth/login">
        <Button type="link">登录</Button>
      </Link>
      <Link to="/auth/register">
        <Button type="primary">注册</Button>
      </Link>
    </Space>
  );

  // 已登录状态的用户菜单
  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">个人中心</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: <Link to="/settings">设置</Link>,
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: <span onClick={handleLogout}>退出登录</span>,
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  // 已登录状态的菜单项
  const userActions = (
    <Space>
      <Input 
        prefix={<SearchOutlined />} 
        placeholder="搜索题目..." 
        style={{ width: 200 }} 
        className="mr-4"
      />
      <Badge count={5} size="small">
        <Button type="text" icon={<BellOutlined />} />
      </Badge>
      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
        <div className="flex items-center cursor-pointer">
          <Avatar 
            src={user?.avatarUrl} 
            icon={!user?.avatarUrl && <UserOutlined />} 
            size="small" 
            className="mr-2" 
          />
          <span>{user?.nickname || user?.username || '用户'}</span>
        </div>
      </Dropdown>
    </Space>
  );

  return (
    <Header 
      className={`bg-white p-0 shadow-sm flex items-center justify-between pr-6 fixed top-0 right-0 z-10 transition-all duration-200 ${
        sidebarCollapsed ? 'left-[80px]' : 'left-[200px]'
      }`}
      style={{ height: 64 }}
    >
      <div className="flex items-center">
        <Button 
          type="text" 
          icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
          onClick={handleToggleSidebar}
          className="w-16 h-16"
        />
      </div>
      
      <div>
        {isAuthenticated ? userActions : guestActions}
      </div>
    </Header>
  );
};

export default AppHeader; 