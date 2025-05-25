import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const sidebarCollapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout className={sidebarCollapsed ? 'ml-[80px]' : 'ml-[200px]'} style={{ transition: 'margin-left 0.2s' }}>
        <AppHeader />
        <Content style={{ padding: '24px', overflow: 'auto', marginTop: 64 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 