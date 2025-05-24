import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Typography, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { QuestionType } from '@/store/slices/questionsSlice';

const { Title, Text } = Typography;

// 模拟数据
const mockQuestions = [
  {
    id: 1,
    title: 'JavaScript中的原型链是什么?',
    type: QuestionType.TextAnswer,
    difficulty: 2,
    createdAt: '2023-10-15',
    status: 'published',
    tags: ['JavaScript', '原型', '继承'],
  },
  {
    id: 2,
    title: 'React中的虚拟DOM是什么?',
    type: QuestionType.SingleChoice,
    difficulty: 2,
    createdAt: '2023-10-12',
    status: 'published',
    tags: ['React', '虚拟DOM', '前端框架'],
  },
  {
    id: 3,
    title: 'HTTP请求方法',
    type: QuestionType.MultipleChoice,
    difficulty: 1,
    createdAt: '2023-10-10',
    status: 'published',
    tags: ['HTTP', 'API', '网络协议'],
  },
];

const MyQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setQuestions(mockQuestions);
      setLoading(false);
    }, 1000);
  }, []);

  // 删除题目
  const handleDelete = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
    message.success('题目已删除');
  };

  // 渲染题目类型
  const renderQuestionType = (type: QuestionType) => {
    switch (type) {
      case QuestionType.SingleChoice:
        return <Tag color="blue">单选题</Tag>;
      case QuestionType.MultipleChoice:
        return <Tag color="purple">多选题</Tag>;
      case QuestionType.TextAnswer:
        return <Tag color="green">问答题</Tag>;
      default:
        return <Tag>未知类型</Tag>;
    }
  };

  // 渲染题目难度
  const renderDifficulty = (difficulty: number) => {
    const colors = ['green', 'orange', 'red'];
    const labels = ['简单', '中等', '困难'];
    return <Tag color={colors[difficulty - 1]}>{labels[difficulty - 1]}</Tag>;
  };

  const columns = [
    {
      title: '题目标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: renderQuestionType,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: renderDifficulty,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            title="查看"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            title="编辑"
          />
          <Popconfirm
            title="确定要删除这个题目吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              title="删除"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <Title level={3}>我的题目</Title>
            <Text type="secondary">管理您创建的题目</Text>
          </div>
          <Link to="/questions/create">
            <Button type="primary" icon={<PlusOutlined />}>
              创建新题目
            </Button>
          </Link>
        </div>
      </Card>

      <Card>
        <Table 
          columns={columns} 
          dataSource={questions} 
          rowKey="id" 
          loading={loading}
          pagination={{ 
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `共 ${total} 个题目`
          }}
        />
      </Card>
    </div>
  );
};

export default MyQuestionsPage; 