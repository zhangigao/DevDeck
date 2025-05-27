import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createQuestion,
  CreateQuestionRequest,
  QuestionType,
  QuestionDifficulty
} from '../../api/questionApi';
import { getEnabledCategories, Category } from '../../api/categoryApi';

const CreateQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateQuestionRequest>({
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
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getEnabledCategories();
      if (response.data.code === 200) {
        setCategories(response.data.data);
        if (response.data.data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: response.data.data[0].id }));
        }
      }
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content || !formData.categoryId) {
      alert('请填写必填字段');
      return;
    }

    setLoading(true);
    try {
      const response = await createQuestion(formData);
      if (response.data.code === 200) {
        alert('题目创建成功');
        navigate('/questions/my');
      } else {
        alert(response.data.message || '创建失败');
      }
    } catch (error) {
      console.error('创建题目失败:', error);
      alert('创建题目失败');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
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
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">创建题目</h1>
            <p className="text-gray-600">创建新的题目，支持多种题型</p>
          </div>

          {/* 表单 */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 基本信息 */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">基本信息</h2>
          </div>

                <div>
                  <label className="block text-sm font-medium mb-2">题目标题 *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入题目标题"
                    required
                  />
                        </div>

                <div>
                  <label className="block text-sm font-medium mb-2">题目标识 *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="题目的URL友好标识"
                    required
                      />
                </div>
                    
                <div>
                  <label className="block text-sm font-medium mb-2">分类 *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {flattenCategories(categories).map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">题目类型 *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    {Object.values(QuestionType).map(type => (
                      <option key={type.code} value={type.code}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">难度 *</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(QuestionDifficulty).map(difficulty => (
                      <option key={difficulty.code} value={difficulty.code}>{difficulty.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">题目来源</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="题目来源，如书籍、网站等"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">题目内容 *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={8}
                    placeholder="输入题目内容，支持HTML格式"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">答案模板</label>
                  <textarea
                    value={formData.answerTemplate}
                    onChange={(e) => setFormData({...formData, answerTemplate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="答案模板或格式说明"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">正确答案</label>
                  <textarea
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="正确答案内容"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">解题提示</label>
                  <textarea
                    value={formData.hint}
                    onChange={(e) => setFormData({...formData, hint: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="解题提示信息"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex space-x-6">
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
                      立即发布
                    </label>
                  </div>
                </div>
              </div>
            
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/questions/my')}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? '创建中...' : '创建题目'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestionPage; 