import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Spin, Empty, Radio, Checkbox, Input, Button, Space, message, Badge, Dropdown } from 'antd';
import { RightOutlined, LeftOutlined, StarOutlined, StarFilled, CheckCircleFilled, QuestionCircleOutlined, WarningOutlined, MoreOutlined, CheckCircleOutlined, BulbOutlined, LinkOutlined } from '@ant-design/icons';
import { useSwipeable } from 'react-swipeable';
import { useSpring, animated } from 'react-spring';
import ReactMarkdown from 'react-markdown';
import { RootState } from '@/store';
import { 
  fetchQuestionsStart, 
  fetchQuestionsSuccess, 
  fetchQuestionsFailure,
  submitAnswer,
  toggleFavorite,
  nextQuestion,
  prevQuestion,
  QuestionType
} from '@/store/slices/questionsSlice';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// 模拟获取题目数据
const mockFetchQuestions = async (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: 1,
            uuid: '550e8400-e29b-41d4-a716-446655440001',
            title: 'JavaScript中的原型链是什么?',
            content: '请解释JavaScript中的原型链概念以及它与继承的关系。',
            type: QuestionType.TextAnswer,
            difficulty: 2,
            correctAnswer: '原型链是JavaScript实现继承的主要方法。每个对象都有一个原型对象，对象从原型继承属性和方法，原型对象也可能有自己的原型，以此类推，形成原型链。',
            hint: '考虑对象、原型和__proto__之间的关系',
            source: 'JavaScript高级编程',
            isOfficial: true,
            submitCount: 283,
            tags: ['JavaScript', '原型', '继承'],
          },
          {
            id: 2,
            uuid: '550e8400-e29b-41d4-a716-446655440002',
            title: 'React中的虚拟DOM是什么?',
            content: '请选择关于React虚拟DOM的正确描述:',
            type: QuestionType.SingleChoice,
            difficulty: 2,
            choices: [
              { id: 'A', content: '虚拟DOM是一个实际的DOM节点' },
              { id: 'B', content: '虚拟DOM是JavaScript对象，代表UI的轻量级描述' },
              { id: 'C', content: '虚拟DOM直接操作浏览器的DOM API' },
              { id: 'D', content: '虚拟DOM只能用于React框架' },
            ],
            correctAnswer: 'B',
            hint: '考虑虚拟DOM的实现原理',
            source: 'React官方文档',
            isOfficial: true,
            submitCount: 456,
            tags: ['React', '虚拟DOM', '前端框架'],
          },
          {
            id: 3,
            uuid: '550e8400-e29b-41d4-a716-446655440003',
            title: 'HTTP请求方法',
            content: '以下哪些是HTTP协议定义的请求方法?',
            type: QuestionType.MultipleChoice,
            difficulty: 1,
            choices: [
              { id: 'A', content: 'GET' },
              { id: 'B', content: 'POST' },
              { id: 'C', content: 'FETCH' },
              { id: 'D', content: 'PUT' },
              { id: 'E', content: 'SEND' },
              { id: 'F', content: 'DELETE' },
            ],
            correctAnswer: ['A', 'B', 'D', 'F'],
            hint: '考虑RESTful API常用的方法',
            source: 'HTTP协议规范',
            isOfficial: true,
            submitCount: 389,
            tags: ['HTTP', 'API', '网络协议'],
          },
        ],
      });
    }, 1500);
  });
};

interface QuizPageProps {
  categoryId?: string;
}

