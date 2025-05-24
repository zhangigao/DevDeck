import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  HomeOutlined, 
  ReadOutlined, 
  StarOutlined, 
  FileAddOutlined, 
  HistoryOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  QuestionCircleOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { RootState } from '@/store';

const { Sider } = Layout;

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // 菜单项配置
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: 'quiz',
      icon: <ReadOutlined />,
      label: <Link to="/quiz">刷题</Link>,
    },
    {
      key: 'community',
      icon: <CommentOutlined />,
      label: <Link to="/community">社区</Link>,
    }
  ];

  // 已登录用户可见的菜单项
  const authenticatedMenuItems = [
    {
      key: 'questions',
      icon: <AppstoreOutlined />,
      label: '题目管理',
      children: [
        {
          key: '/questions/create',
          icon: <FileAddOutlined />,
          label: <Link to="/questions/create">创建题目</Link>,
        },
        {
          key: '/questions/my',
          icon: <HistoryOutlined />,
          label: <Link to="/questions/my">我的题目</Link>,
        },
        {
          key: '/questions/favorites',
          icon: <StarOutlined />,
          label: <Link to="/questions/favorites">我的收藏</Link>,
        },
      ],
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '个人中心',
      children: [
        {
          key: '/profile',
          icon: <UserOutlined />,
          label: <Link to="/profile">个人资料</Link>,
        },
        {
          key: '/settings',
          icon: <SettingOutlined />,
          label: <Link to="/settings">账户设置</Link>,
        },
      ],
    },
  ];

  // 未登录用户可见的菜单项
  const guestMenuItems = [
    {
      key: 'auth',
      icon: <TeamOutlined />,
      label: '账号',
      children: [
        {
          key: '/auth/login',
          label: <Link to="/auth/login">登录</Link>,
        },
        {
          key: '/auth/register',
          label: <Link to="/auth/register">注册</Link>,
        },
      ],
    },
  ];

  // 通用菜单项（底部）
  const commonMenuItems = [
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: '帮助',
      children: [
        {
          key: '/faq',
          label: <Link to="/faq">常见问题</Link>,
        },
        {
          key: '/about',
          label: <Link to="/about">关于我们</Link>,
        },
      ],
    },
  ];

  // 组合所有菜单项
  const allMenuItems = [
    ...menuItems,
    ...(isAuthenticated ? authenticatedMenuItems : guestMenuItems),
    ...commonMenuItems,
  ];

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    
    // 精确匹配路径
    if (path === '/') {
      return ['/'];
    }
    
    // 处理子路径
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      // 针对二级路径返回完整路径作为key
      if (pathParts.length > 1) {
        return [path];
      }
      // 一级路径
      return [`/${pathParts[0]}`];
    }
    
    return [];
  };

  // 获取当前展开的子菜单
  const getOpenKeys = () => {
    const path = location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    
    if (pathParts.length === 0) return [];
    
    if (pathParts[0] === 'questions') return ['questions'];
    if (pathParts[0] === 'profile' || pathParts[0] === 'settings') return ['user'];
    if (pathParts[0] === 'login' || pathParts[0] === 'register') return ['auth'];
    if (pathParts[0] === 'faq' || pathParts[0] === 'about') return ['help'];
    
    return [];
  };

  return (
    <Sider
      width={200}
      collapsible
      collapsed={sidebarCollapsed}
      className="fixed left-0 top-0 h-screen bg-white shadow-md z-10"
      trigger={null}
    >
      <div className="h-16 flex items-center justify-center">
        <Link to="/" className="flex items-center justify-center">
          <img 
            src="/logo.svg" 
            alt="Dev-Deck Logo" 
            className="h-8"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling!.style.display = 'block';
            }}
          />
          {!sidebarCollapsed && (
            <span className="ml-2 text-xl font-bold text-primary-600">Dev-Deck</span>
          )}
        </Link>
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        items={allMenuItems}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default AppSidebar; 