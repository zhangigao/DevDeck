import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Space, Typography, Tag, Avatar, Popconfirm, Modal, message } from 'antd';
import { SearchOutlined, UserOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getUserList, getUserDetail, UserListItem, UserDetail, PageResponse } from '@/api/adminApi';

const { Title, Paragraph } = Typography;

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchNickName, setSearchNickName] = useState('');
  const [userDetailVisible, setUserDetailVisible] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, searchEmail, searchNickName]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      };
      
      // 只有当搜索条件不为空时才添加到参数中
      if (searchEmail && searchEmail.trim()) {
        params.email = searchEmail.trim();
      }
      if (searchNickName && searchNickName.trim()) {
        params.nickName = searchNickName.trim();
      }
      
      const response = await getUserList(params);

      if (response.code === 200) {
        const pageData: PageResponse<UserListItem> = response.data;
        setUsers(pageData.records);
        setPagination(prev => ({
          ...prev,
          total: pageData.total,
        }));
      } else {
        message.error(response.message || '获取用户列表失败');
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchUsers();
  };

  const handleReset = () => {
    setSearchEmail('');
    setSearchNickName('');
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleViewDetail = async (uuid: string) => {
    setDetailLoading(true);
    setUserDetailVisible(true);
    try {
      const response = await getUserDetail(uuid);
      if (response.code === 200) {
        setSelectedUserDetail(response.data);
      } else {
        message.error(response.message || '获取用户详情失败');
      }
    } catch (error) {
      console.error('获取用户详情失败:', error);
      message.error('获取用户详情失败');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = (uuid: string) => {
    console.log('删除用户:', uuid);
    // TODO: 调用API删除用户
  };

  const columns = [
    {
      title: '用户信息',
      key: 'userInfo',
      render: (_, record: UserListItem) => (
        <div className="flex items-center">
          <Avatar 
            src={record.avatarUrl} 
            icon={<UserOutlined />} 
            size="large" 
            className="mr-3"
          />
          <div>
            <div className="font-medium">{record.nickName}</div>
            <div className="text-gray-500 text-sm">{record.email}</div>
            <div className="text-gray-400 text-xs">UUID: {record.uuid}</div>
          </div>
        </div>
      ),
    },
    {
      title: '角色',
      key: 'role',
      render: (_, record: UserListItem) => (
        <div>
          {record.role && (
            <Tag color="blue">{record.role.name}</Tag>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: UserListItem) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.uuid)}
          >
            查看详情
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.uuid)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-list-page">
      <Card>
        <div className="mb-4">
          <Title level={3}>用户列表</Title>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">邮箱</label>
              <Input
                placeholder="搜索邮箱"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                style={{ width: 200 }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">昵称</label>
              <Input
                placeholder="搜索昵称"
                value={searchNickName}
                onChange={(e) => setSearchNickName(e.target.value)}
                style={{ width: 200 }}
              />
            </div>
            <div>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  搜索
                </Button>
                <Button onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="uuid"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个用户`,
          }}
          onChange={(paginationConfig) => {
            setPagination({
              current: paginationConfig.current || 1,
              pageSize: paginationConfig.pageSize || 10,
              total: pagination.total,
            });
          }}
        />
      </Card>

      {/* 用户详情模态框 */}
      <Modal
        open={userDetailVisible}
        title="用户详情"
        footer={null}
        onCancel={() => {
          setUserDetailVisible(false);
          setSelectedUserDetail(null);
        }}
        width={800}
        loading={detailLoading}
      >
        {selectedUserDetail && (
          <div>
            <div className="flex items-center mb-6">
              <Avatar 
                src={selectedUserDetail.avatarUrl} 
                icon={<UserOutlined />} 
                size={64} 
                className="mr-4"
              />
              <div>
                <Title level={4}>{selectedUserDetail.nickName}</Title>
                <Paragraph className="text-gray-500">{selectedUserDetail.email}</Paragraph>
                <Paragraph className="text-gray-400 text-sm">UUID: {selectedUserDetail.uuid}</Paragraph>
              </div>
            </div>

            <div className="mb-4">
              <Title level={5}>角色信息</Title>
              <div className="flex flex-wrap gap-2">
                {selectedUserDetail.roles.map(role => (
                  <Tag key={role.id} color="blue" className="mb-2">
                    {role.name}
                  </Tag>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <Title level={5}>权限信息</Title>
              <div className="max-h-40 overflow-y-auto">
                {selectedUserDetail.roles.map(role => (
                  <div key={role.id} className="mb-3">
                    <div className="font-medium text-sm text-gray-600 mb-1">
                      {role.name} 的权限：
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map(permission => (
                        <Tag key={permission.id} color="geekblue" size="small">
                          {permission.name}
                        </Tag>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-8 text-sm text-gray-500">
              <div>
                <strong>创建时间：</strong>
                {new Date(selectedUserDetail.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>更新时间：</strong>
                {new Date(selectedUserDetail.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserListPage; 