const QuizPage: React.FC<QuizPageProps> = ({ categoryId }) => {
  const dispatch = useDispatch();
  const { 
    questions, 
    currentQuestionIndex, 
    userAnswers, 
    favorites, 
    isLoading, 
    error 
  } = useSelector((state: RootState) => state.questions);
  
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // 动画相关状态
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  // 滑动处理
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setDirection('left');
      api.start({ x: -300, config: { tension: 200, friction: 20 } });
      setTimeout(() => {
        handleSkip();
        api.start({ x: 0, immediate: true });
        setDirection(null);
      }, 300);
    },
    onSwipedRight: () => {
      setDirection('right');
      api.start({ x: 300, config: { tension: 200, friction: 20 } });
      setTimeout(() => {
        handleFavorite();
        api.start({ x: 0, immediate: true });
        setDirection(null);
      }, 300);
    },
    trackMouse: true,
  });

  // 获取题目数据
  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchQuestionsStart());
      try {
        // 在实际项目中，可以将 categoryId 传递给 API
        const response = await mockFetchQuestions();
        if (response.success) {
          // 如果有分类 ID，可以在这里进行过滤
          const filteredQuestions = categoryId 
            ? response.data.filter((q: any) => q.tags.includes(categoryId))
            : response.data;
          
          dispatch(fetchQuestionsSuccess(filteredQuestions));
        } else {
          dispatch(fetchQuestionsFailure('获取题目失败'));
        }
      } catch (error) {
        dispatch(fetchQuestionsFailure('获取题目时发生错误'));
      }
    };

    fetchData();
  }, [dispatch, categoryId]);

  // 获取当前题目
  const currentQuestion = questions[currentQuestionIndex];

  // 重置用户答案状态
  useEffect(() => {
    if (currentQuestion) {
      const savedAnswer = userAnswers[currentQuestion.id]?.answer || null;
      setUserAnswer(savedAnswer);
      setSubmitted(!!savedAnswer);
      setShowAnswer(!!savedAnswer);
    }
  }, [currentQuestion, userAnswers]);

  // 处理提交答案
  const handleSubmit = () => {
    if (!currentQuestion || !userAnswer) return;

    let isCorrect = false;

    switch (currentQuestion.type) {
      case QuestionType.SingleChoice:
        isCorrect = userAnswer === currentQuestion.correctAnswer;
        break;
      case QuestionType.MultipleChoice:
        isCorrect = JSON.stringify([...userAnswer].sort()) === JSON.stringify([...currentQuestion.correctAnswer].sort());
        break;
      case QuestionType.TextAnswer:
        // 文本答案比较复杂，这里简化处理
        isCorrect = userAnswer.includes(currentQuestion.correctAnswer.substring(0, 10));
        break;
      default:
        break;
    }

    dispatch(submitAnswer({
      questionId: currentQuestion.id,
      answer: userAnswer,
      isCorrect,
    }));

    setSubmitted(true);
    setShowAnswer(true);

    if (isCorrect) {
      message.success('回答正确！');
    } else {
      message.error('回答错误，请查看正确答案');
    }
  };

  // 处理下一题
  const handleNext = () => {
    dispatch(nextQuestion());
    setSubmitted(false);
    setShowAnswer(false);
    setUserAnswer(null);
  };

  // 处理上一题
  const handlePrev = () => {
    dispatch(prevQuestion());
    setSubmitted(false);
    setShowAnswer(false);
    setUserAnswer(null);
  };

  // 处理收藏
  const handleFavorite = () => {
    if (currentQuestion) {
      dispatch(toggleFavorite(currentQuestion.id));
      message.success(favorites.includes(currentQuestion.id) ? '已取消收藏' : '已加入收藏');
    }
  };

  // 处理跳过
  const handleSkip = () => {
    handleNext();
  };

  // 渲染题目选项
  const renderOptions = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case QuestionType.SingleChoice:
        return (
          <Radio.Group
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={submitted}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              {currentQuestion.choices?.map((choice) => (
                <Radio 
                  key={choice.id} 
                  value={choice.id} 
                  className={`w-full py-3 px-4 border rounded-lg transition-all duration-200 
                    ${submitted && choice.id === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50' : ''} 
                    ${submitted && userAnswer === choice.id && choice.id !== currentQuestion.correctAnswer ? 'border-red-500 bg-red-50' : ''}
                    ${!submitted ? 'hover:bg-gray-50 hover:border-primary-200 hover:shadow-sm' : ''}`
                  }
                >
                  <div className="flex items-center">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-medium mr-3">
                      {choice.id}
                    </span> 
                    <span className="text-base">{choice.content}</span>
                    {submitted && choice.id === currentQuestion.correctAnswer && (
                      <CheckCircleFilled className="ml-2 text-green-500 text-lg" />
                    )}
                  </div>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );
      
      case QuestionType.MultipleChoice:
        return (
          <Checkbox.Group
            value={userAnswer}
            onChange={(values) => setUserAnswer(values)}
            disabled={submitted}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              {currentQuestion.choices?.map((choice) => {
                const isCorrect = currentQuestion.correctAnswer.includes(choice.id);
                const isSelected = userAnswer?.includes(choice.id);
                
                return (
                  <Checkbox 
                    key={choice.id} 
                    value={choice.id} 
                    className={`w-full py-3 px-4 border rounded-lg transition-all duration-200
                      ${submitted && isCorrect ? 'border-green-500 bg-green-50' : ''}
                      ${submitted && isSelected && !isCorrect ? 'border-red-500 bg-red-50' : ''}
                      ${!submitted ? 'hover:bg-gray-50 hover:border-primary-200 hover:shadow-sm' : ''}`
                    }
                  >
                    <div className="flex items-center">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-700 font-medium mr-3">
                        {choice.id}
                      </span>
                      <span className="text-base">{choice.content}</span>
                      {submitted && isCorrect && (
                        <CheckCircleFilled className="ml-2 text-green-500 text-lg" />
                      )}
                    </div>
                  </Checkbox>
                );
              })}
            </Space>
          </Checkbox.Group>
        );
      
      case QuestionType.TextAnswer:
        return (
          <div className="relative">
            <TextArea
              rows={6}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={submitted}
              placeholder="请输入您的答案..."
              className="mb-4 p-4 text-base leading-relaxed rounded-lg"
              autoSize={{ minRows: 6, maxRows: 12 }}
            />
            {!submitted && (
              <div className="absolute bottom-6 right-4 text-gray-400">
                <Button 
                  type="text" 
                  onClick={() => setShowHint(!showHint)}
                  className="text-secondary-500 hover:text-secondary-700"
                  icon={<QuestionCircleOutlined />}
                >
                  查看提示
                </Button>
              </div>
            )}
            {showHint && currentQuestion.hint && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4 text-yellow-800">
                <div className="font-medium mb-1">提示：</div>
                <ReactMarkdown>{currentQuestion.hint}</ReactMarkdown>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  // 渲染题目难度
  const renderDifficulty = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return <Text type="success">简单</Text>;
      case 2:
        return <Text type="warning">中等</Text>;
      case 3:
        return <Text type="danger">困难</Text>;
      case 4:
        return <Text type="danger" strong>地狱</Text>;
      default:
        return null;
    }
  };

  // 渲染题目类型
  const renderQuestionType = (type: QuestionType) => {
    switch (type) {
      case QuestionType.SingleChoice:
        return <Text type="secondary">单选题</Text>;
      case QuestionType.MultipleChoice:
        return <Text type="secondary">多选题</Text>;
      case QuestionType.TextAnswer:
        return <Text type="secondary">简答题</Text>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spin size="large" tip="加载题目中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Empty description={error} />
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Empty description="暂无题目" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-gray-700 mr-4">
            {currentQuestionIndex + 1}/{questions.length}
          </div>
          <div className="flex space-x-2">
            {renderQuestionType(currentQuestion.type)}
            <Text type="secondary">·</Text>
            {renderDifficulty(currentQuestion.difficulty)}
          </div>
        </div>
        <div className="flex items-center">
          <Badge 
            count={favorites.length} 
            size="small" 
            offset={[-5, 5]}
            className="mr-3"
          >
            <Button
              type={favorites.includes(currentQuestion.id) ? "primary" : "default"}
              shape="circle"
              icon={favorites.includes(currentQuestion.id) ? <StarFilled className="text-yellow-400" /> : <StarOutlined />}
              onClick={handleFavorite}
              className={favorites.includes(currentQuestion.id) ? "bg-yellow-50 border-yellow-400" : ""}
            />
          </Badge>
          <Dropdown menu={{ 
            items: [
              { 
                key: 'skip', 
                label: '跳过此题', 
                icon: <RightOutlined />, 
                onClick: handleSkip 
              },
              { 
                key: 'favorite', 
                label: favorites.includes(currentQuestion.id) ? '取消收藏' : '收藏此题', 
                icon: favorites.includes(currentQuestion.id) ? <StarFilled className="text-yellow-400" /> : <StarOutlined />, 
                onClick: handleFavorite 
              },
              { 
                key: 'report', 
                label: '报告问题', 
                icon: <WarningOutlined /> 
              },
            ] 
          }} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      <animated.div
        {...handlers}
        style={{ x, touchAction: 'pan-y' }}
        className={`quiz-card transition-shadow ${direction ? 'shadow-xl' : ''}`}
      >
        <Card className="h-full overflow-auto border-0 shadow-lg rounded-2xl">
          <div className="mb-6">
            <Title level={4} className="text-2xl font-bold">{currentQuestion.title}</Title>
            <div className="markdown-content mt-4 text-lg text-gray-800">
              <ReactMarkdown>{currentQuestion.content}</ReactMarkdown>
            </div>
          </div>

          <div className="mb-6">
            {renderOptions()}
          </div>

          {showAnswer && (
            <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
              <Title level={5} className="flex items-center text-primary-600">
                <CheckCircleOutlined className="mr-2" /> 参考答案
              </Title>
              <div className="mb-3 bg-white p-4 rounded-lg">
                {currentQuestion.type === QuestionType.SingleChoice && (
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-medium mr-3">
                      {currentQuestion.correctAnswer}
                    </div>
                    <Text strong className="text-green-700">
                      {currentQuestion.choices?.find(c => c.id === currentQuestion.correctAnswer)?.content}
                    </Text>
                  </div>
                )}
                {currentQuestion.type === QuestionType.MultipleChoice && (
                  <div>
                    {currentQuestion.correctAnswer.map((answer) => (
                      <div key={answer} className="flex items-center mb-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-medium mr-3">
                          {answer}
                        </div>
                        <Text strong className="text-green-700">
                          {currentQuestion.choices?.find(c => c.id === answer)?.content}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
                {currentQuestion.type === QuestionType.TextAnswer && (
                  <div className="text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">
                    <ReactMarkdown>{currentQuestion.correctAnswer}</ReactMarkdown>
                  </div>
                )}
              </div>
              {currentQuestion.hint && (
                <div className="mt-4">
                  <Title level={5} className="flex items-center text-yellow-600">
                    <BulbOutlined className="mr-2" /> 提示
                  </Title>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <ReactMarkdown>{currentQuestion.hint}</ReactMarkdown>
                  </div>
                </div>
              )}
              {currentQuestion.source && (
                <div className="mt-4 text-gray-500 text-sm flex items-center">
                  <LinkOutlined className="mr-1" /> 来源: {currentQuestion.source}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button 
              onClick={handlePrev} 
              disabled={currentQuestionIndex === 0}
              icon={<LeftOutlined />}
              size="large"
              className="min-w-[100px]"
            >
              上一题
            </Button>
            
            {!submitted ? (
              <Button 
                type="primary" 
                onClick={handleSubmit} 
                disabled={!userAnswer}
                size="large"
                className="min-w-[100px] bg-gradient-to-r from-primary-500 to-secondary-500 border-0 hover:from-primary-600 hover:to-secondary-600"
              >
                提交答案
              </Button>
            ) : (
              <Button 
                type="primary" 
                onClick={handleNext} 
                disabled={currentQuestionIndex === questions.length - 1}
                size="large"
                className="min-w-[100px] bg-gradient-to-r from-primary-500 to-secondary-500 border-0 hover:from-primary-600 hover:to-secondary-600"
              >
                下一题 <RightOutlined />
              </Button>
            )}
          </div>
        </Card>
      </animated.div>

      <div className="text-center mt-6 mb-8 text-gray-500 text-sm">
        <div className="flex justify-center items-center space-x-8">
          <div className="flex items-center">
            <div className="w-10 h-1 bg-gray-200 rounded-full mr-2"></div>
            <span>左滑跳过</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-1 bg-yellow-200 rounded-full mr-2"></div>
            <span>右滑收藏</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 