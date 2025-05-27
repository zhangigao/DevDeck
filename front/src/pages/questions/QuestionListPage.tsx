import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getQuestionPage, 
  getQuestionsByCategory,
  getQuestionById,
  Question,
  QuestionPageRequest,
  QuestionType,
  QuestionDifficulty,
  PageResult
} from '../../api/questionApi';
import { getEnabledCategories, Category } from '../../api/categoryApi';
import { Modal, Button, Spin, Tag, Divider, Typography } from 'antd';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const QuestionListPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<PageResult<Question>>({
    records: [],
    total: 0,
    size: 10,
    current: 1,
    pages: 0
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<QuestionPageRequest>({
    page: 1,
    size: 12,
    categoryId: categoryId ? Number(categoryId) : undefined,
    isEnabled: true,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    loadQuestions();
    loadCategories();
  }, [searchParams]);

  useEffect(() => {
    if (categoryId) {
      setSearchParams(prev => ({
        ...prev,
        categoryId: Number(categoryId),
        page: 1
      }));
    }
  }, [categoryId]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await getQuestionPage(searchParams);
      console.log('题目列表响应:', response);
      if (response.code === 200) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.error('加载题目失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getEnabledCategories();
      console.log('分类列表响应:', response);
      if (response.code === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const handleSearch = () => {
    setSearchParams({
      ...searchParams,
      page: 1
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({
      ...searchParams,
      page
    });
  };

  // 处理题目点击，显示详情
  const handleQuestionClick = async (question: Question) => {
    try {
      setSelectedQuestion(question);
      setDetailVisible(true);
      setDetailLoading(true);
      
      // 获取完整的题目详情
      const response = await getQuestionById(question.id);
      if (response.code === 200) {
        setSelectedQuestion(response.data);
      }
    } catch (error) {
      console.error('加载题目详情失败:', error);
    } finally {
      setDetailLoading(false);
    }
  };
  
  // 关闭详情模态框
  const handleCloseDetail = () => {
    setDetailVisible(false);
    setSelectedQuestion(null);
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      case 4: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: number) => {
    switch (type) {
      case 1: return '📝'; // 单选
      case 2: return '☑️'; // 多选
      case 3: return '✏️'; // 填空
      case 4: return '💻'; // 编程
      case 5: return '🎨'; // 设计
      case 6: return '💭'; // 问答
      default: return '❓';
    }
  };

  const flattenCategories = (categoryList: Category[]): Category[] => {
    const result: Category[] = [];
    const flatten = (categories: Category[]) => {
      categories.forEach(category => {
        result.push(category);
        if (category.children) {
          flatten(category.children);
        }
      });
    };
    flatten(categoryList);
    return result;
  };

  const getCurrentCategoryName = () => {
    if (!categoryId) return '全部题目';
    const category = flattenCategories(categories).find(c => c.id === Number(categoryId));
    return category ? category.name : '未知分类';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getCurrentCategoryName()}
          </h1>
          <p className="text-gray-600">
            共找到 {questions.total} 道题目
          </p>
        </div>

        {/* 筛选栏 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">搜索题目</label>
              <input
                type="text"
                value={searchParams.title || ''}
                onChange={(e) => setSearchParams({...searchParams, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入题目标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">分类</label>
              <select
                value={searchParams.categoryId || ''}
                onChange={(e) => {
                  const newCategoryId = e.target.value ? Number(e.target.value) : undefined;
                  setSearchParams({...searchParams, categoryId: newCategoryId});
                  if (newCategoryId) {
                    navigate(`/questions/category/${newCategoryId}`);
                  } else {
                    navigate('/questions');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部分类</option>
                {flattenCategories(categories).map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">题目类型</label>
              <select
                value={searchParams.type || ''}
                onChange={(e) => setSearchParams({...searchParams, type: e.target.value ? Number(e.target.value) : undefined})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部类型</option>
                {Object.values(QuestionType).map(type => (
                  <option key={type.code} value={type.code}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">难度</label>
              <select
                value={searchParams.difficulty || ''}
                onChange={(e) => setSearchParams({...searchParams, difficulty: e.target.value ? Number(e.target.value) : undefined})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部难度</option>
                {Object.values(QuestionDifficulty).map(difficulty => (
                  <option key={difficulty.code} value={difficulty.code}>{difficulty.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              搜索
            </button>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">排序:</label>
              <select
                value={`${searchParams.sortBy}-${searchParams.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setSearchParams({...searchParams, sortBy, sortOrder});
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt-desc">最新发布</option>
                <option value="createdAt-asc">最早发布</option>
                <option value="difficulty-asc">难度从低到高</option>
                <option value="difficulty-desc">难度从高到低</option>
                <option value="title-asc">标题A-Z</option>
                <option value="title-desc">标题Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">加载中...</p>
          </div>
        )}

        {/* 题目列表 */}
        {!loading && (
          <>
            {questions.records.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.records.map(question => (
                  <div
                    key={question.id}
                    onClick={() => handleQuestionClick(question)}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getTypeIcon(question.type)}</span>
                        <span className="text-sm text-gray-500">{question.typeName}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficultyName}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {question.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {question.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {question.categoryName}
                      </span>
                      <div className="flex items-center space-x-4">
                        {question.isOfficial && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            官方
                          </span>
                        )}
                        <span>
                          {question.submitCount || 0} 次提交
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无题目</h3>
                <p className="text-gray-600">当前筛选条件下没有找到题目</p>
              </div>
            )}

            {/* 分页 */}
            {questions.total > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(questions.current - 1)}
                    disabled={questions.current <= 1}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    上一页
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, questions.pages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm rounded-lg ${
                            page === questions.current
                              ? 'bg-blue-500 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(questions.current + 1)}
                    disabled={questions.current >= questions.pages}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* 题目详情模态框 */}
        <Modal
          title={
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{selectedQuestion?.title}</span>
              <div className="flex items-center space-x-2">
                {selectedQuestion && (
                  <>
                    <Tag color="blue">{selectedQuestion.typeName}</Tag>
                    <Tag 
                      color={
                        selectedQuestion.difficulty === 1 ? 'success' : 
                        selectedQuestion.difficulty === 2 ? 'warning' : 
                        selectedQuestion.difficulty === 3 ? 'error' : 'purple'
                      }
                    >
                      {selectedQuestion.difficultyName}
                    </Tag>
                  </>
                )}
              </div>
            </div>
          }
          open={detailVisible}
          onCancel={handleCloseDetail}
          width={800}
          footer={[
            <Button key="close" onClick={handleCloseDetail}>
              关闭
            </Button>,
            <Button 
              key="solve" 
              type="primary" 
              onClick={() => navigate(`/quiz/${selectedQuestion?.slug}`)}
            >
              开始解题
            </Button>,
          ]}
        >
          {detailLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" />
              <span className="ml-3 text-gray-500">加载题目详情...</span>
            </div>
          ) : selectedQuestion ? (
            <div className="py-4">
              {/* 题目内容 */}
              <div className="mb-6">
                <Typography.Title level={5} className="mb-2">题目描述</Typography.Title>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <ReactMarkdown className="prose">
                    {selectedQuestion.content}
                  </ReactMarkdown>
                </div>
              </div>
              
              {/* 题目类型特定内容 */}
              {selectedQuestion.type === 1 && selectedQuestion.choices && (
                <div className="mb-6">
                  <Typography.Title level={5} className="mb-2">选项</Typography.Title>
                  <div className="space-y-2">
                    {JSON.parse(selectedQuestion.choices).map((choice: any) => (
                      <div key={choice.id} className="p-3 border rounded-lg flex items-center">
                        <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
                          {choice.id}
                        </span>
                        <span>{choice.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedQuestion.type === 2 && selectedQuestion.choices && (
                <div className="mb-6">
                  <Typography.Title level={5} className="mb-2">选项 (多选)</Typography.Title>
                  <div className="space-y-2">
                    {JSON.parse(selectedQuestion.choices).map((choice: any) => (
                      <div key={choice.id} className="p-3 border rounded-lg flex items-center">
                        <span className="inline-block w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-3">
                          {choice.id}
                        </span>
                        <span>{choice.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 提示信息 */}
              {selectedQuestion.hint && (
                <div className="mb-6">
                  <Typography.Title level={5} className="mb-2 flex items-center">
                    <QuestionCircleOutlined className="mr-2 text-yellow-500" />
                    解题提示
                  </Typography.Title>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                    {selectedQuestion.hint}
                  </div>
                </div>
              )}
              
              {/* 题目元数据 */}
              <Divider />
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">分类:</span> {selectedQuestion.categoryName}
                </div>
                <div>
                  <span className="font-medium">来源:</span> {selectedQuestion.source || '未知'}
                </div>
                <div>
                  <span className="font-medium">提交次数:</span> {selectedQuestion.submitCount || 0}
                </div>
                <div>
                  <span className="font-medium">创建时间:</span> {new Date(selectedQuestion.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              无法加载题目详情
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default QuestionListPage; 