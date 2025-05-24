import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, theme } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  UserOutlined, 
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  FileTextOutlined,
  BellOutlined,
  SafetyOutlined,
  AuditOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  TagOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/admin/')) {
      return [path.split('/')[2]];
    }
    return ['dashboard'];
  };

  // 处理退出登录
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // 菜单项
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      onClick: () => navigate('/admin/dashboard'),
    },
    {
      key: 'user',
      icon: <TeamOutlined />,
      label: '用户管理',
      children: [
        {
          key: 'user-list',
          label: '用户列表',
          onClick: () => navigate('/admin/user-list'),
        },
        {
          key: 'user-roles',
          label: '角色管理',
          onClick: () => navigate('/admin/user-roles'),
        },
        {
          key: 'user-permissions',
          label: '权限管理',
          onClick: () => navigate('/admin/user-permissions'),
        },
      ],
    },
    {
      key: 'content',
      icon: <FileTextOutlined />,
      label: '内容管理',
      children: [
        {
          key: 'questions',
          label: '题目管理',
          onClick: () => navigate('/admin/questions'),
        },
        {
          key: 'categories',
          label: '分类管理',
          onClick: () => navigate('/admin/categories'),
        },
        {
          key: 'tags',
          label: '标签管理',
          onClick: () => navigate('/admin/tags'),
        },
      ],
    },
    {
      key: 'review',
      icon: <AuditOutlined />,
      label: '审核管理',
      children: [
        {
          key: 'question-review',
          label: '题目审核',
          onClick: () => navigate('/admin/question-review'),
        },
        {
          key: 'avatar-review',
          label: '头像审核',
          onClick: () => navigate('/admin/avatar-review'),
        },
        {
          key: 'comment-review',
          label: '评论审核',
          onClick: () => navigate('/admin/comment-review'),
        },
      ],
    },
    {
      key: 'community',
      icon: <AppstoreOutlined />,
      label: '社区管理',
      children: [
        {
          key: 'posts',
          label: '帖子管理',
          onClick: () => navigate('/admin/posts'),
        },
        {
          key: 'comments',
          label: '评论管理',
          onClick: () => navigate('/admin/comments'),
        },
        {
          key: 'topics',
          label: '话题管理',
          onClick: () => navigate('/admin/topics'),
        },
      ],
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统设置',
      children: [
        {
          key: 'settings',
          label: '基础设置',
          onClick: () => navigate('/admin/settings'),
        },
        {
          key: 'logs',
          label: '系统日志',
          onClick: () => navigate('/admin/logs'),
        },
        {
          key: 'ai-config',
          label: 'AI配置',
          onClick: () => navigate('/admin/ai-config'),
        },
      ],
    },
  ];

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      label: '个人资料',
      icon: <UserOutlined />,
      onClick: () => navigate('/admin/profile'),
    },
    {
      key: 'settings',
      label: '账户设置',
      icon: <SettingOutlined />,
      onClick: () => navigate('/admin/account-settings'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        width={256}
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div className="flex items-center justify-center py-4">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start pl-4'} transition-all`}>
            <img src="/logo.svg" alt="Logo" className="h-8" />
            {!collapsed && <span className="ml-2 text-lg font-bold text-primary-600">Dev-Deck Admin</span>}
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          style={{ border: 'none' }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="bg-white px-4 flex justify-between items-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="mr-4"
          />
          <div className="flex items-center">
            <Badge count={5} size="small" className="mr-4">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="flex items-center cursor-pointer">
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  src={user?.avatarUrl}
                  className="mr-2"
                />
                <span>{user?.nickname || user?.username || '管理员'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          className="mx-4 my-4"
          style={{
            padding: 24,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 