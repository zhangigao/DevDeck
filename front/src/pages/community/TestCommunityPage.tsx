import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const TestCommunityPage: React.FC = () => {
  return (
    <div className="p-4">
      <Card className="mb-4">
        <Title level={2}>测试社区首页</Title>
        <Paragraph>这是一个简化版的社区首页，用于测试路由是否正常工作。</Paragraph>
        
        <div className="mt-4">
          <Title level={4}>导航链接：</Title>
          <ul className="list-disc pl-6">
            <li><Link to="/">返回首页</Link></li>
            <li><Link to="/test">测试页面</Link></li>
            <li><Link to="/admin/dashboard">管理后台</Link></li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default TestCommunityPage; 