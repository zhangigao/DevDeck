import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Popconfirm, Modal, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface QuestionReview {
  id: string;
  title: string;
  content: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  authorId: string;
  authorName: string;
  authorEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectReason?: string;
}

const QuestionReviewPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<QuestionReview | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 模拟题目审核数据
  const mockQuestions: QuestionReview[] = [
    {
      id: '1',
      title: 'JavaScript中的闭包是什么？',
      content: '请解释JavaScript中闭包的概念和作用',
      options: [
        'A. 一种函数调用方式',
        'B. 函数内部可以访问外部变量的特性',
        'C. 一种数据类型',
        'D. 一种循环结构'
      ],
      correctAnswer: 'B',
      explanation: '闭包是指函数内部可以访问其外部作用域中变量的特性',
      category: 'JavaScript',
      difficulty: 'medium',
      authorId: 'user-1',
      authorName: '张三',
      authorEmail: 'zhangsan@example.com',
      status: 'pending',
      submittedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      title: 'React Hooks的使用规则',
      content: '以下哪个是React Hooks的正确使用规则？',
      options: [
        'A. 可以在条件语句中调用',
        'B. 只能在函数组件顶层调用',
        'C. 可以在循环中调用',
        'D. 可以在嵌套函数中调用'
      ],
      correctAnswer: 'B',
      explanation: 'React Hooks只能在函数组件的顶层调用，不能在条件语句、循环或嵌套函数中调用',
      category: 'React',
      difficulty: 'easy',
      authorId: 'user-2',
      authorName: '李四',
      authorEmail: 'lisi@example.com',
      status: 'pending',
      submittedAt: '2024-01-15T11:20:00Z',
    },
    {
      id: '3',
      title: 'CSS Flexbox布局',
      content: 'flex-direction: column的作用是什么？',
      options: [
        'A. 水平排列元素',
        'B. 垂直排列元素',
        'C. 居中对齐元素',
        'D. 等分空间'
      ],
      correctAnswer: 'B',
      explanation: 'flex-direction: column会让flex容器中的元素垂直排列',
      category: 'CSS',
      difficulty: 'easy',
      authorId: 'user-3',
      authorName: '王五',
      authorEmail: 'wangwu@example.com',
      status: 'approved',
      submittedAt: '2024-01-14T15:45:00Z',
      reviewedAt: '2024-01-14T16:00:00Z',
      reviewedBy: 'admin',
    },
  ];

  useEffect(() => {
    fetchQuestions();
  }, [pagination.current, pagination.pageSize]);

  const fetchQuestions = async () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setQuestions(mockQuestions);
      setPagination(prev => ({ ...prev, total: mockQuestions.length }));
      setLoading(false);
    }, 500);
  };

  const handleApprove = async (id: string) => {
    console.log('批准题目:', id);
    // TODO: 调用API批准题目
    setQuestions(prev => prev.map(question => 
      question.id === id 
        ? { ...question, status: 'approved' as const, reviewedAt: new Date().toISOString(), reviewedBy: 'admin' }
        : question
    ));
    message.success('题目已批准');
  };

  const handleReject = async (id: string) => {
    console.log('拒绝题目:', id);
    // TODO: 调用API拒绝题目
    setQuestions(prev => prev.map(question => 
      question.id === id 
        ? { ...question, status: 'rejected' as const, reviewedAt: new Date().toISOString(), reviewedBy: 'admin', rejectReason: '内容不符合规范' }
        : question
    ));
    message.success('题目已拒绝');
  };

  const handlePreview = (question: QuestionReview) => {
    setPreviewQuestion(question);
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'default';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '未知';
    }
  };

  const columns = [
    {
      title: '题目信息',
      key: 'questionInfo',
      render: (_, record: QuestionReview) => (
        <div>
          <div className="font-medium mb-1">{record.title}</div>
          <div className="text-gray-500 text-sm mb-2">{record.content}</div>
          <Space>
            <Tag color="blue">{record.category}</Tag>
            <Tag color={getDifficultyColor(record.difficulty)}>
              {getDifficultyText(record.difficulty)}
            </Tag>
          </Space>
        </div>
      ),
    },
    {
      title: '作者',
      key: 'author',
      render: (_, record: QuestionReview) => (
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
      render: (_, record: QuestionReview) => (
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
                title="确定要批准这个题目吗？"
                onConfirm={() => handleApprove(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary" icon={<CheckOutlined />} size="small">
                  批准
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定要拒绝这个题目吗？"
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
    <div className="question-review-page">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>题目审核</Title>
          <div className="text-gray-500">
            待审核: {questions.filter(q => q.status === 'pending').length} 个
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={questions}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个题目`,
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
        title="题目预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        {previewQuestion && (
          <div>
            <Title level={4}>{previewQuestion.title}</Title>
            <Paragraph>{previewQuestion.content}</Paragraph>
            
            <div className="mb-4">
              <Title level={5}>选项：</Title>
              {previewQuestion.options.map((option, index) => (
                <div 
                  key={index} 
                  className={`p-2 mb-2 rounded ${
                    option.startsWith(previewQuestion.correctAnswer) 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>

            {previewQuestion.explanation && (
              <div className="mb-4">
                <Title level={5}>解释：</Title>
                <Paragraph>{previewQuestion.explanation}</Paragraph>
              </div>
            )}

            <div className="flex gap-4">
              <div>
                <strong>分类：</strong>
                <Tag color="blue">{previewQuestion.category}</Tag>
              </div>
              <div>
                <strong>难度：</strong>
                <Tag color={getDifficultyColor(previewQuestion.difficulty)}>
                  {getDifficultyText(previewQuestion.difficulty)}
                </Tag>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuestionReviewPage; 