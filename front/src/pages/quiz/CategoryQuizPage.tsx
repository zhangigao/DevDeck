import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Spin, Empty } from 'antd';
import QuizPage from './QuizPage';

const { Title, Text } = Typography;

const CategoryQuizPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  // 这里可以根据分类ID加载相关题目
  // 实际项目中，您需要添加获取分类题目的逻辑
  
  return (
    <div>
      <Card className="mb-4">
        <Title level={4}>分类刷题</Title>
        <Text type="secondary">当前分类: {categoryId}</Text>
      </Card>
      
      {/* 复用 QuizPage 组件，传入分类ID */}
      <QuizPage categoryId={categoryId} />
    </div>
  );
};

export default CategoryQuizPage; 