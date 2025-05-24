import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Checkbox, Typography, Tag, Space, Popconfirm, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { CheckboxGroup } = Checkbox;

interface RoleData {
  id: number;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
}

const UserRolesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [form] = Form.useForm();

  // 权限分组数据
  const permissionGroups = [
    {
      name: '用户管理',
      permissions: [
        { id: 'user:view', label: '查看用户' },
        { id: 'user:create', label: '创建用户' },
        { id: 'user:edit', label: '编辑用户' },
        { id: 'user:delete', label: '删除用户' },
      ],
    },
    {
      name: '角色权限',
      permissions: [
        { id: 'role:view', label: '查看角色' },
        { id: 'role:create', label: '创建角色' },
        { id: 'role:edit', label: '编辑角色' },
        { id: 'role:delete', label: '删除角色' },
        { id: 'permission:assign', label: '分配权限' },
      ],
    },
    {
      name: '题目管理',
      permissions: [
        { id: 'question:view', label: '查看题目' },
        { id: 'question:create', label: '创建题目' },
        { id: 'question:edit', label: '编辑题目' },
        { id: 'question:delete', label: '删除题目' },
        { id: 'question:review', label: '审核题目' },
      ],
    },
    {
      name: '社区管理',
      permissions: [
        { id: 'post:view', label: '查看帖子' },
        { id: 'post:create', label: '创建帖子' },
        { id: 'post:edit', label: '编辑帖子' },
        { id: 'post:delete', label: '删除帖子' },
        { id: 'comment:manage', label: '管理评论' },
        { id: 'comment:review', label: '审核评论' },
      ],
    },
    {
      name: '系统设置',
      permissions: [
        { id: 'system:view', label: '查看设置' },
        { id: 'system:edit', label: '修改设置' },
        { id: 'system:log', label: '查看日志' },
        { id: 'system:backup', label: '系统备份' },
      ],
    },
  ];

  // 角色数据
  const roles: RoleData[] = [
    {
      id: 1,
      name: '超级管理员',
      description: '系统最高权限，可以管理所有功能',
      userCount: 2,
      permissions: ['user:view', 'user:create', 'user:edit', 'user:delete', 'role:view', 'role:create', 'role:edit', 'role:delete', 'permission:assign', 'question:view', 'question:create', 'question:edit', 'question:delete', 'question:review', 'post:view', 'post:create', 'post:edit', 'post:delete', 'comment:manage', 'comment:review', 'system:view', 'system:edit', 'system:log', 'system:backup'],
      isSystem: true,
      createdAt: '2023-09-01 10:00:00',
    },
    {
      id: 2,
      name: '管理员',
      description: '系统管理员，拥有大部分管理权限',
      userCount: 5,
      permissions: ['user:view', 'user:create', 'user:edit', 'role:view', 'question:view', 'question:create', 'question:edit', 'question:review', 'post:view', 'post:create', 'post:edit', 'comment:manage', 'comment:review', 'system:view', 'system:log'],
      isSystem: true,
      createdAt: '2023-09-01 10:05:00',
    },
    {
      id: 3,
      name: '内容编辑',
      description: '负责内容编辑和审核',
      userCount: 8,
      permissions: ['question:view', 'question:create', 'question:edit', 'question:review', 'post:view', 'post:edit', 'comment:manage', 'comment:review'],
      isSystem: true,
      createdAt: '2023-09-01 10:10:00',
    },
    {
      id: 4,
      name: '题目管理员',
      description: '专职题目管理',
      userCount: 4,
      permissions: ['question:view', 'question:create', 'question:edit', 'question:delete', 'question:review'],
      isSystem: false,
      createdAt: '2023-10-15 14:30:00',
    },
    {
      id: 5,
      name: '社区版主',
      description: '负责社区内容管理',
      userCount: 6,
      permissions: ['post:view', 'post:edit', 'post:delete', 'comment:manage', 'comment:review'],
      isSystem: false,
      createdAt: '2023-10-20 09:15:00',
    },
  ];

  // 表格分页配置
  const paginationConfig: TablePaginationConfig = {
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (total) => `共 ${total} 个角色`,
  };

  // 打开编辑/创建角色模态框
  const showModal = (role: RoleData | null) => {
    setEditingRole(role);
    setIsModalVisible(true);
    
    if (role) {
      form.setFieldsValue({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
    } else {
      form.resetFields();
    }
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log('提交的角色数据:', values);
      // TODO: 发送API请求保存角色数据
      
      setIsModalVisible(false);
      // 成功提示和刷新数据
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  // 删除角色
  const handleDelete = (id: number) => {
    console.log('删除角色:', id);
    // TODO: 发送API请求删除角色
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
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: RoleData) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.isSystem && <Tag color="blue">系统角色</Tag>}
        </div>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 100,
      render: (count: number) => (
        <Tag color="green">{count}</Tag>
      ),
    },
    {
      title: '权限数',
      key: 'permissionCount',
      width: 100,
      render: (_, record: RoleData) => (
        <Tag color="purple">{record.permissions.length}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record: RoleData) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            disabled={record.isSystem && record.id === 1} // 禁止编辑超级管理员
          >
            编辑
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除该角色吗？"
            description="删除后将无法恢复，已分配该角色的用户将失去相应权限。"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
            disabled={record.isSystem} // 禁止删除系统角色
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
              disabled={record.isSystem} // 禁止删除系统角色
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="role-management-page">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={4}>角色管理</Title>
          <Text type="secondary">管理系统角色及其权限</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal(null)}
        >
          新建角色
        </Button>
      </div>

      <Card bordered={false}>
        <Paragraph className="mb-4">
          <ExclamationCircleOutlined className="text-warning mr-2" />
          系统预设角色不可删除，超级管理员角色权限不可修改。
        </Paragraph>
        
        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          pagination={paginationConfig}
          loading={loading}
          expandable={{
            expandedRowRender: (record) => (
              <div className="p-4">
                <div className="font-medium mb-2">权限列表：</div>
                <div>
                  {permissionGroups.map(group => {
                    const groupPermissions = group.permissions.filter(p => 
                      record.permissions.includes(p.id)
                    );
                    
                    if (groupPermissions.length === 0) return null;
                    
                    return (
                      <div key={group.name} className="mb-3">
                        <div className="text-gray-600 mb-1">{group.name}：</div>
                        <div>
                          {groupPermissions.map(p => (
                            <Tag key={p.id} className="mb-1 mr-1">{p.label}</Tag>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          }}
        />
      </Card>

      {/* 编辑/创建角色模态框 */}
      <Modal
        title={editingRole ? '编辑角色' : '新建角色'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input 
              placeholder="请输入角色名称" 
              disabled={editingRole?.isSystem} // 系统角色名称不可修改
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea 
              placeholder="请输入角色描述" 
              rows={2} 
            />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="权限设置"
            rules={[{ required: true, message: '请至少选择一项权限' }]}
          >
            <div className="border p-4 rounded-lg max-h-96 overflow-y-auto">
              {permissionGroups.map(group => (
                <div key={group.name} className="mb-4">
                  <div className="font-medium mb-2">{group.name}</div>
                  <CheckboxGroup
                    options={group.permissions.map(p => ({
                      label: p.label,
                      value: p.id,
                      disabled: editingRole?.id === 1 && editingRole?.isSystem, // 超级管理员角色权限不可修改
                    }))}
                  />
                </div>
              ))}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserRolesPage; 