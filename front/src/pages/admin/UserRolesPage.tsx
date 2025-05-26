import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Checkbox, Typography, Tag, Space, Popconfirm, Divider, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import { 
  getRoleList, 
  getPermissionList, 
  createRole, 
  bindRolePermission, 
  deleteRole,
  getRoleDetail,
  type RoleVO,
  type PermissionVO,
  type CreateRoleRequest,
  type BindRolePermissionRequest,
  type PageResponse
} from '../../api/adminApi';

const { Title, Text, Paragraph } = Typography;
const CheckboxGroup = Checkbox.Group;

interface RoleData extends RoleVO {
  userCount?: number;
  isSystem?: boolean;
}

interface PermissionGroup {
  name: string;
  permissions: PermissionVO[];
}

interface PermissionSelectorProps {
  value?: number[];
  onChange?: (value: number[]) => void;
  permissionGroups: PermissionGroup[];
  disabled?: boolean;
}

// 权限选择器组件
const PermissionSelector: React.FC<PermissionSelectorProps> = ({ 
  value = [], 
  onChange, 
  permissionGroups, 
  disabled = false 
}) => {
  const handleGroupChange = (groupPermissions: PermissionVO[], checkedValues: number[]) => {
    // 获取当前组的权限ID
    const groupPermissionIds = groupPermissions.map(p => p.id);
    
    // 移除当前组的所有权限
    const otherPermissions = value.filter(id => !groupPermissionIds.includes(id));
    
    // 添加新选中的权限
    const newValue = [...otherPermissions, ...checkedValues];
    
    onChange?.(newValue);
  };

  return (
    <div className="border p-4 rounded-lg max-h-96 overflow-y-auto">
      {permissionGroups.map(group => {
        // 获取当前组中已选中的权限
        const groupPermissionIds = group.permissions.map(p => p.id);
        const selectedInGroup = value.filter(id => groupPermissionIds.includes(id));
        
        return (
          <div key={group.name} className="mb-4">
            <div className="font-medium mb-2">{group.name}</div>
            <CheckboxGroup
              value={selectedInGroup}
              onChange={(checkedValues) => handleGroupChange(group.permissions, checkedValues as number[])}
              options={group.permissions.map(p => ({
                label: p.name,
                value: p.id,
                disabled: disabled,
              }))}
            />
          </div>
        );
      })}
    </div>
  );
};

const UserRolesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [permissions, setPermissions] = useState<PermissionVO[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  // 加载角色列表
  const loadRoles = async (pageNo: number = 1, pageSize: number = 10) => {
    try {
      setLoading(true);
      const response = await getRoleList(pageNo, pageSize);
      console.log('角色列表响应:', response);
      
      // 响应拦截器已经处理了错误情况，这里直接使用数据
      const pageData = response.data;
      console.log('分页数据:', pageData);
      
      // 确保 pageData 和 records 存在
      if (pageData && pageData.records) {
        setRoles(pageData.records.map((role: RoleVO) => ({
          ...role,
          userCount: 0, // 后端暂未提供用户数量
          isSystem: false, // 后端暂未提供系统角色标识
        })));
        setPagination({
          current: pageData.current || 1,
          pageSize: pageData.size || 10,
          total: pageData.total || 0,
        });
      } else {
        console.error('分页数据格式错误:', pageData);
        setRoles([]);
        message.error('数据格式错误');
      }
    } catch (error) {
      console.error('加载角色列表失败:', error);
      message.error('加载角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载权限列表
  const loadPermissions = async () => {
    try {
      const response = await getPermissionList(1, 1000); // 获取所有权限
      console.log('权限列表响应:', response);
      
      const pageData = response.data;
      if (pageData && pageData.records) {
        setPermissions(pageData.records);
      } else {
        console.error('权限数据格式错误:', pageData);
        setPermissions([]);
        message.error('权限数据格式错误');
      }
    } catch (error) {
      console.error('加载权限列表失败:', error);
      message.error('加载权限列表失败');
    }
  };

  // 初始化数据
  useEffect(() => {
    console.log('角色管理页面初始化');
    loadRoles();
    loadPermissions();
  }, []);

  // 表格分页配置
  const paginationConfig: TablePaginationConfig = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (total) => `共 ${total} 个角色`,
    onChange: (page, size) => {
      loadRoles(page, size);
    },
  };

  // 打开编辑/创建角色模态框
  const showModal = async (role: RoleData | null) => {
    setEditingRole(role);
    setIsModalVisible(true);
    
    if (role) {
      try {
        // 获取角色详情，确保有最新的权限信息
        console.log('获取角色详情，ID:', role.id);
        const response = await getRoleDetail(role.id);
        const roleDetail = response.data;
        console.log('角色详情:', roleDetail);
        
        // 更新编辑中的角色信息
        const updatedRole = { ...role, permissions: roleDetail.permissions || [] };
        setEditingRole(updatedRole);
        
        form.setFieldsValue({
          name: roleDetail.name,
          description: roleDetail.description,
          permissions: roleDetail.permissions?.map((p: PermissionVO) => p.id) || [],
        });
      } catch (error) {
        console.error('获取角色详情失败:', error);
        // 如果获取详情失败，使用列表中的数据
        form.setFieldsValue({
          name: role.name,
          description: role.description,
          permissions: role.permissions?.map(p => p.id) || [],
        });
      }
    } else {
      form.resetFields();
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingRole) {
        // 编辑角色 - 更新权限绑定
        const currentPermissionIds = editingRole.permissions?.map(p => p.id) || [];
        const newPermissionIds = values.permissions || [];
        
        console.log('当前权限ID:', currentPermissionIds);
        console.log('新权限ID:', newPermissionIds);
        
        // 计算需要添加和删除的权限
        const permissionIdsToAdd = newPermissionIds.filter((id: number) => !currentPermissionIds.includes(id));
        const permissionIdsToDelete = currentPermissionIds.filter(id => !newPermissionIds.includes(id));
        
        console.log('需要添加的权限:', permissionIdsToAdd);
        console.log('需要删除的权限:', permissionIdsToDelete);
        
        // 只有当有权限变更时才发送请求
        if (permissionIdsToAdd.length > 0 || permissionIdsToDelete.length > 0) {
          const bindData: BindRolePermissionRequest = {
            roleId: editingRole.id,
            permissionIds: permissionIdsToAdd,
            permissionIdsToDelete: permissionIdsToDelete.length > 0 ? permissionIdsToDelete : undefined,
          };
          
          console.log('发送权限绑定请求:', bindData);
          const response = await bindRolePermission(bindData);
          console.log('权限绑定响应:', response);
          
          message.success('角色权限更新成功');
        } else {
          message.info('权限没有变更');
        }
        
        setIsModalVisible(false);
        loadRoles(pagination.current, pagination.pageSize);
      } else {
        // 创建新角色
        const createData: CreateRoleRequest = {
          name: values.name,
          description: values.description,
        };
        
        console.log('创建角色请求:', createData);
        const response = await createRole(createData);
        console.log('创建角色响应:', response);
        
        message.success('角色创建成功');
        
        // 如果选择了权限，需要绑定权限
        if (values.permissions && values.permissions.length > 0) {
          try {
            // 重新加载角色列表以获取新创建的角色
            await loadRoles(pagination.current, pagination.pageSize);
            
            // 查找新创建的角色（通过名称匹配，因为是刚创建的）
            const updatedResponse = await getRoleList(pagination.current, pagination.pageSize);
            const pageData = updatedResponse.data;
            const newRole = pageData.records.find((role: RoleVO) => role.name === values.name);
            
            if (newRole) {
              console.log('找到新创建的角色:', newRole);
              const bindData: BindRolePermissionRequest = {
                roleId: newRole.id,
                permissionIds: values.permissions,
              };
              
              console.log('为新角色绑定权限:', bindData);
              await bindRolePermission(bindData);
              message.success('角色创建并绑定权限成功');
              
              // 再次刷新列表以显示最新的权限信息
              await loadRoles(pagination.current, pagination.pageSize);
            } else {
              message.warning('角色创建成功，但未找到新角色进行权限绑定，请手动编辑');
            }
          } catch (error) {
            console.error('绑定权限失败:', error);
            message.warning('角色创建成功，但权限绑定失败，请手动编辑');
          }
        } else {
          // 没有选择权限，只需要刷新列表
          await loadRoles(pagination.current, pagination.pageSize);
        }
        
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error('表单提交失败:', error);
      message.error('操作失败');
    }
  };

  // 删除角色
  const handleDelete = async (id: number) => {
    try {
      const response = await deleteRole(id);
      // 响应拦截器已经处理了错误情况，成功到这里说明操作成功
      message.success('角色删除成功');
      loadRoles(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('删除角色失败:', error);
      message.error('删除角色失败，该接口可能尚未实现');
    }
  };

  // 根据权限代码分组权限
  const groupPermissionsByCode = (permissions: PermissionVO[]) => {
    const groups: { [key: string]: PermissionVO[] } = {};
    
    permissions.forEach(permission => {
      // 确保 permission 和 permission.code 存在
      if (!permission || !permission.code) {
        console.warn('权限数据不完整:', permission);
        return;
      }
      
      const prefix = permission.code.split(':')[0] || 'other';
      if (!groups[prefix]) {
        groups[prefix] = [];
      }
      groups[prefix].push(permission);
    });
    
    return Object.entries(groups).map(([key, perms]) => ({
      name: getGroupName(key),
      permissions: perms,
    }));
  };

  // 获取权限组名称
  const getGroupName = (prefix: string) => {
    const nameMap: { [key: string]: string } = {
      user: '用户管理',
      role: '角色权限',
      question: '题目管理',
      post: '社区管理',
      system: '系统设置',
      other: '其他权限',
    };
    return nameMap[prefix] || prefix;
  };

  const permissionGroups = groupPermissionsByCode(permissions);

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
      render: (count: number = 0) => (
        <Tag color="green">{count}</Tag>
      ),
    },
    {
      title: '权限数',
      key: 'permissionCount',
      width: 100,
      render: (_: any, record: RoleData) => (
        <Tag color="purple">{record.permissions?.length || 0}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string | Date) => {
        if (!date) return '-';
        try {
          const dateObj = typeof date === 'string' ? new Date(date) : date;
          return dateObj.toLocaleString();
        } catch (error) {
          console.error('日期格式错误:', date, error);
          return '-';
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: RoleData) => (
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
                      record.permissions?.some(rp => rp.id === p.id)
                    );
                    
                    if (groupPermissions.length === 0) return null;
                    
                    return (
                      <div key={group.name} className="mb-3">
                        <div className="text-gray-600 mb-1">{group.name}：</div>
                        <div>
                          {groupPermissions.map(p => (
                            <Tag key={p.id} className="mb-1 mr-1">{p.name}</Tag>
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
          >
            <PermissionSelector 
              permissionGroups={permissionGroups}
              disabled={editingRole?.id === 1 && editingRole?.isSystem}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserRolesPage; 