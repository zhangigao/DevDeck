import React, { useState } from 'react';
import { Card, Avatar, Typography, Space, Tag, Button, Divider, Input, List, Tooltip, message, Modal, Select } from 'antd';
import { 
  LikeOutlined, 
  LikeFilled,
  StarOutlined, 
  StarFilled,
  MessageOutlined, 
  ShareAltOutlined, 
  UserOutlined,
  EyeOutlined,
  FlagOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface PostData {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
    level: number;
    postCount: number;
    joinDate: string;
  };
  createTime: string;
  updateTime?: string;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  tags: string[];
  isLiked?: boolean;
  isFavorited?: boolean;
}

interface CommentData {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
    level: number;
  };
  createTime: string;
  likeCount: number;
  isLiked?: boolean;
  replies?: CommentData[];
}

// 添加一个自定义的Comment组件
interface CommentProps {
  author: React.ReactNode;
  avatar: React.ReactNode;
  content: React.ReactNode;
  datetime?: React.ReactNode;
  actions?: React.ReactNode[];
  children?: React.ReactNode;
}

const Comment: React.FC<CommentProps> = ({ 
  author, 
  avatar, 
  content, 
  datetime, 
  actions = [], 
  children 
}) => {
  return (
    <div className="comment-container mb-4">
      <div className="flex">
        <div className="mr-3">{avatar}</div>
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-bold mr-2">{author}</span>
            {datetime && <span className="text-gray-500 text-sm">{datetime}</span>}
          </div>
          <div className="my-2">{content}</div>
          {actions.length > 0 && (
            <div className="flex gap-4 my-2">
              {actions.map((action, index) => (
                <span key={index} className="cursor-pointer text-gray-500 hover:text-primary-500">
                  {action}
                </span>
              ))}
            </div>
          )}
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [replyToComment, setReplyToComment] = useState<number | null>(null);
  const [replyValue, setReplyValue] = useState('');

  // 模拟帖子数据
  const postData: PostData = {
    id: Number(postId) || 1,
    title: 'React性能优化实践总结',
    content: `
在开发大型React应用时，性能优化是一个不可忽视的问题。本文将分享一些实用的React性能优化技巧，帮助你的应用运行得更加流畅。

## 1. 使用React.memo来避免不必要的重渲染

\`\`\`jsx
const MyComponent = React.memo(function MyComponent(props) {
  /* 渲染使用props */
  return (
    <div>{props.name}</div>
  );
});
\`\`\`

React.memo是一个高阶组件，它与React.PureComponent类似，但它适用于函数组件而非class组件。如果你的函数组件在相同props的情况下渲染相同的结果，你可以通过将其包装在React.memo中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。

## 2. 使用useMemo和useCallback

\`\`\`jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => { doSomething(a, b); }, [a, b]);
\`\`\`

useMemo用于记忆计算结果，而useCallback用于记忆函数。这两个Hook都可以帮助避免在每次渲染时都进行昂贵的计算或创建新的函数实例。

## 3. 避免在渲染期间进行昂贵操作

避免在组件的渲染过程中进行复杂计算、API调用或DOM操作。可以考虑使用useEffect或useMemo来处理这些操作。

## 4. 使用虚拟列表优化长列表渲染

当需要渲染大量数据时，考虑使用react-window或react-virtualized等库来实现虚拟滚动，只渲染用户可见区域的内容。

## 5. 拆分大型组件

将大型组件拆分为多个小型组件，可以更精确地控制哪些部分需要重新渲染，从而提高整体性能。

## 6. 使用React DevTools进行性能分析

React DevTools的Profiler功能可以帮助你识别应用中的性能瓶颈，找出需要优化的组件。

这些优化技巧可以帮助你的React应用运行得更加高效。但请记住，过早优化是万恶之源，在确认存在性能问题之前，先保持代码的可读性和可维护性。
    `,
    author: {
      id: 103,
      name: 'React达人',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      level: 4,
      postCount: 56,
      joinDate: '2022-03-15',
    },
    createTime: '2023-11-23 16:45:12',
    updateTime: '2023-11-24 09:12:34',
    viewCount: 756,
    likeCount: 38,
    favoriteCount: 24,
    commentCount: 15,
    tags: ['React', '性能优化', '前端'],
    isLiked: false,
    isFavorited: false,
  };

  // 模拟评论数据
  const commentsData: CommentData[] = [
    {
      id: 1,
      content: '非常感谢分享！我正在开发一个复杂的React应用，这些优化技巧对我很有帮助。',
      author: {
        id: 201,
        name: '前端小白',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        level: 2,
      },
      createTime: '2023-11-23 17:12:34',
      likeCount: 5,
      isLiked: false,
    },
    {
      id: 2,
      content: '关于useMemo和useCallback的使用，你有没有遇到过一些边界情况或者需要注意的地方？',
      author: {
        id: 202,
        name: 'React进阶者',
        avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
        level: 3,
      },
      createTime: '2023-11-23 18:23:45',
      likeCount: 3,
      isLiked: false,
      replies: [
        {
          id: 21,
          content: '我觉得需要注意的是不要过度使用useMemo和useCallback，只在真正需要优化性能的地方使用它们。过度使用反而会导致代码可读性下降。',
          author: {
            id: 103,
            name: 'React达人',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            level: 4,
          },
          createTime: '2023-11-23 19:12:34',
          likeCount: 7,
          isLiked: true,
        },
        {
          id: 22,
          content: '另外，useMemo和useCallback本身也有开销，如果计算或函数本身非常简单，可能优化的收益小于使用这些Hook的成本。',
          author: {
            id: 203,
            name: 'JS专家',
            avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
            level: 4,
          },
          createTime: '2023-11-23 20:34:56',
          likeCount: 4,
          isLiked: false,
        }
      ]
    },
    {
      id: 3,
      content: '对于虚拟列表，你更推荐react-window还是react-virtualized？有什么区别吗？',
      author: {
        id: 204,
        name: '列表优化师',
        avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
        level: 3,
      },
      createTime: '2023-11-24 08:12:34',
      likeCount: 2,
      isLiked: false,
    },
  ];

  // 处理点赞
  const handleLike = () => {
    if (!isLoggedIn) {
      message.warning('请先登录');
      return;
    }

    // TODO: 发送API请求，更新点赞状态
    message.success(postData.isLiked ? '已取消点赞' : '点赞成功');
  };

  // 处理收藏
  const handleFavorite = () => {
    if (!isLoggedIn) {
      message.warning('请先登录');
      return;
    }

    // TODO: 发送API请求，更新收藏状态
    message.success(postData.isFavorited ? '已取消收藏' : '收藏成功');
  };

  // 处理评论提交
  const handleCommentSubmit = () => {
    if (!isLoggedIn) {
      message.warning('请先登录');
      return;
    }

    if (!commentValue.trim()) {
      message.warning('评论内容不能为空');
      return;
    }

    setSubmitting(true);

    // 模拟API请求
    setTimeout(() => {
      // TODO: 发送API请求，提交评论
      message.success('评论发布成功');
      setCommentValue('');
      setSubmitting(false);
    }, 1000);
  };

  // 处理回复提交
  const handleReplySubmit = (commentId: number) => {
    if (!isLoggedIn) {
      message.warning('请先登录');
      return;
    }

    if (!replyValue.trim()) {
      message.warning('回复内容不能为空');
      return;
    }

    setSubmitting(true);

    // 模拟API请求
    setTimeout(() => {
      // TODO: 发送API请求，提交回复
      message.success('回复发布成功');
      setReplyValue('');
      setReplyToComment(null);
      setSubmitting(false);
    }, 1000);
  };

  // 举报帖子
  const handleReport = () => {
    if (!isLoggedIn) {
      message.warning('请先登录');
      return;
    }

    Modal.confirm({
      title: '举报帖子',
      icon: <WarningOutlined />,
      content: (
        <div>
          <p>您确定要举报该帖子吗？</p>
          <Select placeholder="请选择举报原因" style={{ width: '100%', marginTop: 16 }}>
            <Option value="spam">垃圾广告</Option>
            <Option value="abuse">辱骂/攻击</Option>
            <Option value="inappropriate">不适当内容</Option>
            <Option value="copyright">侵犯版权</Option>
            <Option value="other">其他原因</Option>
          </Select>
          <TextArea
            placeholder="请详细描述举报原因（选填）"
            rows={4}
            style={{ marginTop: 16 }}
          />
        </div>
      ),
      okText: '提交举报',
      cancelText: '取消',
      onOk() {
        message.success('举报已提交，我们会尽快处理');
      },
    });
  };

  // 渲染Markdown内容
  const renderMarkdownContent = () => {
    // 简单处理Markdown格式
    const processedContent = postData.content
      .replace(/## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/\`\`\`(jsx|javascript|typescript|css|html)([\s\S]*?)\`\`\`/gm, 
        (_, lang, code) => `<pre class="language-${lang} bg-gray-100 p-4 rounded-lg overflow-auto my-4"><code>${code}</code></pre>`)
      .replace(/\`(.*?)\`/gm, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .split('\n\n').map((paragraph, idx) => 
        paragraph.startsWith('<h2>') || paragraph.startsWith('<pre') 
          ? paragraph 
          : `<p>${paragraph}</p>`
      ).join('');

    return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
  };

  return (
    <div className="post-detail-page">
      <Card bordered={false} className="mb-6">
        <div className="mb-4">
          <Title level={2}>{postData.title}</Title>
          <div className="flex items-center mb-4">
            <Link to={`/community/user/${postData.author.id}`}>
              <Avatar 
                src={postData.author.avatar} 
                icon={<UserOutlined />} 
                size="large"
                className="mr-2"
              />
            </Link>
            <div>
              <div className="flex items-center">
                <Link to={`/community/user/${postData.author.id}`} className="font-medium mr-2">
                  {postData.author.name}
                </Link>
                <Tag color="blue">Lv.{postData.author.level}</Tag>
              </div>
              <div className="text-xs text-gray-500">
                发布于 {postData.createTime}
                {postData.updateTime && ` · 编辑于 ${postData.updateTime}`}
              </div>
            </div>
          </div>
          <div className="mb-4">
            {postData.tags.map(tag => (
              <Link to={`/community/tag/${tag}`} key={tag}>
                <Tag color="default" className="mr-1 cursor-pointer">
                  {tag}
                </Tag>
              </Link>
            ))}
          </div>
        </div>

        <div className="post-content prose max-w-none mb-6">
          {renderMarkdownContent()}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center">
            <Space>
              <Button 
                type={postData.isLiked ? 'primary' : 'default'} 
                icon={postData.isLiked ? <LikeFilled /> : <LikeOutlined />}
                onClick={handleLike}
              >
                点赞 {postData.likeCount}
              </Button>
              <Button 
                type={postData.isFavorited ? 'primary' : 'default'} 
                icon={postData.isFavorited ? <StarFilled /> : <StarOutlined />}
                onClick={handleFavorite}
              >
                收藏 {postData.favoriteCount}
              </Button>
              <Button icon={<MessageOutlined />}>
                评论 {postData.commentCount}
              </Button>
              <Button icon={<ShareAltOutlined />}>
                分享
              </Button>
            </Space>
          </div>
          <div>
            <Button 
              icon={<FlagOutlined />} 
              type="text" 
              danger
              onClick={handleReport}
            >
              举报
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-gray-500 text-sm">
          <div>
            <EyeOutlined className="mr-1" /> 已有 {postData.viewCount} 次浏览
          </div>
          <div>
            {isLoggedIn && postData.author.id === user?.id && (
              <Space>
                <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
                <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
              </Space>
            )}
          </div>
        </div>
      </Card>

      <Card bordered={false} className="mb-6">
        <div className="flex items-center mb-4">
          <Title level={4} className="mb-0 mr-2">作者信息</Title>
          <Button type="primary" size="small">关注作者</Button>
        </div>
        <div className="flex items-center">
          <Link to={`/community/user/${postData.author.id}`}>
            <Avatar 
              src={postData.author.avatar} 
              icon={<UserOutlined />} 
              size={64}
              className="mr-4"
            />
          </Link>
          <div>
            <Link to={`/community/user/${postData.author.id}`} className="text-lg font-medium">
              {postData.author.name}
            </Link>
            <div className="text-gray-500">
              <Tag color="blue">Lv.{postData.author.level}</Tag>
              <span className="ml-2">已发布 {postData.author.postCount} 篇文章</span>
            </div>
            <div className="text-gray-500">
              {`${dayjs(postData.author.joinDate).format('YYYY年MM月DD日')} 加入`}
            </div>
          </div>
        </div>
      </Card>

      <Card bordered={false} id="comments">
        <Title level={4} className="mb-4">评论 ({postData.commentCount})</Title>
        
        {isLoggedIn ? (
          <div className="mb-6">
            <div className="flex items-start mb-3">
              <Avatar 
                src={user?.avatarUrl} 
                icon={<UserOutlined />} 
                className="mr-3 mt-1"
              />
              <div className="flex-1">
                <TextArea 
                  rows={3} 
                  placeholder="添加评论..." 
                  value={commentValue}
                  onChange={e => setCommentValue(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                type="primary" 
                loading={submitting}
                onClick={handleCommentSubmit}
                disabled={!commentValue.trim()}
              >
                发表评论
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-6 text-center py-4 bg-gray-50 rounded-lg">
            <Text type="secondary">请 <Link to="/auth/login" className="text-primary-500">登录</Link> 后发表评论</Text>
          </div>
        )}

        <List
          dataSource={commentsData}
          itemLayout="vertical"
          renderItem={comment => (
            <Comment
              author={
                <Link to={`/community/user/${comment.author.id}`} className="font-medium">
                  {comment.author.name}
                  <Tag color="blue" className="ml-1">Lv.{comment.author.level}</Tag>
                </Link>
              }
              avatar={
                <Link to={`/community/user/${comment.author.id}`}>
                  <Avatar src={comment.author.avatar} icon={<UserOutlined />} />
                </Link>
              }
              content={<p>{comment.content}</p>}
              datetime={
                <Tooltip title={comment.createTime}>
                  <span>{dayjs(comment.createTime).fromNow()}</span>
                </Tooltip>
              }
              actions={[
                <span key="like" onClick={() => console.log('like comment', comment.id)}>
                  {comment.isLiked ? <LikeFilled /> : <LikeOutlined />}
                  <span className="ml-1">{comment.likeCount}</span>
                </span>,
                <span key="reply" onClick={() => setReplyToComment(
                  replyToComment === comment.id ? null : comment.id
                )}>
                  <MessageOutlined />
                  <span className="ml-1">回复</span>
                </span>,
              ]}
            >
              {/* 回复表单 */}
              {replyToComment === comment.id && isLoggedIn && (
                <div className="mb-4">
                  <div className="flex items-start mb-3">
                    <Avatar 
                      src={user?.avatarUrl} 
                      icon={<UserOutlined />} 
                      size="small"
                      className="mr-2 mt-1"
                    />
                    <div className="flex-1">
                      <TextArea 
                        rows={2} 
                        placeholder={`回复 ${comment.author.name}...`} 
                        value={replyValue}
                        onChange={e => setReplyValue(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      size="small"
                      className="mr-2"
                      onClick={() => setReplyToComment(null)}
                    >
                      取消
                    </Button>
                    <Button 
                      type="primary" 
                      size="small"
                      loading={submitting}
                      onClick={() => handleReplySubmit(comment.id)}
                      disabled={!replyValue.trim()}
                    >
                      回复
                    </Button>
                  </div>
                </div>
              )}

              {/* 回复列表 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mt-2">
                  {comment.replies.map(reply => (
                    <Comment
                      key={reply.id}
                      author={
                        <Link to={`/community/user/${reply.author.id}`} className="font-medium">
                          {reply.author.name}
                          <Tag color="blue" className="ml-1">Lv.{reply.author.level}</Tag>
                        </Link>
                      }
                      avatar={
                        <Link to={`/community/user/${reply.author.id}`}>
                          <Avatar src={reply.author.avatar} icon={<UserOutlined />} size="small" />
                        </Link>
                      }
                      content={<p>{reply.content}</p>}
                      datetime={
                        <Tooltip title={reply.createTime}>
                          <span>{dayjs(reply.createTime).fromNow()}</span>
                        </Tooltip>
                      }
                      actions={[
                        <span key="like" onClick={() => console.log('like reply', reply.id)}>
                          {reply.isLiked ? <LikeFilled /> : <LikeOutlined />}
                          <span className="ml-1">{reply.likeCount}</span>
                        </span>,
                      ]}
                    />
                  ))}
                </div>
              )}
            </Comment>
          )}
        />
      </Card>
    </div>
  );
};

export default PostDetailPage; 