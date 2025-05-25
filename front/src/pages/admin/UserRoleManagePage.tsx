import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Tag, Space, Descriptions } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { UserRole, getUserDetail } from '@/api/adminApi';

const { Title } = Typography;

const UserRoleManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState<UserRole | null>(null);
  const [form] = Form.useForm();

  // 搜索用户
  const handleSearch = async (values: { uuid: string }) => {
    if (!values.uuid.trim()) {
      message.error('请输入用户UUID');
      return;
    }

    setLoading(true);
    try {
      const response = await getUserDetail(values.uuid.trim());
      if (response.code === 200) {
        setUserDetail(response.data);
        message.success('用户信息获取成功');
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      setUserDetail(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-role-manage-page">
      <Card className="mb-6">
        <Title level={3}>用户角色管理</Title>
        
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          className="mt-4"
        >
          <Form.Item
            name="uuid"
            rules={[{ required: true, message: '请输入用户UUID' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户UUID"
              style={{ width: 300 }}
            />
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={loading}
            >
              搜索用户
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {userDetail && (
        <Card>
          <Title level={4}>用户详情</Title>
          
          <Descriptions bordered column={2} className="mt-4">
            <Descriptions.Item label="用户UUID">
              {userDetail.uuid}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              {userDetail.email}
            </Descriptions.Item>
            <Descriptions.Item label="昵称">
              {userDetail.nickName || '未设置'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {new Date(userDetail.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {new Date(userDetail.updatedAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="创建者">
              {userDetail.createdBy}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-6">
            <Title level={5}>用户角色</Title>
            {userDetail.roles && userDetail.roles.length > 0 ? (
              <div className="mt-3">
                {userDetail.roles.map(role => (
                  <div key={role.id} className="mb-4 p-4 border border-gray-200 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <Tag color="blue" className="text-base px-3 py-1">
                        {role.name}
                      </Tag>
                      <span className="text-gray-500 text-sm">
                        创建时间: {new Date(role.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{role.description}</p>
                    
                    <div>
                      <span className="font-medium text-gray-700">权限列表：</span>
                      <div className="mt-2">
                        {role.permissions && role.permissions.length > 0 ? (
                          <Space wrap>
                            {role.permissions.map(permission => (
                              <Tag key={permission.id} color="green">
                                {permission.name}
                              </Tag>
                            ))}
                          </Space>
                        ) : (
                          <span className="text-gray-400">暂无权限</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                该用户暂未分配任何角色
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Button type="primary" disabled>
              编辑用户角色 (功能待实现)
            </Button>
          </div>
        </Card>
      )}

      {!userDetail && !loading && (
        <Card>
          <div className="text-center py-12 text-gray-400">
            <UserOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <p>请输入用户UUID搜索用户信息</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UserRoleManagePage; 