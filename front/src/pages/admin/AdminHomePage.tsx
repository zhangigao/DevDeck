import React from 'react';
import { Card, Typography, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const AdminHomePage: React.FC = () => {
  return (
    <div className="admin-home-page">
      <div className="mb-6">
        <Title level={2}>后台管理</Title>
        <Paragraph type="secondary">
          欢迎使用 Dev-Deck 后台管理系统
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card 
            title="权限管理" 
            hoverable
            actions={[
              <Link to="/admin/permissions">
                <Button type="link">进入管理</Button>
              </Link>
            ]}
          >
            <Paragraph>
              管理系统权限，创建和编辑权限项目
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card 
            title="角色管理" 
            hoverable
            actions={[
              <Link to="/admin/roles">
                <Button type="link">进入管理</Button>
              </Link>
            ]}
          >
            <Paragraph>
              管理用户角色，分配角色权限
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card 
            title="用户角色" 
            hoverable
            actions={[
              <Link to="/admin/user-roles">
                <Button type="link">进入管理</Button>
              </Link>
            ]}
          >
            <Paragraph>
              查看用户角色分配情况
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card 
            title="用户列表" 
            hoverable
            actions={[
              <Link to="/admin/users">
                <Button type="link">进入管理</Button>
              </Link>
            ]}
          >
            <Paragraph>
              管理系统用户，查看用户信息
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card 
            title="头像审核" 
            hoverable
            actions={[
              <Link to="/admin/avatar-review">
                <Button type="link">进入管理</Button>
              </Link>
            ]}
          >
            <Paragraph>
              审核用户上传的头像内容
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card 
            title="题目审核" 
            hoverable
            actions={[
              <Link to="/admin/question-review">
                <Button type="link">进入管理</Button>
              </Link>
            ]}
          >
            <Paragraph>
              审核用户提交的题目内容
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card 
            title="文章审核" 
            hoverable
            actions={[
              <Link to="/admin/post-review">
                <Button type="link">进入管理</Button>
              </Link>
            ]}
          >
            <Paragraph>
              审核社区用户发布的文章
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHomePage; 