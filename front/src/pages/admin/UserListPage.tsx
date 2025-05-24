import React, { useState } from 'react';
import { Table, Card, Button, Input, Space, Tag, Modal, Form, Select, Typography, Avatar, Tooltip, Dropdown, Menu, DatePicker } from 'antd';
import { SearchOutlined, UserOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, MoreOutlined, PlusOutlined, ExportOutlined, ImportOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface UserData {
  key: string;
  id: number;
  username: string;
  nickname: string;
  email: string;
  role: string[];
  status: string;
  lastLogin: string;
  createTime: string;
  avatarUrl?: string;
}

const UserListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [form] = Form.useForm();

  // 模拟用户数据
  const userData: UserData[] = [
    {
      key: '1',
      id: 1,
      username: 'user001',
      nickname: '张三',
      email: 'zhangsan@example.com',
      role: ['user'],
      status: 'active',
      lastLogin: '2023-11-25 14:23:45',
      createTime: '2023-10-01 10:00:00',
      avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      key: '2',
      id: 2,
      username: 'user002',
      nickname: '李四',
      email: 'lisi@example.com',
      role: ['user', 'editor'],
      status: 'active',
      lastLogin: '2023-11-24 09:12:34',
      createTime: '2023-10-02 11:00:00',
      avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      key: '3',
      id: 3,
      username: 'admin001',
      nickname: '王五',
      email: 'wangwu@example.com',
      role: ['admin'],
      status: 'active',
      lastLogin: '2023-11-25 08:45:12',
      createTime: '2023-09-15 09:30:00',
      avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      key: '4',
      id: 4,
      username: 'user003',
      nickname: '赵六',
      email: 'zhaoliu@example.com',
      role: ['user'],
      status: 'inactive',
      lastLogin: '2023-11-10 15:34:21',
      createTime: '2023-10-05 14:20:00',
      avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      key: '5',
      id: 5,
      username: 'editor001',
      nickname: '钱七',
      email: 'qianqi@example.com',
      role: ['editor'],
      status: 'active',
      lastLogin: '2023-11-22 10:12:45',
      createTime: '2023-10-10 16:45:00',
      avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      key: '6',
      id: 6,
      username: 'user004',
      nickname: '孙八',
      email: 'sunba@example.com',
      role: ['user'],
      status: 'locked',
      lastLogin: '2023-11-01 09:23:11',
      createTime: '2023-10-15 13:10:00',
      avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
  ];

  // 表格分页配置
  const paginationConfig: TablePaginationConfig = {
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total) => `共 ${total} 条记录`,
  };

  // 显示编辑用户模态框
  const showEditModal = (user: UserData | null) => {
    setEditingUser(user);
    setIsModalVisible(true);
    
    if (user) {
      form.setFieldsValue({
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      form.resetFields();
    }
  };

  // 处理表单提交
  const handleFormSubmit = () => {
    form.validateFields().then(values => {
      console.log('提交的表单数据:', values);
      // TODO: 发送API请求保存用户数据
      
      setIsModalVisible(false);
      // 成功提示和刷新数据
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 删除用户
  const confirmDelete = (userId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？此操作不可逆。',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        console.log('删除用户ID:', userId);
        // TODO: 发送API请求删除用户
      },
    });
  };

  // 锁定/解锁用户
  const toggleUserStatus = (user: UserData) => {
    const newStatus = user.status === 'locked' ? 'active' : 'locked';
    const actionText = newStatus === 'locked' ? '锁定' : '解锁';
    
    Modal.confirm({
      title: `确认${actionText}用户`,
      content: `确定要${actionText}用户 "${user.nickname}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        console.log(`${actionText}用户:`, user.id, newStatus);
        // TODO: 发送API请求更改用户状态
      },
    });
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户信息',
      dataIndex: 'username',
      key: 'username',
      render: (_: any, record: UserData) => (
        <div className="flex items-center">
          <Avatar 
            src={record.avatarUrl} 
            icon={<UserOutlined />} 
            className="mr-3"
          />
          <div>
            <div className="font-medium">{record.nickname}</div>
            <div className="text-xs text-gray-500">@{record.username}</div>
          </div>
        </div>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (roles: string[]) => (
        <>
          {roles.map(role => {
            let color = role === 'admin' ? 'red' : role === 'editor' ? 'green' : 'blue';
            let text = role === 'admin' ? '管理员' : role === 'editor' ? '编辑者' : '普通用户';
            return (
              <Tag color={color} key={role} className="mr-1">
                {text}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          active: { color: 'success', text: '正常' },
          inactive: { color: 'default', text: '未激活' },
          locked: { color: 'error', text: '已锁定' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: UserData) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: '编辑用户',
                icon: <EditOutlined />,
                onClick: () => showEditModal(record),
              },
              {
                key: 'status',
                label: record.status === 'locked' ? '解锁用户' : '锁定用户',
                icon: record.status === 'locked' ? <UnlockOutlined /> : <LockOutlined />,
                onClick: () => toggleUserStatus(record),
              },
              { type: 'divider' },
              {
                key: 'delete',
                label: '删除用户',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => confirmDelete(record.id),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // 搜索框筛选数据
  const filteredUsers = userData.filter(user => 
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.nickname.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="user-list-page">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={4}>用户管理</Title>
          <Text type="secondary">管理系统中的所有用户账户</Text>
        </div>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showEditModal(null)}
        >
          新建用户
        </Button>
      </div>

      <Card bordered={false} className="mb-4">
        <div className="flex flex-wrap gap-4">
          <Input.Search
            placeholder="搜索用户名/昵称/邮箱"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          
          <Select 
            placeholder="角色筛选" 
            style={{ width: 150 }}
            allowClear
          >
            <Option value="admin">管理员</Option>
            <Option value="editor">编辑者</Option>
            <Option value="user">普通用户</Option>
          </Select>
          
          <Select 
            placeholder="状态筛选" 
            style={{ width: 150 }}
            allowClear
          >
            <Option value="active">正常</Option>
            <Option value="inactive">未激活</Option>
            <Option value="locked">已锁定</Option>
          </Select>
          
          <RangePicker 
            placeholder={['注册开始日期', '注册结束日期']}
            style={{ width: 300 }}
          />
          
          <Button icon={<FilterOutlined />}>筛选</Button>
          <Button icon={<ReloadOutlined />}>重置</Button>
        </div>
      </Card>

      <Card bordered={false}>
        <div className="flex justify-end mb-4">
          <Space>
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button icon={<ImportOutlined />}>导入</Button>
          </Space>
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredUsers}
          pagination={paginationConfig}
          rowKey="id"
          loading={loading}
        />
      </Card>

      {/* 编辑/新建用户模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={isModalVisible}
        onOk={handleFormSubmit}
        onCancel={handleCancel}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择角色"
              allowClear
            >
              <Option value="admin">管理员</Option>
              <Option value="editor">编辑者</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">正常</Option>
              <Option value="inactive">未激活</Option>
              <Option value="locked">已锁定</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserListPage; 