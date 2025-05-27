import React, { useState, useEffect } from 'react';
import { 
  getCategoryTree, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../../api/categoryApi';

const CategoryManagePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: undefined as number | undefined,
    sortWeight: 0,
    description: '',
    icon: '',
    isEnabled: 'Y'
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategoryTree();
      console.log('分类数据响应:', response);
      if (response.code === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('加载分类失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      parentId: undefined,
      sortWeight: 0,
      description: '',
      icon: '',
      isEnabled: 'Y'
    });
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId,
      sortWeight: category.sortWeight,
      description: category.description || '',
      icon: category.icon || '',
      isEnabled: category.isEnabled
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        // 更新分类
        const updateData: UpdateCategoryRequest = {
          id: editingCategory.id,
          ...formData
        };
        const response = await updateCategory(editingCategory.id, updateData);
        if (response.code === 200) {
          alert('分类更新成功');
          setShowModal(false);
          loadCategories();
        } else {
          alert(response.message || '更新失败');
        }
      } else {
        // 创建分类
        const createData: CreateCategoryRequest = formData;
        const response = await createCategory(createData);
        if (response.code === 200) {
          alert('分类创建成功');
          setShowModal(false);
          loadCategories();
        } else {
          alert(response.message || '创建失败');
        }
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`确定要删除分类"${category.name}"吗？`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await deleteCategory(category.id);
      if (response.code === 200) {
        alert('分类删除成功');
        loadCategories();
      } else {
        alert(response.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryTree = (categoryList: Category[], level = 0) => {
    return categoryList.map(category => (
      <div key={category.id} className="border-b border-gray-200">
        <div className={`flex items-center justify-between p-4 ${level > 0 ? 'ml-8' : ''}`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {category.icon && <span className="text-xl">{category.icon}</span>}
              <span className="font-medium">{category.name}</span>
              <span className="text-sm text-gray-500">({category.slug})</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded ${
              category.isEnabled === 'Y' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {category.isEnabled === 'Y' ? '启用' : '禁用'}
            </span>
            <span className="text-sm text-gray-500">
              排序: {category.sortWeight}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(category)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              编辑
            </button>
            <button
              onClick={() => handleDelete(category)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              删除
            </button>
          </div>
        </div>
        {category.children && category.children.length > 0 && (
          <div className="ml-4">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
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
        <h1 className="text-2xl font-bold">分类管理</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          新建分类
        </button>
      </div>

      {loading && <div className="text-center py-4">加载中...</div>}

      <div className="bg-white rounded-lg shadow">
        {categories.length > 0 ? (
          renderCategoryTree(categories)
        ) : (
          <div className="p-8 text-center text-gray-500">暂无分类</div>
        )}
      </div>

      {/* 模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? '编辑分类' : '新建分类'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">分类名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">分类标识</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">父分类</label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({...formData, parentId: e.target.value ? Number(e.target.value) : undefined})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">无父分类</option>
                    {flattenCategories(categories).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">排序权重</label>
                  <input
                    type="number"
                    value={formData.sortWeight}
                    onChange={(e) => setFormData({...formData, sortWeight: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">图标</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="如: 📚"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">状态</label>
                  <select
                    value={formData.isEnabled}
                    onChange={(e) => setFormData({...formData, isEnabled: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Y">启用</option>
                    <option value="N">禁用</option>
                  </select>
                </div>
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

export default CategoryManagePage; 