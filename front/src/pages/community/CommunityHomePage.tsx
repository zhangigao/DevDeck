import React, { useState } from 'react';
import { Card, List, Avatar, Space, Tag, Button, Input, Tabs, Typography, Divider, Skeleton, Empty, Badge, Tooltip } from 'antd';
import { 
  LikeOutlined, 
  MessageOutlined, 
  EyeOutlined, 
  ShareAltOutlined, 
  FireOutlined, 
  StarOutlined,
  BookOutlined,
  PlusOutlined,
  SearchOutlined,
  RiseOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ActiveUserList from '@/components/ActiveUserList';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

interface PostData {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  createTime: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  isTop?: boolean;
  isHot?: boolean;
}

interface TopicData {
  id: number;
  name: string;
  postCount: number;
  followCount: number;
  isHot?: boolean;
  isNew?: boolean;
}

interface UserData {
  id: number;
  name: string;
  avatar?: string;
  postCount: number;
  isActive?: boolean;
}

const CommunityHomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('latest');

  // 模拟帖子数据
  const postsData: PostData[] = [
    {
      id: 1,
      title: '如何高效学习前端开发？分享我的学习路线和方法',
      content: '作为一名前端开发者，我想分享我的学习经验和方法论。首先，掌握HTML、CSS和JavaScript基础是必不可少的...',
      author: {
        id: 101,
        name: '前端探索者',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      createTime: '2023-11-25 14:23:45',
      viewCount: 1245,
      likeCount: 56,
      commentCount: 23,
      tags: ['前端', '学习方法', '经验分享'],
      isTop: true,
      isHot: true,
    },
    {
      id: 2,
      title: 'TypeScript高级类型使用详解',
      content: 'TypeScript的类型系统非常强大，本文将深入讲解条件类型、映射类型、类型守卫等高级特性的使用方法和实践案例...',
      author: {
        id: 102,
        name: 'TS专家',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      createTime: '2023-11-24 10:15:32',
      viewCount: 985,
      likeCount: 42,
      commentCount: 18,
      tags: ['TypeScript', '前端', '编程语言'],
      isHot: true,
    },
    {
      id: 3,
      title: 'React性能优化实践总结',
      content: '在开发大型React应用时，性能优化是一个不可忽视的问题。本文将分享一些实用的React性能优化技巧，包括组件拆分、memo、useMemo、useCallback等...',
      author: {
        id: 103,
        name: 'React达人',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      createTime: '2023-11-23 16:45:12',
      viewCount: 756,
      likeCount: 38,
      commentCount: 15,
      tags: ['React', '性能优化', '前端'],
    },
    {
      id: 4,
      title: '从零搭建一个现代化前端工程',
      content: '本文将详细介绍如何从零开始搭建一个包含Webpack、Babel、ESLint、TypeScript、React的现代化前端工程...',
      author: {
        id: 104,
        name: '工程化爱好者',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
      createTime: '2023-11-22 09:30:45',
      viewCount: 632,
      likeCount: 29,
      commentCount: 12,
      tags: ['工程化', 'Webpack', '前端'],
    },
    {
      id: 5,
      title: '浏览器渲染原理与性能优化',
      content: '了解浏览器的渲染过程对前端性能优化非常重要。本文将深入讲解浏览器的工作原理，包括DOM解析、CSS计算、布局、绘制等环节...',
      author: {
        id: 105,
        name: '性能优化专家',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      },
      createTime: '2023-11-21 11:20:36',
      viewCount: 589,
      likeCount: 27,
      commentCount: 10,
      tags: ['浏览器', '性能优化', '前端'],
    },
  ];

  // 模拟热门话题数据
  const topicsData: TopicData[] = [
    {
      id: 1,
      name: 'React',
      postCount: 1256,
      followCount: 5689,
      isHot: true,
    },
    {
      id: 2,
      name: 'TypeScript',
      postCount: 986,
      followCount: 4321,
      isHot: true,
    },
    {
      id: 3,
      name: 'Vue.js',
      postCount: 1123,
      followCount: 5012,
      isHot: true,
    },
    {
      id: 4,
      name: 'Node.js',
      postCount: 875,
      followCount: 3456,
    },
    {
      id: 5,
      name: 'CSS动画',
      postCount: 567,
      followCount: 2134,
    },
    {
      id: 6,
      name: 'WebAssembly',
      postCount: 234,
      followCount: 1289,
      isNew: true,
    },
    {
      id: 7,
      name: '微前端',
      postCount: 345,
      followCount: 1876,
      isNew: true,
    },
    {
      id: 8,
      name: '前端安全',
      postCount: 432,
      followCount: 2143,
    },
  ];

  // 模拟活跃用户数据
  const activeUsers: UserData[] = [
    {
      id: 101,
      name: '前端探索者',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      postCount: 56,
      isActive: true,
    },
    {
      id: 102,
      name: 'TS专家',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      postCount: 42,
      isActive: true,
    },
    {
      id: 103,
      name: 'React达人',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      postCount: 38,
      isActive: true,
    },
    {
      id: 104,
      name: '工程化爱好者',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      postCount: 29,
    },
    {
      id: 105,
      name: '性能优化专家',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      postCount: 27,
    },
  ];

  // 渲染帖子列表项
  const renderPostItem = (item: PostData) => (
    <List.Item
      key={item.id}
      className={`${item.isTop ? 'bg-blue-50' : ''} rounded-lg transition-all hover:shadow-md`}
      actions={[
        <Space>
          <EyeOutlined /> {item.viewCount}
        </Space>,
        <Space>
          <LikeOutlined /> {item.likeCount}
        </Space>,
        <Space>
          <MessageOutlined /> {item.commentCount}
        </Space>,
        <Space>
          <ShareAltOutlined /> 分享
        </Space>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={item.author.avatar} icon={<UserOutlined />} />}
        title={
          <div className="flex items-center">
            <Link to={`/community/post/${item.id}`} className="text-lg font-medium hover:text-primary-500">
              {item.title}
            </Link>
            {item.isTop && <Tag color="blue" className="ml-2">置顶</Tag>}
            {item.isHot && <Tag color="red" className="ml-2">热门</Tag>}
          </div>
        }
        description={
          <div>
            <div className="mb-2">
              <Link to={`/community/user/${item.author.id}`} className="text-gray-600 hover:text-primary-500 mr-2">
                {item.author.name}
              </Link>
              <span className="text-gray-400">发布于 {item.createTime}</span>
            </div>
            <div className="mb-2">
              {item.tags.map(tag => (
                <Link to={`/community/tag/${tag}`} key={tag}>
                  <Tag color="default" className="mr-1 cursor-pointer hover:bg-gray-100">
                    {tag}
                  </Tag>
                </Link>
              ))}
            </div>
          </div>
        }
      />
      <div className="text-gray-600">{item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}</div>
    </List.Item>
  );

  return (
    <div className="community-home-page">
      <div className="mb-6">
        <Title level={2}>开发者社区</Title>
        <Text type="secondary">分享知识，解决问题，结交志同道合的开发者</Text>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧主内容区 */}
        <div className="w-full lg:w-3/4">
          <Card bordered={false} className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Search
                placeholder="搜索帖子、话题或用户"
                allowClear
                enterButton={<><SearchOutlined /> 搜索</>}
                size="large"
                className="max-w-md"
              />
              <Link to="/community/post/create">
                <Button type="primary" icon={<PlusOutlined />} size="large">
                  发布帖子
                </Button>
              </Link>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="最新发布" key="latest" />
              <TabPane tab="热门推荐" key="hot" />
              <TabPane tab="精华帖子" key="featured" />
              <TabPane tab="我的关注" key="following" />
            </Tabs>

            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showTotal: total => `共 ${total} 条帖子`,
              }}
              dataSource={postsData}
              renderItem={renderPostItem}
              loading={loading}
            />
          </Card>
        </div>

        {/* 右侧边栏 */}
        <div className="w-full lg:w-1/4">
          {/* 社区数据统计 */}
          <Card bordered={false} className="mb-6">
            <Title level={5} className="mb-4">社区数据</Title>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500">12,456</div>
                <div className="text-gray-500">活跃用户</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500">35,789</div>
                <div className="text-gray-500">帖子总数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500">128,967</div>
                <div className="text-gray-500">评论数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500">1,256</div>
                <div className="text-gray-500">今日新增</div>
              </div>
            </div>
          </Card>

          {/* 热门话题 */}
          <Card bordered={false} className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Title level={5} className="mb-0">热门话题</Title>
              <Link to="/community/topics" className="text-primary-500 hover:text-primary-600">
                查看全部
              </Link>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={topicsData.slice(0, 5)}
              renderItem={item => (
                <List.Item
                  className="hover:bg-gray-50 rounded-lg px-2 transition-all"
                  actions={[
                    <Button type="text" size="small">关注</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                        <Text strong className="text-primary-500">{item.name.substring(0, 1)}</Text>
                      </div>
                    }
                    title={
                      <Link to={`/community/topic/${item.id}`} className="font-medium">
                        {item.name}
                        {item.isHot && <FireOutlined className="ml-1 text-red-500" />}
                        {item.isNew && <Badge dot className="ml-1" />}
                      </Link>
                    }
                    description={
                      <div className="text-xs text-gray-500">
                        <span className="mr-3">{item.postCount} 篇帖子</span>
                        <span>{item.followCount} 人关注</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* 活跃用户 */}
          <Card bordered={false} className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Title level={5} className="mb-0">活跃用户</Title>
              <Link to="/community/users" className="text-primary-500 hover:text-primary-600">
                查看全部
              </Link>
            </div>
            <ActiveUserList users={activeUsers} />
          </Card>

          {/* 社区指南 */}
          <Card bordered={false}>
            <Title level={5} className="mb-4">社区指南</Title>
            <List
              size="small"
              dataSource={[
                { icon: <BookOutlined />, title: '社区规则', link: '/community/guidelines' },
                { icon: <StarOutlined />, title: '如何获得积分', link: '/community/points' },
                { icon: <RiseOutlined />, title: '等级体系说明', link: '/community/levels' },
              ]}
              renderItem={item => (
                <List.Item className="px-0 border-0">
                  <Link to={item.link} className="flex items-center text-gray-700 hover:text-primary-500">
                    <span className="mr-2">{item.icon}</span>
                    {item.title}
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityHomePage; 