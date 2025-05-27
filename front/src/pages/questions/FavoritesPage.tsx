import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getFavoriteQuestions,
  unfavoriteQuestion,
  Question,
  QuestionPageRequest,
  QuestionType,
  QuestionDifficulty,
  PageResult
} from '../../api/questionApi';
import { getEnabledCategories, Category } from '../../api/categoryApi';

const FavoritesPage: React.FC = () => {
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
  const [searchParams, setSearchParams] = useState<QuestionPageRequest>({
    page: 1,
    size: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    loadQuestions();
    loadCategories();
  }, [searchParams]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await getFavoriteQuestions(searchParams);
      if (response.data.code === 200) {
        setQuestions(response.data.data);
      }
    } catch (error) {
      console.error('加载收藏题目失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getEnabledCategories();
      if (response.data.code === 200) {
        setCategories(response.data.data);
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

  const handleQuestionClick = (question: Question) => {
    navigate(`/quiz/${question.slug}`);
  };

  const handleUnfavorite = async (question: Question) => {
    if (!confirm(`确定要取消收藏题目"${question.title}"吗？`)) {
      return;
    }

    try {
      const response = await unfavoriteQuestion(question.id);
      if (response.data.code === 200) {
        alert('取消收藏成功');
        loadQuestions();
      } else {
        alert(response.data.message || '取消收藏失败');
      }
    } catch (error) {
      console.error('取消收藏失败:', error);
      alert('取消收藏失败');
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的收藏</h1>
          <p className="text-gray-600">
            共收藏了 {questions.total} 道题目
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
                onChange={(e) => setSearchParams({...searchParams, categoryId: e.target.value ? Number(e.target.value) : undefined})}
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
          <div className="mt-4">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              搜索
            </button>
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
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
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
                    
                    <h3 
                      className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600"
                      onClick={() => handleQuestionClick(question)}
                    >
                      {question.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {question.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleQuestionClick(question)}
                        className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        开始答题
                      </button>
                      <button
                        onClick={() => handleUnfavorite(question)}
                        className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有收藏题目</h3>
                <p className="text-gray-600 mb-4">去题目库收藏一些感兴趣的题目吧！</p>
                <button
                  onClick={() => navigate('/questions')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  浏览题目库
                </button>
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
      </div>
    </div>
  );
};

export default FavoritesPage; 