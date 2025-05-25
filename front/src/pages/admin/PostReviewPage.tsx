import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Popconfirm, Modal, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface PostReview {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectReason?: string;
  viewCount: number;
  likeCount: number;
}

const PostReviewPage: React.FC = () => {
  const [posts, setPosts] = useState<PostReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewPost, setPreviewPost] = useState<PostReview | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 模拟文章审核数据
  const mockPosts: PostReview[] = [
    {
      id: '1',
      title: 'React 18新特性详解',
      content: `# React 18新特性详解

React 18带来了许多令人兴奋的新特性，包括：

## 1. 并发渲染
React 18引入了并发渲染，这是一个重大的架构改进...

## 2. Automatic Batching
自动批处理功能可以提高应用性能...

## 3. Suspense改进
Suspense组件得到了显著改进...`,
      excerpt: 'React 18带来了许多令人兴奋的新特性，包括并发渲染、自动批处理等...',
      category: '前端技术',
      tags: ['React', 'JavaScript', '前端'],
      authorId: 'user-1',
      authorName: '张三',
      authorEmail: 'zhangsan@example.com',
      status: 'pending',
      submittedAt: '2024-01-15T10:30:00Z',
      viewCount: 0,
      likeCount: 0,
    },
    {
      id: '2',
      title: 'Vue 3 Composition API最佳实践',
      content: `# Vue 3 Composition API最佳实践

Vue 3的Composition API为我们提供了更灵活的组件逻辑组织方式...

## 基本用法
\`\`\`javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    
    return {
      count,
      doubleCount
    }
  }
}
\`\`\``,
      excerpt: 'Vue 3的Composition API为我们提供了更灵活的组件逻辑组织方式...',
      category: '前端技术',
      tags: ['Vue', 'JavaScript', '前端'],
      authorId: 'user-2',
      authorName: '李四',
      authorEmail: 'lisi@example.com',
      status: 'pending',
      submittedAt: '2024-01-15T11:20:00Z',
      viewCount: 0,
      likeCount: 0,
    },
    {
      id: '3',
      title: 'TypeScript高级类型技巧',
      content: `# TypeScript高级类型技巧

TypeScript提供了强大的类型系统，掌握这些高级技巧可以让你的代码更加健壮...

## 1. 条件类型
条件类型允许我们根据条件选择类型...

## 2. 映射类型
映射类型可以基于现有类型创建新类型...`,
      excerpt: 'TypeScript提供了强大的类型系统，掌握这些高级技巧可以让你的代码更加健壮...',
      category: '编程语言',
      tags: ['TypeScript', 'JavaScript', '类型系统'],
      authorId: 'user-3',
      authorName: '王五',
      authorEmail: 'wangwu@example.com',
      status: 'approved',
      submittedAt: '2024-01-14T15:45:00Z',
      reviewedAt: '2024-01-14T16:00:00Z',
      reviewedBy: 'admin',
      viewCount: 156,
      likeCount: 23,
    },
  ];

  useEffect(() => {
    fetchPosts();
  }, [pagination.current, pagination.pageSize]);

  const fetchPosts = async () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setPosts(mockPosts);
      setPagination(prev => ({ ...prev, total: mockPosts.length }));
      setLoading(false);
    }, 500);
  };

  const handleApprove = async (id: string) => {
    console.log('批准文章:', id);
    // TODO: 调用API批准文章
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, status: 'approved' as const, reviewedAt: new Date().toISOString(), reviewedBy: 'admin' }
        : post
    ));
    message.success('文章已批准');
  };

  const handleReject = async (id: string) => {
    console.log('拒绝文章:', id);
    // TODO: 调用API拒绝文章
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, status: 'rejected' as const, reviewedAt: new Date().toISOString(), reviewedBy: 'admin', rejectReason: '内容不符合规范' }
        : post
    ));
    message.success('文章已拒绝');
  };

  const handlePreview = (post: PostReview) => {
    setPreviewPost(post);
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
      title: '文章信息',
      key: 'postInfo',
      render: (_, record: PostReview) => (
        <div>
          <div className="font-medium mb-1">{record.title}</div>
          <div className="text-gray-500 text-sm mb-2">{record.excerpt}</div>
          <Space>
            <Tag color="blue">{record.category}</Tag>
            {record.tags.map(tag => (
              <Tag key={tag} color="geekblue">{tag}</Tag>
            ))}
          </Space>
        </div>
      ),
    },
    {
      title: '作者',
      key: 'author',
      render: (_, record: PostReview) => (
        <div>
          <div className="font-medium">{record.authorName}</div>
          <div className="text-gray-500 text-sm">{record.authorEmail}</div>
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
      title: '统计',
      key: 'stats',
      render: (_, record: PostReview) => (
        <div className="text-sm">
          <div>浏览: {record.viewCount}</div>
          <div>点赞: {record.likeCount}</div>
        </div>
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
      title: '操作',
      key: 'action',
      render: (_, record: PostReview) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            预览
          </Button>
          {record.status === 'pending' && (
            <>
              <Popconfirm
                title="确定要批准这篇文章吗？"
                onConfirm={() => handleApprove(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary" icon={<CheckOutlined />} size="small">
                  批准
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定要拒绝这篇文章吗？"
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
    <div className="post-review-page">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>文章审核</Title>
          <div className="text-gray-500">
            待审核: {posts.filter(p => p.status === 'pending').length} 篇
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={posts}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 篇文章`,
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
        title="文章预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={900}
      >
        {previewPost && (
          <div>
            <Title level={4}>{previewPost.title}</Title>
            
            <div className="mb-4">
              <Space>
                <Tag color="blue">{previewPost.category}</Tag>
                {previewPost.tags.map(tag => (
                  <Tag key={tag} color="geekblue">{tag}</Tag>
                ))}
              </Space>
            </div>

            <div className="mb-4">
              <strong>作者：</strong>{previewPost.authorName} ({previewPost.authorEmail})
            </div>

            <div className="mb-4">
              <strong>摘要：</strong>
              <Paragraph>{previewPost.excerpt}</Paragraph>
            </div>

            <div className="mb-4">
              <strong>内容：</strong>
              <div className="bg-gray-50 p-4 rounded mt-2 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">{previewPost.content}</pre>
              </div>
            </div>

            <div className="flex gap-4 text-sm text-gray-500">
              <div>浏览量: {previewPost.viewCount}</div>
              <div>点赞数: {previewPost.likeCount}</div>
              <div>提交时间: {new Date(previewPost.submittedAt).toLocaleString()}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PostReviewPage; 