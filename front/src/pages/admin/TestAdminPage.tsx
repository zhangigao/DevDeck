import React from 'react';
import { Card, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const TestAdminPage: React.FC = () => {
  return (
    <div className="p-4">
      <Card className="mb-4">
        <Title level={2}>测试管理页面</Title>
        <Paragraph>这是一个简化版的管理页面，用于测试路由是否正常工作。</Paragraph>
        
        <div className="mt-4">
          <Title level={4}>导航链接：</Title>
          <ul className="list-disc pl-6">
            <li><Link to="/">返回首页</Link></li>
            <li><Link to="/test">测试页面</Link></li>
            <li><Link to="/community">社区首页</Link></li>
            <li><Link to="/admin">管理后台首页</Link></li>
          </ul>
        </div>
        
        <Button type="primary" className="mt-4">测试按钮</Button>
      </Card>
    </div>
  );
};

export default TestAdminPage; 