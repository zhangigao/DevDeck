import React, { useState, useEffect } from 'react';
import { 
  getQuestionPage, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion,
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionPageRequest,
  QuestionType,
  QuestionDifficulty,
  PageResult
} from '../../api/questionApi';
import { getEnabledCategories, Category } from '../../api/categoryApi';

const QuestionManagePage: React.FC = () => {
  const [questions, setQuestions] = useState<PageResult<Question>>({
    records: [],
    total: 0,
    size: 10,
    current: 1,
    pages: 0
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchParams, setSearchParams] = useState<QuestionPageRequest>({
    page: 1,
    size: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    answerTemplate: '',
    correctAnswer: '',
    type: 1,
    difficulty: 1,
    hint: '',
    source: '',
    isOfficial: false,
    isEnabled: true,
    categoryId: 0
  });

  useEffect(() => {
    loadQuestions();
    loadCategories();
  }, [searchParams]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await getQuestionPage(searchParams);
      console.log('题目数据响应:', response);
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
      console.log('分类数据响应:', response);
      if (response.code === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const handleCreate = () => {
    setEditingQuestion(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      answerTemplate: '',
      correctAnswer: '',
      type: 1,
      difficulty: 1,
      hint: '',
      source: '',
      isOfficial: false,
      isEnabled: true,
      categoryId: categories.length > 0 ? categories[0].id : 0
    });
    setShowModal(true);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      title: question.title,
      slug: question.slug,
      content: question.content,
      answerTemplate: question.answerTemplate || '',
      correctAnswer: question.correctAnswer || '',
      type: question.type,
      difficulty: question.difficulty,
      hint: question.hint || '',
      source: question.source || '',
      isOfficial: question.isOfficial,
      isEnabled: question.isEnabled,
      categoryId: question.categoryId
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingQuestion) {
        // 更新题目
        const updateData: UpdateQuestionRequest = {
          id: editingQuestion.id,
          ...formData
        };
        const response = await updateQuestion(editingQuestion.id, updateData);
        if (response.data.code === 200) {
          alert('题目更新成功');
          setShowModal(false);
          loadQuestions();
        } else {
          alert(response.data.message || '更新失败');
        }
      } else {
        // 创建题目
        const createData: CreateQuestionRequest = formData;
        const response = await createQuestion(createData);
        if (response.data.code === 200) {
          alert('题目创建成功');
          setShowModal(false);
          loadQuestions();
        } else {
          alert(response.data.message || '创建失败');
        }
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (question: Question) => {
    if (!confirm(`确定要删除题目"${question.title}"吗？`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await deleteQuestion(question.id);
      if (response.data.code === 200) {
        alert('题目删除成功');
        loadQuestions();
      } else {
        alert(response.data.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    } finally {
      setLoading(false);
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

  const getTypeOptions = () => {
    return Object.values(QuestionType).map(type => (
      <option key={type.code} value={type.code}>{type.name}</option>
    ));
  };

  const getDifficultyOptions = () => {
    return Object.values(QuestionDifficulty).map(difficulty => (
      <option key={difficulty.code} value={difficulty.code}>{difficulty.name}</option>
    ));
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">题目管理</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          新建题目
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">题目标题</label>
            <input
              type="text"
              value={searchParams.title || ''}
              onChange={(e) => setSearchParams({...searchParams, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="搜索题目标题"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">分类</label>
            <select
              value={searchParams.categoryId || ''}
              onChange={(e) => setSearchParams({...searchParams, categoryId: e.target.value ? Number(e.target.value) : undefined})}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部分类</option>
              {flattenCategories(categories).map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">题目类型</label>
            <select
              value={searchParams.type || ''}
              onChange={(e) => setSearchParams({...searchParams, type: e.target.value ? Number(e.target.value) : undefined})}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部类型</option>
              {getTypeOptions()}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">难度</label>
            <select
              value={searchParams.difficulty || ''}
              onChange={(e) => setSearchParams({...searchParams, difficulty: e.target.value ? Number(e.target.value) : undefined})}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部难度</option>
              {getDifficultyOptions()}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            搜索
          </button>
        </div>
      </div>

      {loading && <div className="text-center py-4">加载中...</div>}

      {/* 题目列表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">题目</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">难度</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交次数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questions.records.map(question => (
                <tr key={question.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{question.title}</div>
                      <div className="text-sm text-gray-500">{question.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {question.categoryName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {question.typeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      question.difficulty === 1 ? 'bg-green-100 text-green-800' :
                      question.difficulty === 2 ? 'bg-yellow-100 text-yellow-800' :
                      question.difficulty === 3 ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {question.difficultyName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      question.isEnabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {question.isEnabled ? '启用' : '禁用'}
                    </span>
                    {question.isOfficial && (
                      <span className="ml-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                        官方
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {question.submitCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(question)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(question)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {questions.total > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              共 {questions.total} 条记录，第 {questions.current} / {questions.pages} 页
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(questions.current - 1)}
                disabled={questions.current <= 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
              >
                上一页
              </button>
              <button
                onClick={() => handlePageChange(questions.current + 1)}
                disabled={questions.current >= questions.pages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingQuestion ? '编辑题目' : '新建题目'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">题目标题</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">题目标识</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">分类</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {flattenCategories(categories).map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">题目类型</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getTypeOptions()}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">难度</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getDifficultyOptions()}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">题目来源</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">题目内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">答案模板</label>
                <textarea
                  value={formData.answerTemplate}
                  onChange={(e) => setFormData({...formData, answerTemplate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">正确答案</label>
                <textarea
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">解题提示</label>
                <textarea
                  value={formData.hint}
                  onChange={(e) => setFormData({...formData, hint: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="mt-4 flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isOfficial}
                    onChange={(e) => setFormData({...formData, isOfficial: e.target.checked})}
                    className="mr-2"
                  />
                  官方题目
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isEnabled}
                    onChange={(e) => setFormData({...formData, isEnabled: e.target.checked})}
                    className="mr-2"
                  />
                  启用
                </label>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManagePage; 