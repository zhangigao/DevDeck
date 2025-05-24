import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { GithubOutlined, HeartOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter: React.FC = () => {
  return (
    <Footer className="bg-white text-center">
      <Divider />
      <Space split={<Divider type="vertical" />} wrap>
        <Link href="https://github.com" target="_blank">
          <Space>
            <GithubOutlined />
            <span>GitHub</span>
          </Space>
        </Link>
        <Link href="/about">关于我们</Link>
        <Link href="/privacy">隐私政策</Link>
        <Link href="/terms">服务条款</Link>
      </Space>
      <div className="mt-2">
        <Text type="secondary">
          Dev-Deck © {new Date().getFullYear()} 由 <HeartOutlined className="text-red-500" /> 构建
        </Text>
      </div>
    </Footer>
  );
};

export default AppFooter; 