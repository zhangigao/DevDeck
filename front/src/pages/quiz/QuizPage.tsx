import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Radio, 
  Checkbox, 
  Input, 
  Typography, 
  Space, 
  Tag, 
  message, 
  Spin, 
  Empty,
  Progress,
  Tooltip,
  Drawer,
  Avatar,
  List,
  Divider
} from 'antd';
import { 
  CheckCircleOutlined, 
  CheckCircleFilled,
  HeartOutlined, 
  HeartFilled,
  LeftOutlined, 
  RightOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  LinkOutlined,
  RobotOutlined,
  SendOutlined,
  UserOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  fetchQuestionsStart, 
  fetchQuestionsSuccess, 
  fetchQuestionsFailure,
  nextQuestion,
  prevQuestion,
  submitAnswer,
  toggleFavorite,
  QuestionType
} from '@/store/slices/questionsSlice';
import ReactMarkdown from 'react-markdown';
import { useSpring, animated } from 'react-spring';
import { useSwipeable } from 'react-swipeable';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface QuizPageProps {
  categoryId?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

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
            title: 'CSS Flexbox布局',
            content: '以下哪些是CSS Flexbox的有效属性？（多选）',
            type: QuestionType.MultipleChoice,
            difficulty: 1,
            choices: [
              { id: 'A', content: 'justify-content' },
              { id: 'B', content: 'align-items' },
              { id: 'C', content: 'flex-direction' },
              { id: 'D', content: 'grid-template-columns' },
            ],
            correctAnswer: ['A', 'B', 'C'],
            hint: 'Grid和Flexbox是不同的布局系统',
            source: 'MDN Web Docs',
            isOfficial: true,
            submitCount: 234,
            tags: ['CSS', 'Flexbox', '布局'],
          },
        ]
      });
    }, 1000);
  });
};

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
  
  // AI对话框相关状态
  const [aiDrawerVisible, setAiDrawerVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

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
        const response = await mockFetchQuestions();
        if (response.success) {
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

  // AI对话相关函数
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setAiLoading(true);

    // 模拟AI响应
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `关于"${inputMessage}"，我来为您解答：\n\n这是一个很好的问题！基于当前题目的内容，我建议您可以从以下几个角度来思考：\n\n1. 理解核心概念\n2. 分析实际应用场景\n3. 对比相关技术\n\n您还有其他疑问吗？`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setAiLoading(false);
    }, 1500);
  };

  // 渲染题目选项
  const renderOptions = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case QuestionType.SingleChoice:
        return (
          <div className="space-y-3">
            <Radio.Group
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={submitted}
              className="w-full"
            >
              {currentQuestion.choices?.map((choice) => (
                <div key={choice.id} className="w-full">
                  <Radio 
                    value={choice.id} 
                    className={`w-full p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-md
                      ${submitted && choice.id === currentQuestion.correctAnswer ? 'border-green-400 bg-green-50 shadow-green-100' : ''} 
                      ${submitted && userAnswer === choice.id && choice.id !== currentQuestion.correctAnswer ? 'border-red-400 bg-red-50 shadow-red-100' : ''}
                      ${!submitted ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50' : ''}
                      ${userAnswer === choice.id && !submitted ? 'border-blue-400 bg-blue-50' : ''}`
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold mr-4 text-sm">
                          {choice.id}
                        </span> 
                        <span className="text-base font-medium">{choice.content}</span>
                      </div>
                      {submitted && choice.id === currentQuestion.correctAnswer && (
                        <CheckCircleFilled className="text-green-500 text-xl" />
                      )}
                    </div>
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
        );

      case QuestionType.MultipleChoice:
        return (
          <div className="space-y-3">
            <Checkbox.Group
              value={userAnswer}
              onChange={setUserAnswer}
              disabled={submitted}
              className="w-full"
            >
              {currentQuestion.choices?.map((choice) => (
                <div key={choice.id} className="w-full">
                  <Checkbox 
                    value={choice.id} 
                    className={`w-full p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-md
                      ${submitted && currentQuestion.correctAnswer.includes(choice.id) ? 'border-green-400 bg-green-50 shadow-green-100' : ''} 
                      ${submitted && userAnswer?.includes(choice.id) && !currentQuestion.correctAnswer.includes(choice.id) ? 'border-red-400 bg-red-50 shadow-red-100' : ''}
                      ${!submitted ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50' : ''}
                      ${userAnswer?.includes(choice.id) && !submitted ? 'border-blue-400 bg-blue-50' : ''}`
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold mr-4 text-sm">
                          {choice.id}
                        </span> 
                        <span className="text-base font-medium">{choice.content}</span>
                      </div>
                      {submitted && currentQuestion.correctAnswer.includes(choice.id) && (
                        <CheckCircleFilled className="text-green-500 text-xl" />
                      )}
                    </div>
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
        );
      
      case QuestionType.TextAnswer:
        return (
          <div className="relative">
            <TextArea
              rows={8}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={submitted}
              placeholder="请输入您的答案..."
              className="p-6 text-base leading-relaxed rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-colors"
              autoSize={{ minRows: 8, maxRows: 15 }}
            />
            {!submitted && (
              <div className="absolute bottom-4 right-4">
                <Button 
                  type="text" 
                  onClick={() => setShowHint(!showHint)}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                  icon={<QuestionCircleOutlined />}
                >
                  查看提示
                </Button>
              </div>
            )}
            {showHint && currentQuestion.hint && (
              <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 p-6 rounded-xl">
                <div className="flex items-center font-bold text-yellow-800 mb-2">
                  <BulbOutlined className="mr-2 text-lg" />
                  提示
                </div>
                <ReactMarkdown className="text-yellow-700">{currentQuestion.hint}</ReactMarkdown>
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
    const configs = {
      1: { text: '简单', color: 'success', bg: 'bg-green-100', text_color: 'text-green-700' },
      2: { text: '中等', color: 'warning', bg: 'bg-yellow-100', text_color: 'text-yellow-700' },
      3: { text: '困难', color: 'error', bg: 'bg-red-100', text_color: 'text-red-700' },
      4: { text: '地狱', color: 'error', bg: 'bg-purple-100', text_color: 'text-purple-700' },
    };
    
    const config = configs[difficulty as keyof typeof configs];
    if (!config) return null;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text_color}`}>
        {config.text}
      </span>
    );
  };

  // 渲染题目类型
  const renderQuestionType = (type: QuestionType) => {
    const configs = {
      [QuestionType.SingleChoice]: { text: '单选题', bg: 'bg-blue-100', text_color: 'text-blue-700' },
      [QuestionType.MultipleChoice]: { text: '多选题', bg: 'bg-purple-100', text_color: 'text-purple-700' },
      [QuestionType.TextAnswer]: { text: '简答题', bg: 'bg-gray-100', text_color: 'text-gray-700' },
    };
    
    const config = configs[type];
    if (!config) return null;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text_color}`}>
        {config.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-lg text-gray-600">正在加载题目...</div>
        </div>
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

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 进度条和题目信息 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-gray-800">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
            {renderQuestionType(currentQuestion.type)}
            {renderDifficulty(currentQuestion.difficulty)}
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip title="AI助手">
              <Button 
                type="primary" 
                icon={<RobotOutlined />}
                onClick={() => setAiDrawerVisible(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600"
              >
                AI助手
              </Button>
            </Tooltip>
            <Tooltip title={favorites.includes(currentQuestion.id) ? '取消收藏' : '收藏题目'}>
              <Button 
                type={favorites.includes(currentQuestion.id) ? 'primary' : 'default'}
                icon={favorites.includes(currentQuestion.id) ? <HeartFilled /> : <HeartOutlined />}
                onClick={handleFavorite}
                className={favorites.includes(currentQuestion.id) ? 'bg-red-500 border-red-500 hover:bg-red-600' : ''}
              />
            </Tooltip>
          </div>
        </div>
        <Progress 
          percent={progress} 
          showInfo={false} 
          strokeColor={{
            '0%': '#667eea',
            '100%': '#764ba2',
          }}
          className="mb-2"
        />
        <div className="text-sm text-gray-500">
          已完成 {Object.keys(userAnswers).length} 题，正确 {Object.values(userAnswers).filter(a => a.isCorrect).length} 题
        </div>
      </div>

      {/* 题目卡片 */}
      <animated.div
        {...handlers}
        style={{ x, touchAction: 'pan-y' }}
        className={`transition-all duration-300 ${direction ? 'scale-105 shadow-2xl' : ''}`}
      >
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="p-8">
            {/* 题目标题和内容 */}
            <div className="mb-8">
              <Title level={3} className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                {currentQuestion.title}
              </Title>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <ReactMarkdown>{currentQuestion.content}</ReactMarkdown>
              </div>
            </div>

            {/* 题目选项 */}
            <div className="mb-8">
              {renderOptions()}
            </div>

            {/* 答案解析 */}
            {showAnswer && (
              <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-100">
                <Title level={4} className="flex items-center text-blue-600 mb-4">
                  <CheckCircleOutlined className="mr-3 text-xl" /> 参考答案
                </Title>
                <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
                  <ReactMarkdown className="text-gray-800">{currentQuestion.correctAnswer}</ReactMarkdown>
                </div>
                
                {currentQuestion.hint && (
                  <div className="mt-4">
                    <Title level={5} className="flex items-center text-yellow-600 mb-2">
                      <BulbOutlined className="mr-2" /> 解题提示
                    </Title>
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                      <ReactMarkdown className="text-yellow-800">{currentQuestion.hint}</ReactMarkdown>
                    </div>
                  </div>
                )}
                
                {currentQuestion.source && (
                  <div className="mt-4 flex items-center text-gray-500 text-sm">
                    <LinkOutlined className="mr-2" /> 
                    <span>来源: {currentQuestion.source}</span>
                  </div>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-between items-center">
              <Button 
                onClick={handlePrev} 
                disabled={currentQuestionIndex === 0}
                icon={<LeftOutlined />}
                size="large"
                className="min-w-[120px] h-12 rounded-xl font-medium"
              >
                上一题
              </Button>
              
              <div className="flex space-x-4">
                {!submitted ? (
                  <Button 
                    type="primary" 
                    onClick={handleSubmit} 
                    disabled={!userAnswer}
                    size="large"
                    className="min-w-[120px] h-12 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-purple-500 border-0 hover:from-blue-600 hover:to-purple-600"
                  >
                    提交答案
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    onClick={handleNext} 
                    disabled={currentQuestionIndex === questions.length - 1}
                    size="large"
                    className="min-w-[120px] h-12 rounded-xl font-medium bg-gradient-to-r from-green-500 to-teal-500 border-0 hover:from-green-600 hover:to-teal-600"
                  >
                    下一题 <RightOutlined />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </animated.div>

      {/* 滑动提示 */}
      <div className="text-center mt-8 text-gray-400">
        <div className="flex justify-center items-center space-x-8">
          <div className="flex items-center">
            <div className="w-12 h-2 bg-gradient-to-r from-red-300 to-red-400 rounded-full mr-3"></div>
            <span className="text-sm">左滑跳过</span>
          </div>
          <div className="flex items-center">
            <div className="w-12 h-2 bg-gradient-to-r from-pink-300 to-pink-400 rounded-full mr-3"></div>
            <span className="text-sm">右滑收藏</span>
          </div>
        </div>
      </div>

      {/* AI对话抽屉 */}
      <Drawer
        title={
          <div className="flex items-center">
            <RobotOutlined className="mr-2 text-purple-500" />
            <span>AI学习助手</span>
          </div>
        }
        placement="right"
        width={400}
        onClose={() => setAiDrawerVisible(false)}
        open={aiDrawerVisible}
        extra={
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={() => setAiDrawerVisible(false)}
          />
        }
      >
        <div className="flex flex-col h-full">
          {/* 聊天消息区域 */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <RobotOutlined className="text-4xl mb-4 text-purple-300" />
                <p>你好！我是AI学习助手</p>
                <p className="text-sm">有什么关于这道题的问题吗？</p>
              </div>
            ) : (
              <List
                dataSource={chatMessages}
                renderItem={(message) => (
                  <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar 
                        icon={message.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                        className={message.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'}
                      />
                      <div className={`p-3 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-blue-500 text-white rounded-br-sm' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}>
                        <ReactMarkdown className="text-sm leading-relaxed">
                          {message.content}
                        </ReactMarkdown>
                        <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            )}
            {aiLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start space-x-2">
                  <Avatar icon={<RobotOutlined />} className="bg-purple-500" />
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
                    <Spin size="small" />
                    <span className="ml-2 text-sm text-gray-600">AI正在思考...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 输入区域 */}
          <div className="border-t pt-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="输入你的问题..."
                onPressEnter={handleSendMessage}
                disabled={aiLoading}
                className="rounded-xl"
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || aiLoading}
                className="rounded-xl bg-purple-500 border-purple-500 hover:bg-purple-600"
              />
            </div>
            <div className="text-xs text-gray-400 mt-2">
              按回车发送消息
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default QuizPage; 