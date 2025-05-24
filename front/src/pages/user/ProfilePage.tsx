import React, { useState } from 'react';
import { Card, Form, Input, Button, Avatar, Tabs, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      console.log('提交的表单数据:', values);
      message.success('个人信息已更新');
      setLoading(false);
    }, 1000);
  };

  const onPasswordFinish = (values: any) => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      console.log('修改密码:', values);
      message.success('密码已更新');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="profile-page">
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mr-6 mb-4 md:mb-0">
            <Avatar size={100} icon={<UserOutlined />} />
          </div>
          <div>
            <Title level={3}>个人中心</Title>
            <Text type="secondary">管理你的账户信息和偏好设置</Text>
          </div>
        </div>
      </Card>

      <Card>
        <Tabs defaultActiveKey="profile">
          <TabPane tab="基本信息" key="profile">
            <Form 
              layout="vertical" 
              onFinish={onFinish}
              initialValues={{
                username: '开发者',
                email: 'dev@example.com',
                nickname: '前端小能手',
              }}
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} disabled />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="nickname"
                label="昵称"
                rules={[{ required: true, message: '请输入昵称' }]}
              >
                <Input prefix={<IdcardOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存更改
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="修改密码" key="password">
            <Form layout="vertical" onFinish={onPasswordFinish}>
              <Form.Item
                name="currentPassword"
                label="当前密码"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 8, message: '密码长度不能少于8个字符' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="确认新密码"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  更新密码
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfilePage; 