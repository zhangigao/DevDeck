import { request } from './config';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  sortWeight: number;
  description?: string;
  icon?: string;
  isEnabled: string;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
  questionCount?: number;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  parentId?: number;
  sortWeight: number;
  description?: string;
  icon?: string;
  isEnabled?: string;
}

export interface UpdateCategoryRequest {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  sortWeight: number;
  description?: string;
  icon?: string;
  isEnabled: string;
}

// 获取分类树形结构
export const getCategoryTree = (): Promise<ApiResponse<Category[]>> => {
  return request.get('/api/categories/tree');
};

// 获取启用的分类列表
export const getEnabledCategories = (): Promise<ApiResponse<Category[]>> => {
  return request.get('/api/categories/enabled');
};

// 根据ID获取分类详情
export const getCategoryById = (id: number): Promise<ApiResponse<Category>> => {
  return request.get(`/api/categories/${id}`);
};

// 根据slug获取分类
export const getCategoryBySlug = (slug: string): Promise<ApiResponse<Category>> => {
  return request.get(`/api/categories/slug/${slug}`);
};

// 创建分类
export const createCategory = (data: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
  return request.post('/api/categories', data);
};

// 更新分类
export const updateCategory = (id: number, data: UpdateCategoryRequest): Promise<ApiResponse<Category>> => {
  return request.put(`/api/categories/${id}`, data);
};

// 删除分类
export const deleteCategory = (id: number): Promise<ApiResponse<any>> => {
  return request.delete(`/api/categories/${id}`);
};

// 检查slug是否唯一
export const checkSlugUnique = (slug: string, excludeId?: number): Promise<ApiResponse<boolean>> => {
  const params = excludeId ? { slug, excludeId } : { slug };
  return request.get('/api/categories/check-slug', { params });
}; 