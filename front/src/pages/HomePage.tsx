import React from 'react';
import { Card, Typography, Row, Col, Statistic, Button, List, Tag, Space, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { 
  RightOutlined, 
  StarOutlined, 
  FileAddOutlined, 
  FireOutlined,
  TrophyOutlined,
  HistoryOutlined,
  BookOutlined,
  AppstoreOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AnimatedBackground from '@/components/common/AnimatedBackground';

const { Title, Text, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // 模拟热门分类数据
  const categories = [
    { id: 'javascript', name: 'JavaScript', count: 256, color: 'orange' },
    { id: 'react', name: 'React', count: 142, color: 'blue' },
    { id: 'vue', name: 'Vue', count: 89, color: 'green' },
    { id: 'node', name: 'Node.js', count: 67, color: 'lime' },
    { id: 'typescript', name: 'TypeScript', count: 58, color: 'geekblue' },
    { id: 'html-css', name: 'HTML/CSS', count: 53, color: 'red' },
  ];

  // 模拟最近活动数据
  const activities = [
    { 
      id: 1, 
      title: '完成了"JavaScript中的原型链是什么?"', 
      time: '30分钟前',
      type: 'completed',
    },
    { 
      id: 2, 
      title: '收藏了"React中的虚拟DOM是什么?"', 
      time: '2小时前',
      type: 'favorite',
    },
    { 
      id: 3, 
      title: '创建了"HTTP请求方法"', 
      time: '昨天',
      type: 'created',
    },
  ];

  // 这里是模拟数据，实际项目中可以从API获取
  const stats = {
    totalQuestions: 1024,
    totalCategories: 42,
    activeUsers: 3250,
    questionsToday: 76,
  };

  const features = [
    {
      icon: <BookOutlined className="text-4xl text-primary-500" />,
      title: '智能刷题',
      description: '支持单选、多选、填空等多种题型，自定义难度与分类，帮助您高效学习。',
      action: () => navigate('/quiz'),
    },
    {
      icon: <AppstoreOutlined className="text-4xl text-secondary-500" />,
      title: '知识分类',
      description: '覆盖前端、后端、算法等多个技术领域，系统化提升您的技术能力。',
      action: () => navigate('/categories'),
    },
    {
      icon: <FileAddOutlined className="text-4xl text-green-500" />,
      title: '题目贡献',
      description: '分享您的专业知识，创建高质量题目，帮助社区共同成长。',
      action: () => navigate('/questions/create'),
    },
    {
      icon: <UserOutlined className="text-4xl text-yellow-500" />,
      title: '个人中心',
      description: '记录您的学习轨迹，收藏重要题目，查看刷题统计数据。',
      action: () => navigate('/profile'),
    },
  ];

  return (
    <div className="relative">
      <AnimatedBackground color="#0ea5e9" opacity={0.2} particleCount={70} />
      
      {/* 欢迎卡片 */}
      <Card className="mb-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0 shadow-xl rounded-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-12 -mr-12"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-10 -ml-10"></div>
        <Row gutter={24} align="middle">
          <Col span={16}>
            <Title level={2} className="text-white mb-2">欢迎来到 Dev-Deck</Title>
            <Paragraph className="text-white mb-4 text-lg">
              专为开发者设计的刷题平台，提升您的编程技能，准备技术面试
            </Paragraph>
            {isAuthenticated ? (
              <Link to="/quiz">
                <Button type="primary" size="large" className="bg-white text-primary-500 border-white hover:bg-gray-100 h-12 text-lg">
                  开始刷题
                </Button>
              </Link>
            ) : (
              <Space>
                <Link to="/auth/login">
                  <Button type="primary" size="large" className="bg-white text-primary-500 border-white hover:bg-gray-100 h-12 text-lg">
                    登录
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="large" ghost className="border-2 h-12 text-lg hover:border-white hover:text-white">
                    注册
                  </Button>
                </Link>
              </Space>
            )}
          </Col>
          <Col span={8}>
            <img 
              src="/assets/images/home-illustration.svg" 
              alt="Developer coding" 
              className="w-full"
              onError={(e) => {
                // 图片加载失败时的处理
                e.currentTarget.style.display = 'none';
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* 统计数据 */}
      <Row gutter={16} className="my-12">
        <Col xs={12} md={6}>
          <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
            <div className="absolute w-20 h-20 bg-blue-50 rounded-full -top-10 -right-10 z-0"></div>
            <div className="relative z-10">
              <Statistic 
                title={<span className="text-gray-500">题目总数</span>} 
                value={stats.totalQuestions} 
                prefix={<BookOutlined className="text-blue-500" />} 
                valueStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
            <div className="absolute w-20 h-20 bg-purple-50 rounded-full -top-10 -right-10 z-0"></div>
            <div className="relative z-10">
              <Statistic 
                title={<span className="text-gray-500">知识分类</span>} 
                value={stats.totalCategories} 
                prefix={<AppstoreOutlined className="text-purple-500" />} 
                valueStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
            <div className="absolute w-20 h-20 bg-green-50 rounded-full -top-10 -right-10 z-0"></div>
            <div className="relative z-10">
              <Statistic 
                title={<span className="text-gray-500">活跃用户</span>} 
                value={stats.activeUsers} 
                prefix={<UserOutlined className="text-green-500" />} 
                valueStyle={{ color: '#10b981', fontWeight: 'bold' }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
            <div className="absolute w-20 h-20 bg-amber-50 rounded-full -top-10 -right-10 z-0"></div>
            <div className="relative z-10">
              <Statistic 
                title={<span className="text-gray-500">今日新题</span>} 
                value={stats.questionsToday} 
                prefix={<FileAddOutlined className="text-amber-500" />} 
                valueStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* 功能特点 */}
      <div className="my-12">
        <Title level={2} className="text-center mb-8 text-gray-800">
          <span className="relative">
            主要功能
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></span>
          </span>
        </Title>
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} md={12} key={index}>
              <Card 
                hoverable 
                className="h-full border-0 shadow-md hover:shadow-xl transition-all rounded-xl overflow-hidden transform hover:-translate-y-1"
                onClick={feature.action}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-4 text-5xl">{feature.icon}</div>
                  <Title level={3} className="mb-3">{feature.title}</Title>
                  <Paragraph className="text-center text-gray-600 text-base">
                    {feature.description}
                  </Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 内容区域 */}
      <Row gutter={16}>
        {/* 热门分类 */}
        <Col span={16}>
          <Card 
            title={
              <div className="flex items-center">
                <FireOutlined className="mr-2 text-red-500" />
                <span className="text-lg font-bold">热门分类</span>
              </div>
            }
            className="mb-6 border-0 shadow-md rounded-xl"
          >
            <Row gutter={[16, 16]}>
              {categories.map(category => (
                <Col span={8} key={category.id}>
                  <Link to={`/quiz/category/${category.id}`}>
                    <Card 
                      hoverable 
                      className="text-center border-0 shadow-sm hover:shadow-md transition-all rounded-lg transform hover:-translate-y-1"
                      bodyStyle={{ padding: '16px' }}
                    >
                      <Tag color={category.color} className="mb-2 px-2 py-1">{category.count}题</Tag>
                      <Title level={5} className="mb-0">{category.name}</Title>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Card>

          {/* 推荐题目 */}
          <Card 
            title={
              <div className="flex items-center">
                <StarOutlined className="mr-2 text-yellow-500" />
                <span className="text-lg font-bold">精选题目</span>
              </div>
            }
            extra={
              <Link to="/quiz" className="text-primary-500 hover:text-primary-700 flex items-center">
                查看更多 <RightOutlined className="ml-1" />
              </Link>
            }
            className="border-0 shadow-md rounded-xl"
          >
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: 'JavaScript中的闭包及其应用',
                  tags: ['JavaScript', '闭包', '高级'],
                  difficulty: 2
                },
                {
                  title: 'React Hooks的工作原理',
                  tags: ['React', 'Hooks', '函数组件'],
                  difficulty: 3
                },
                {
                  title: '常见的CSS布局技术',
                  tags: ['CSS', '布局', 'Flexbox'],
                  difficulty: 1
                }
              ]}
              renderItem={item => (
                <List.Item
                  className="hover:bg-gray-50 rounded-lg transition-colors p-2"
                  extra={
                    <Link to="/quiz">
                      <Button 
                        type="primary" 
                        size="middle" 
                        className="rounded-full px-4 bg-gradient-to-r from-primary-500 to-secondary-500 border-0 hover:from-primary-600 hover:to-secondary-600"
                      >
                        开始练习
                      </Button>
                    </Link>
                  }
                >
                  <List.Item.Meta
                    title={<span className="text-base font-medium">{item.title}</span>}
                    description={
                      <Space>
                        {item.tags.map(tag => (
                          <Tag key={tag} className="rounded-full border-0 bg-gray-100 text-gray-600">{tag}</Tag>
                        ))}
                        <Tag color={item.difficulty === 1 ? 'green' : (item.difficulty === 2 ? 'orange' : 'red')} className="rounded-full">
                          {item.difficulty === 1 ? '简单' : (item.difficulty === 2 ? '中等' : '困难')}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 右侧边栏 */}
        <Col span={8}>
          {isAuthenticated && (
            <Card 
              title={
                <div className="flex items-center">
                  <HistoryOutlined className="mr-2 text-primary-500" />
                  <span className="text-lg font-bold">最近活动</span>
                </div>
              }
              className="mb-6 border-0 shadow-md rounded-xl"
            >
              <List
                itemLayout="horizontal"
                dataSource={activities}
                renderItem={item => (
                  <List.Item className="hover:bg-gray-50 rounded-lg transition-colors">
                    <List.Item.Meta
                      avatar={
                        item.type === 'completed' ? (
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
                            <TrophyOutlined className="text-green-500 text-lg" />
                          </div>
                        ) : item.type === 'favorite' ? (
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100">
                            <StarOutlined className="text-yellow-500 text-lg" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
                            <FileAddOutlined className="text-blue-500 text-lg" />
                          </div>
                        )
                      }
                      title={<span className="font-medium">{item.title}</span>}
                      description={<span className="text-gray-400">{item.time}</span>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}

          <Card 
            title={
              <div className="flex items-center">
                <FileAddOutlined className="mr-2 text-primary-500" />
                <span className="text-lg font-bold">创建题目</span>
              </div>
            }
            className="border-0 shadow-md rounded-xl"
          >
            <div className="text-center p-4 bg-gray-50 rounded-lg mb-4">
              <img 
                src="/assets/images/create-question.svg" 
                alt="创建题目" 
                className="w-1/2 mx-auto mb-3"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Paragraph className="text-gray-600">
                分享您的知识，创建高质量的题目，帮助更多开发者提升技能
              </Paragraph>
            </div>
            <Link to="/questions/create">
              <Button 
                type="primary" 
                block 
                size="large" 
                className="h-12 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 border-0 hover:from-primary-600 hover:to-secondary-600"
              >
                创建新题目
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage; 