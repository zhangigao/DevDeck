import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Avatar, 
  Button, 
  Input, 
  Tag, 
  Space, 
  Typography, 
  Tabs,
  Modal,
  Form,
  Select,
  message,
  Divider
} from 'antd';
import { 
  LikeOutlined, 
  MessageOutlined, 
  EyeOutlined, 
  PlusOutlined,
  SearchOutlined,
  FireOutlined,
  ClockCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 模拟数据接口
interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: string;
  };
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  isLiked: boolean;
  isStarred: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  postCount: number;
}

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('latest');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 模拟数据
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'React 18 新特性详解：Concurrent Features 深度解析',
      content: 'React 18 带来了许多令人兴奋的新特性，其中最重要的就是 Concurrent Features。本文将深入探讨这些新特性如何改变我们的开发方式...',
      author: {
        name: '前端大师',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        level: 'LV.8'
      },
      category: '前端开发',
      tags: ['React', 'JavaScript', '前端'],
      likes: 128,
      comments: 45,
      views: 1250,
      createdAt: '2024-01-15T10:30:00Z',
      isLiked: false,
      isStarred: true
    },
    {
      id: '2',
      title: 'Spring Boot 3.0 微服务架构最佳实践',
      content: '随着 Spring Boot 3.0 的发布，微服务架构又有了新的发展。本文将分享一些在实际项目中总结的最佳实践...',
      author: {
        name: 'Java架构师',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        level: 'LV.9'
      },
      category: '后端开发',
      tags: ['Spring Boot', 'Java', '微服务'],
      likes: 89,
      comments: 32,
      views: 890,
      createdAt: '2024-01-14T15:20:00Z',
      isLiked: true,
      isStarred: false
    },
    {
      id: '3',
      title: 'TypeScript 5.0 新特性一览',
      content: 'TypeScript 5.0 正式发布了！让我们来看看这个版本带来了哪些激动人心的新特性...',
      author: {
        name: 'TS专家',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
        level: 'LV.7'
      },
      category: '前端开发',
      tags: ['TypeScript', '前端', '编程语言'],
      likes: 156,
      comments: 67,
      views: 2100,
      createdAt: '2024-01-13T09:15:00Z',
      isLiked: false,
      isStarred: false
    }
  ];

  const mockCategories: Category[] = [
    { id: 'frontend', name: '前端开发', description: '前端技术讨论', postCount: 1250 },
    { id: 'backend', name: '后端开发', description: '后端技术分享', postCount: 980 },
    { id: 'mobile', name: '移动开发', description: '移动端开发技术', postCount: 650 },
    { id: 'devops', name: 'DevOps', description: '运维和部署相关', postCount: 420 },
    { id: 'ai', name: '人工智能', description: 'AI和机器学习', postCount: 380 },
    { id: 'career', name: '职业发展', description: '职业规划和经验分享', postCount: 720 }
  ];

  useEffect(() => {
    fetchPosts();
    setCategories(mockCategories);
  }, [activeTab, selectedCategory, searchKeyword]);

  const fetchPosts = async () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      let filteredPosts = [...mockPosts];
      
      // 根据分类筛选
      if (selectedCategory !== 'all') {
        const categoryName = categories.find(c => c.id === selectedCategory)?.name;
        filteredPosts = filteredPosts.filter(post => post.category === categoryName);
      }
      
      // 根据关键词搜索
      if (searchKeyword) {
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          post.content.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }
      
      // 根据排序方式排序
      switch (activeTab) {
        case 'hot':
          filteredPosts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
          break;
        case 'latest':
          filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          break;
      }
      
      setPosts(filteredPosts);
      setLoading(false);
    }, 500);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleStar = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isStarred: !post.isStarred }
        : post
    ));
  };

  const handleCreatePost = async (values: any) => {
    try {
      // TODO: 调用创建帖子API
      message.success('帖子发布成功！');
      setModalVisible(false);
      form.resetFields();
      fetchPosts();
    } catch (error) {
      console.error('发布帖子失败:', error);
    }
  };

  const renderPostItem = (post: Post) => (
    <List.Item
      key={post.id}
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(`/community/post/${post.id}`)}
    >
      <div className="w-full">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Avatar src={post.author.avatar} size="small" className="mr-2" />
              <Text strong className="mr-2">{post.author.name}</Text>
              <Tag color="blue" size="small">{post.author.level}</Tag>
              <Text type="secondary" className="ml-2">
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </div>
            
            <Title level={4} className="mb-2 hover:text-blue-600">
              {post.title}
            </Title>
            
            <Paragraph 
              ellipsis={{ rows: 2 }} 
              type="secondary" 
              className="mb-3"
            >
              {post.content}
            </Paragraph>
            
            <div className="flex items-center justify-between">
              <Space wrap>
                <Tag color="orange">{post.category}</Tag>
                {post.tags.map(tag => (
                  <Tag key={tag} color="default">{tag}</Tag>
                ))}
              </Space>
              
              <Space size="large">
                <Button 
                  type="text" 
                  icon={<EyeOutlined />}
                  size="small"
                >
                  {post.views}
                </Button>
                <Button 
                  type="text" 
                  icon={<LikeOutlined />}
                  className={post.isLiked ? 'text-red-500' : ''}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post.id);
                  }}
                >
                  {post.likes}
                </Button>
                <Button 
                  type="text" 
                  icon={<MessageOutlined />}
                  size="small"
                >
                  {post.comments}
                </Button>
                <Button 
                  type="text" 
                  icon={<StarOutlined />}
                  className={post.isStarred ? 'text-yellow-500' : ''}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStar(post.id);
                  }}
                />
              </Space>
            </div>
          </div>
        </div>
      </div>
    </List.Item>
  );

  const tabItems = [
    {
      key: 'latest',
      label: (
        <span>
          <ClockCircleOutlined />
          最新
        </span>
      ),
    },
    {
      key: 'hot',
      label: (
        <span>
          <FireOutlined />
          热门
        </span>
      ),
    },
  ];

  return (
    <div className="community-page">
      <div className="flex gap-6">
        {/* 左侧内容区 */}
        <div className="flex-1">
          <Card className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <Title level={3} className="mb-0">技术社区</Title>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
              >
                发布帖子
              </Button>
            </div>
            
            <div className="flex gap-4 mb-4">
              <Input.Search
                placeholder="搜索帖子..."
                allowClear
                style={{ width: 300 }}
                onSearch={setSearchKeyword}
                enterButton={<SearchOutlined />}
              />
              
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: 150 }}
              >
                <Option value="all">全部分类</Option>
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>
            
            <Tabs 
              items={tabItems}
              activeKey={activeTab}
              onChange={setActiveTab}
            />
          </Card>

          <Card>
            <List
              loading={loading}
              dataSource={posts}
              renderItem={renderPostItem}
              locale={{ emptyText: '暂无帖子' }}
            />
          </Card>
        </div>

        {/* 右侧边栏 */}
        <div className="w-80">
          <Card title="热门分类" className="mb-4">
            <List
              size="small"
              dataSource={categories}
              renderItem={category => (
                <List.Item className="flex justify-between">
                  <div>
                    <Text strong>{category.name}</Text>
                    <br />
                    <Text type="secondary" className="text-xs">
                      {category.description}
                    </Text>
                  </div>
                  <Tag color="blue">{category.postCount}</Tag>
                </List.Item>
              )}
            />
          </Card>

          <Card title="社区规则">
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 保持友善和尊重的交流氛围</p>
              <p>• 发布有价值的技术内容</p>
              <p>• 避免重复发布相同内容</p>
              <p>• 使用合适的标签和分类</p>
              <p>• 遵守法律法规和社区准则</p>
            </div>
          </Card>
        </div>
      </div>

      {/* 发布帖子模态框 */}
      <Modal
        title="发布新帖子"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreatePost}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入帖子标题' }]}
          >
            <Input placeholder="请输入帖子标题" />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
            rules={[{ required: true, message: '请选择标签' }]}
          >
            <Select
              mode="tags"
              placeholder="请输入或选择标签"
              tokenSeparators={[',']}
            >
              <Option value="React">React</Option>
              <Option value="Vue">Vue</Option>
              <Option value="JavaScript">JavaScript</Option>
              <Option value="TypeScript">TypeScript</Option>
              <Option value="Java">Java</Option>
              <Option value="Spring">Spring</Option>
              <Option value="Python">Python</Option>
              <Option value="Node.js">Node.js</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入帖子内容' }]}
          >
            <TextArea 
              rows={10} 
              placeholder="请输入帖子内容，支持 Markdown 格式"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space>
              <Button type="primary" htmlType="submit">
                发布
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CommunityPage; 