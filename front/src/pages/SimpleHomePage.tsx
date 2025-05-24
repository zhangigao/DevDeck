import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const SimpleHomePage: React.FC = () => {
  return (
    <div className="p-6">
      <Card className="mb-6 shadow-md">
        <Title level={2}>欢迎来到 Dev-Deck</Title>
        <Paragraph className="mb-4 text-lg">
          专为开发者设计的刷题平台，提升您的编程技能，准备技术面试
        </Paragraph>
        <Space>
          <Link to="/test">
            <Button type="primary" size="large">测试页面</Button>
          </Link>
          <Link to="/community">
            <Button size="large">社区</Button>
          </Link>
          <Link to="/admin/dashboard">
            <Button size="large">管理后台</Button>
          </Link>
        </Space>
      </Card>
      
      <Card title="路由导航" className="shadow-md">
        <ul className="list-disc pl-6">
          <li><Link to="/">首页</Link></li>
          <li><Link to="/test">测试页面</Link></li>
          <li><Link to="/community">社区首页</Link></li>
          <li><Link to="/admin/dashboard">管理后台</Link></li>
          <li><Link to="/quiz">刷题页面</Link></li>
          <li><Link to="/category/1">分类题目页面</Link></li>
          <li><Link to="/profile">个人资料页面</Link></li>
        </ul>
      </Card>
    </div>
  );
};

export default SimpleHomePage; 