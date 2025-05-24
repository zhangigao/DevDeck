import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Typography, Space, Empty, Skeleton } from 'antd';
import { StarFilled, RightOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '@/store';
import { QuestionType } from '@/store/slices/questionsSlice';

const { Title, Text, Paragraph } = Typography;

// 模拟API调用获取收藏题目
const mockFetchFavorites = async (favoriteIds: number[]): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: 'JavaScript中的原型链是什么?',
          content: '请解释JavaScript中的原型链概念以及它与继承的关系。',
          type: QuestionType.TextAnswer,
          difficulty: 2,
          tags: ['JavaScript', '原型', '继承'],
        },
        {
          id: 2,
          title: 'React中的虚拟DOM是什么?',
          content: '请选择关于React虚拟DOM的正确描述:',
          type: QuestionType.SingleChoice,
          difficulty: 2,
          tags: ['React', '虚拟DOM', '前端框架'],
        },
      ]);
    }, 1000);
  });
};

const FavoritesPage: React.FC = () => {
  const [favoriteQuestions, setFavoriteQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const favorites = useSelector((state: RootState) => state.questions.favorites);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setFavoriteQuestions([]);
        return;
      }

      setLoading(true);
      try {
        const questions = await mockFetchFavorites(favorites);
        setFavoriteQuestions(questions);
      } catch (error) {
        console.error('获取收藏题目失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

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

  return (
    <div>
      <Card className="mb-4">
        <div className="flex items-center">
          <StarFilled className="text-yellow-400 text-xl mr-3" />
          <div>
            <Title level={3}>我的收藏</Title>
            <Text type="secondary">您收藏的题目</Text>
          </div>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} active avatar paragraph={{ rows: 3 }} />
            ))}
          </div>
        ) : favoriteQuestions.length === 0 ? (
          <Empty
            description="您还没有收藏任何题目"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Link to="/quiz">
              <Button type="primary">
                去刷题
              </Button>
            </Link>
          </Empty>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={favoriteQuestions}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <Space key="tags">
                    {item.tags.map((tag: string) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>,
                ]}
                extra={
                  <Link to={`/quiz?question=${item.id}`}>
                    <Button type="primary" icon={<RightOutlined />}>
                      练习
                    </Button>
                  </Link>
                }
              >
                <List.Item.Meta
                  title={item.title}
                  description={
                    <Space>
                      {renderQuestionType(item.type)}
                      {renderDifficulty(item.difficulty)}
                    </Space>
                  }
                />
                <Paragraph ellipsis={{ rows: 2 }} className="text-gray-600">
                  {item.content}
                </Paragraph>
              </List.Item>
            )}
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 10,
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default FavoritesPage; 