import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Space, Typography, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { 
  Permission, 
  CreatePermissionRequest, 
  PageResponse,
  createPermission, 
  getPermissionList 
} from '@/api/adminApi';

const { Title } = Typography;
const { TextArea } = Input;

const PermissionManagePage: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取权限列表
  const fetchPermissions = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await getPermissionList(page, size);
      if (response.code === 200) {
        const data: PageResponse<Permission> = response.data;
        setPermissions(data.records);
        setPagination({
          current: data.current,
          pageSize: data.size,
          total: data.total,
        });
      }
    } catch (error) {
      console.error('获取权限列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // 处理表格分页
  const handleTableChange = (pagination: any) => {
    fetchPermissions(pagination.current, pagination.pageSize);
  };

  // 打开创建/编辑模态框
  const openModal = (permission?: Permission) => {
    setEditingPermission(permission || null);
    setModalVisible(true);
    if (permission) {
      form.setFieldsValue(permission);
    } else {
      form.resetFields();
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setModalVisible(false);
    setEditingPermission(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async (values: CreatePermissionRequest) => {
    try {
      if (editingPermission) {
        // TODO: 实现编辑权限功能
        message.info('编辑功能待实现');
      } else {
        const response = await createPermission(values);
        if (response.code === 200) {
          message.success('权限创建成功');
          closeModal();
          fetchPermissions(pagination.current, pagination.pageSize);
        }
      }
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  // 删除权限
  const handleDelete = async (id: number) => {
    try {
      // TODO: 实现删除权限功能
      message.info('删除功能待实现');
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: Permission) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个权限吗？"
            onConfirm={() => handleDelete(record.id)}
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
    <div className="permission-manage-page">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>权限管理</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            新建权限
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingPermission ? '编辑权限' : '新建权限'}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="权限名称"
            rules={[{ required: true, message: '请输入权限名称' }]}
          >
            <Input placeholder="请输入权限名称" />
          </Form.Item>

          <Form.Item
            name="code"
            label="权限代码"
            rules={[
              { required: true, message: '请输入权限代码' },
              { pattern: /^[A-Z_]+$/, message: '权限代码只能包含大写字母和下划线' }
            ]}
          >
            <Input placeholder="例如：USER_CREATE" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入权限描述' }]}
          >
            <TextArea rows={4} placeholder="请输入权限描述" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPermission ? '更新' : '创建'}
              </Button>
              <Button onClick={closeModal}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionManagePage; 