import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Avatar, Popconfirm, Modal, Image } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface AvatarReview {
  id: string;
  userId: string;
  userEmail: string;
  userNickname: string;
  avatarUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectReason?: string;
}

const AvatarReviewPage: React.FC = () => {
  const [avatars, setAvatars] = useState<AvatarReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 模拟头像审核数据
  const mockAvatars: AvatarReview[] = [
    {
      id: '1',
      userId: 'user-1',
      userEmail: 'user1@example.com',
      userNickname: '用户1',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      status: 'pending',
      submittedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      userId: 'user-2',
      userEmail: 'user2@example.com',
      userNickname: '用户2',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      status: 'pending',
      submittedAt: '2024-01-15T11:20:00Z',
    },
    {
      id: '3',
      userId: 'user-3',
      userEmail: 'user3@example.com',
      userNickname: '用户3',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
      status: 'approved',
      submittedAt: '2024-01-14T15:45:00Z',
      reviewedAt: '2024-01-14T16:00:00Z',
      reviewedBy: 'admin',
    },
  ];

  useEffect(() => {
    fetchAvatars();
  }, [pagination.current, pagination.pageSize]);

  const fetchAvatars = async () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setAvatars(mockAvatars);
      setPagination(prev => ({ ...prev, total: mockAvatars.length }));
      setLoading(false);
    }, 500);
  };

  const handleApprove = async (id: string) => {
    console.log('批准头像:', id);
    // TODO: 调用API批准头像
    setAvatars(prev => prev.map(avatar => 
      avatar.id === id 
        ? { ...avatar, status: 'approved' as const, reviewedAt: new Date().toISOString(), reviewedBy: 'admin' }
        : avatar
    ));
  };

  const handleReject = async (id: string) => {
    console.log('拒绝头像:', id);
    // TODO: 调用API拒绝头像
    setAvatars(prev => prev.map(avatar => 
      avatar.id === id 
        ? { ...avatar, status: 'rejected' as const, reviewedAt: new Date().toISOString(), reviewedBy: 'admin', rejectReason: '不符合规范' }
        : avatar
    ));
  };

  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待审核';
      case 'approved': return '已通过';
      case 'rejected': return '已拒绝';
      default: return '未知';
    }
  };

  const columns = [
    {
      title: '头像',
      key: 'avatar',
      render: (_, record: AvatarReview) => (
        <div className="flex items-center">
          <Avatar 
            src={record.avatarUrl} 
            size="large" 
            className="mr-3 cursor-pointer"
            onClick={() => handlePreview(record.avatarUrl)}
          />
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record.avatarUrl)}
          >
            预览
          </Button>
        </div>
      ),
    },
    {
      title: '用户信息',
      key: 'userInfo',
      render: (_, record: AvatarReview) => (
        <div>
          <div className="font-medium">{record.userNickname}</div>
          <div className="text-gray-500 text-sm">{record.userEmail}</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '审核时间',
      dataIndex: 'reviewedAt',
      key: 'reviewedAt',
      render: (text?: string) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '审核人',
      dataIndex: 'reviewedBy',
      key: 'reviewedBy',
      render: (text?: string) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: AvatarReview) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Popconfirm
                title="确定要批准这个头像吗？"
                onConfirm={() => handleApprove(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary" icon={<CheckOutlined />} size="small">
                  批准
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定要拒绝这个头像吗？"
                onConfirm={() => handleReject(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button danger icon={<CloseOutlined />} size="small">
                  拒绝
                </Button>
              </Popconfirm>
            </>
          )}
          {record.status !== 'pending' && (
            <span className="text-gray-400">已处理</span>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="avatar-review-page">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>头像审核</Title>
          <div className="text-gray-500">
            待审核: {avatars.filter(a => a.status === 'pending').length} 个
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={avatars}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个头像`,
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

      <Modal
        open={previewVisible}
        title="头像预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={400}
      >
        <div className="text-center">
          <Image
            src={previewImage}
            alt="头像预览"
            style={{ maxWidth: '100%', maxHeight: '400px' }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AvatarReviewPage; 