import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  HomeOutlined, 
  ReadOutlined, 
  StarOutlined, 
  FileAddOutlined, 
  HistoryOutlined,
  AppstoreOutlined,
  UserOutlined,
  TeamOutlined,
  CommentOutlined,
  DashboardOutlined,
  SafetyOutlined,
  CrownOutlined,
  UsergroupAddOutlined,
  AuditOutlined,
  BookOutlined,
  TagsOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { RootState } from '@/store';

const { Sider } = Layout;

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 根据当前路径设置展开的菜单
  useEffect(() => {
    const path = location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    
    if (pathParts.length === 0) {
      setOpenKeys([]);
      return;
    }
    
    // 根据当前路径确定需要展开的菜单
    if (pathParts[0] === 'questions' && pathParts.length > 1) {
      // /questions/create, /questions/my, /questions/favorites
      setOpenKeys(['my-questions']);
    } else if (pathParts[0] === 'admin') {
      // 所有 /admin/* 路径
      setOpenKeys(['admin']);
    } else if (path === '/profile') {
      setOpenKeys(['user']);
    } else if (pathParts[0] === 'auth' && (pathParts[1] === 'login' || pathParts[1] === 'register')) {
      setOpenKeys(['auth']);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  // 菜单项配置
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/questions',
      icon: <BookOutlined />,
      label: '题目库',
    },
    {
      key: '/quiz',
      icon: <ReadOutlined />,
      label: '刷题',
    },
    {
      key: '/community',
      icon: <CommentOutlined />,
      label: '社区',
    }
  ];

  // 已登录用户可见的菜单项
  const authenticatedMenuItems = [
    {
      key: 'my-questions',
      icon: <AppstoreOutlined />,
      label: '我的题目',
      children: [
        {
          key: '/questions/create',
          icon: <FileAddOutlined />,
          label: '创建题目',
        },
        {
          key: '/questions/my',
          icon: <HistoryOutlined />,
          label: '我的题目',
        },
        {
          key: '/questions/favorites',
          icon: <StarOutlined />,
          label: '我的收藏',
        },
      ],
    },
    {
      key: 'admin',
      icon: <DashboardOutlined />,
      label: '管理后台',
      children: [
        {
          key: '/admin/dashboard',
          icon: <DashboardOutlined />,
          label: '仪表盘',
        },
        {
          key: '/admin/categories',
          icon: <TagsOutlined />,
          label: '分类管理',
        },
        {
          key: '/admin/questions',
          icon: <QuestionCircleOutlined />,
          label: '题目管理',
        },
        {
          key: '/admin/users',
          icon: <TeamOutlined />,
          label: '用户管理',
        },
        {
          key: '/admin/roles',
          icon: <CrownOutlined />,
          label: '角色管理',
        },
        {
          key: '/admin/permissions',
          icon: <SafetyOutlined />,
          label: '权限管理',
        },
        {
          key: '/admin/avatar-review',
          icon: <AuditOutlined />,
          label: '头像审核',
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
          label: '个人资料',
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
          label: '登录',
        },
        {
          key: '/auth/register',
          label: '注册',
        },
      ],
    },
  ];

  // 组合所有菜单项
  const allMenuItems = [
    ...menuItems,
    // 临时显示所有菜单项，用于开发测试
    ...authenticatedMenuItems,
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

  // 处理菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // 处理菜单点击
  const handleMenuClick = (e: any) => {
    console.log('菜单点击:', e.key);
    // 如果点击的是路由项，直接导航
    if (e.key.startsWith('/')) {
      navigate(e.key);
    }
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
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
        items={allMenuItems}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default AppSidebar; 