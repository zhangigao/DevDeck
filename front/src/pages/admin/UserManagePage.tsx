import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Typography, Tag, Space, message, Avatar, Select } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import { 
  getUserList, 
  getUserDetail,
  getRoleList,
  updateUserRoles,
  type UserListParams,
  type UserListItem,
  type UserDetail,
  type RoleVO,
  type UpdateUserRolesRequest,
  type PageResponse
} from '../../api/adminApi';

const { Title, Text } = Typography;
const { Option } = Select;

interface UserData extends UserListItem {
  createdAt?: string;
  updatedAt?: string;
}

const UserManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDetail | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<RoleVO[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  // 加载用户列表
  const loadUsers = async (pageNo: number = 1, pageSize: number = 10) => {
    try {
      setLoading(true);
      const params: UserListParams = {
        pageNo,
        pageSize,
      };
      const response = await getUserList(params);
      console.log('用户列表响应:', response);
      
      const pageData = response.data;
      if (pageData && pageData.records) {
        setUsers(pageData.records);
        setPagination({
          current: pageData.current || 1,
          pageSize: pageData.size || 10,
          total: pageData.total || 0,
        });
      } else {
        console.error('用户数据格式错误:', pageData);
        setUsers([]);
        message.error('用户数据格式错误');
      }
    } catch (error) {
      console.error('加载用户列表失败:', error);
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载角色列表
  const loadRoles = async () => {
    try {
      const response = await getRoleList(1, 1000); // 获取所有角色
      console.log('角色列表响应:', response);
      
      const pageData = response.data;
      if (pageData && pageData.records) {
        setRoles(pageData.records);
      } else {
        console.error('角色数据格式错误:', pageData);
        setRoles([]);
        message.error('角色数据格式错误');
      }
    } catch (error) {
      console.error('加载角色列表失败:', error);
      message.error('加载角色列表失败');
    }
  };

  // 初始化数据
  useEffect(() => {
    console.log('用户管理页面初始化');
    loadUsers();
    loadRoles();
  }, []);

  // 表格分页配置
  const paginationConfig: TablePaginationConfig = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (total) => `共 ${total} 个用户`,
    onChange: (page, size) => {
      loadUsers(page, size);
    },
  };

  // 打开编辑用户角色模态框
  const showModal = async (user: UserData) => {
    try {
      console.log('获取用户详情，UUID:', user.uuid);
      const response = await getUserDetail(user.uuid);
      const userDetail = response.data;
      console.log('用户详情:', userDetail);
      
      setEditingUser(userDetail);
      setIsModalVisible(true);
      
      form.setFieldsValue({
        userUuid: userDetail.uuid,
        roleIds: userDetail.roles?.map((role: RoleVO) => role.id) || [],
      });
    } catch (error) {
      console.error('获取用户详情失败:', error);
      message.error('获取用户详情失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!editingUser) return;
      
      // 计算角色变更
      const currentRoleIds = editingUser.roles?.map(role => role.id) || [];
      const newRoleIds = values.roleIds || [];
      
      console.log('当前角色ID:', currentRoleIds);
      console.log('新角色ID:', newRoleIds);
      
      // 计算需要添加和删除的角色
      const roleIdsToAdd = newRoleIds.filter((id: number) => !currentRoleIds.includes(id));
      const roleIdsToDelete = currentRoleIds.filter(id => !newRoleIds.includes(id));
      
      console.log('需要添加的角色:', roleIdsToAdd);
      console.log('需要删除的角色:', roleIdsToDelete);
      
      // 只有当有角色变更时才发送请求
      if (roleIdsToAdd.length > 0 || roleIdsToDelete.length > 0) {
        const updateData: UpdateUserRolesRequest = {
          userUuid: editingUser.uuid,
          roleIds: roleIdsToAdd,
          roleIdsToDelete: roleIdsToDelete.length > 0 ? roleIdsToDelete : undefined,
        };
        
        console.log('发送用户角色更新请求:', updateData);
        const response = await updateUserRoles(updateData);
        console.log('用户角色更新响应:', response);
        
        message.success('用户角色更新成功');
      } else {
        message.info('角色没有变更');
      }
      
      setIsModalVisible(false);
      loadUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('表单提交失败:', error);
      message.error('操作失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '用户',
      key: 'user',
      render: (_: any, record: UserData) => (
        <div className="flex items-center">
          <Avatar 
            src={record.avatarUrl} 
            icon={<UserOutlined />} 
            className="mr-3"
          />
          <div>
            <div className="font-medium">{record.nickName}</div>
            <div className="text-gray-500 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
      key: 'uuid',
      width: 200,
      ellipsis: true,
    },
    {
      title: '当前角色',
      key: 'role',
      render: (_: any, record: UserData) => (
        record.role ? (
          <Tag color="blue">{record.role.name}</Tag>
        ) : (
          <Tag color="gray">无角色</Tag>
        )
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: UserData) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            编辑角色
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-management-page">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={4}>用户管理</Title>
          <Text type="secondary">管理用户角色分配</Text>
        </div>
      </div>

      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="uuid"
          pagination={paginationConfig}
          loading={loading}
        />
      </Card>

      {/* 编辑用户角色模态框 */}
      <Modal
        title="编辑用户角色"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        {editingUser && (
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <Avatar 
                src={editingUser.avatarUrl} 
                icon={<UserOutlined />} 
                size={48}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-lg">{editingUser.nickName}</div>
                <div className="text-gray-500">{editingUser.email}</div>
              </div>
            </div>
          </div>
        )}
        
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item name="userUuid" hidden>
            <input type="hidden" />
          </Form.Item>

          <Form.Item
            name="roleIds"
            label="用户角色"
            rules={[{ required: true, message: '请至少选择一个角色' }]}
          >
            <Select
              mode="multiple"
              placeholder="选择用户角色"
              style={{ width: '100%' }}
            >
              {roles.map(role => (
                <Option key={role.id} value={role.id}>
                  {role.name} - {role.description}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagePage; 