import { request } from './config';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface Question {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  content: string;
  answerTemplate?: string;
  correctAnswer?: any;
  type: number;
  typeName: string;
  difficulty: number;
  difficultyName: string;
  submitCount: number;
  hint?: string;
  source?: string;
  isOfficial: boolean;
  isEnabled: boolean;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionRequest {
  title: string;
  slug: string;
  content: string;
  answerTemplate?: string;
  correctAnswer?: any;
  type: number;
  difficulty: number;
  hint?: string;
  source?: string;
  isOfficial?: boolean;
  isEnabled?: boolean;
  categoryId: number;
}

export interface UpdateQuestionRequest {
  id: number;
  title: string;
  slug: string;
  content: string;
  answerTemplate?: string;
  correctAnswer?: any;
  type: number;
  difficulty: number;
  hint?: string;
  source?: string;
  isOfficial?: boolean;
  isEnabled?: boolean;
  categoryId: number;
}

export interface QuestionPageRequest {
  page?: number;
  size?: number;
  title?: string;
  categoryId?: number;
  type?: number;
  difficulty?: number;
  isOfficial?: boolean;
  isEnabled?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 分页查询题目
export const getQuestionPage = (params: QuestionPageRequest): Promise<ApiResponse<PageResult<Question>>> => {
  return request.get('/api/questions', { params });
};

// 根据分类ID获取题目列表
export const getQuestionsByCategory = (categoryId: number, page = 1, size = 10): Promise<ApiResponse<PageResult<Question>>> => {
  return request.get(`/api/questions/category/${categoryId}`, {
    params: { page, size }
  });
};

// 根据ID获取题目详情
export const getQuestionById = (id: number): Promise<ApiResponse<Question>> => {
  return request.get(`/api/questions/${id}`);
};

// 根据slug获取题目
export const getQuestionBySlug = (slug: string): Promise<ApiResponse<Question>> => {
  return request.get(`/api/questions/slug/${slug}`);
};

// 创建题目
export const createQuestion = (data: CreateQuestionRequest): Promise<ApiResponse<Question>> => {
  return request.post('/api/questions', data);
};

// 更新题目
export const updateQuestion = (id: number, data: UpdateQuestionRequest): Promise<ApiResponse<Question>> => {
  return request.put(`/api/questions/${id}`, data);
};

// 删除题目
export const deleteQuestion = (id: number): Promise<ApiResponse<any>> => {
  return request.delete(`/api/questions/${id}`);
};

// 检查slug是否唯一
export const checkQuestionSlugUnique = (slug: string, excludeId?: number): Promise<ApiResponse<boolean>> => {
  const params = excludeId ? { slug, excludeId } : { slug };
  return request.get('/api/questions/check-slug', { params });
};

// 增加题目提交次数
export const incrementSubmitCount = (id: number): Promise<ApiResponse<any>> => {
  return request.post(`/api/questions/${id}/submit`);
};

// 题目类型枚举
export const QuestionType = {
  SINGLE_CHOICE: { code: 1, name: '单选题' },
  MULTIPLE_CHOICE: { code: 2, name: '多选题' },
  FILL_BLANK: { code: 3, name: '填空题' },
  PROGRAMMING: { code: 4, name: '编程题' },
  DESIGN: { code: 5, name: '设计题' },
  ESSAY: { code: 6, name: '问答题' }
};

// 随机获取题目
export const getRandomQuestion = (): Promise<ApiResponse<Question>> => {
  return request.get('/api/questions/random');
};

// 获取多个随机题目
export const getRandomQuestions = (count: number = 5): Promise<ApiResponse<Question[]>> => {
  return request.get('/api/questions/random-batch', { params: { count } });
};

// 题目难度枚举
export const QuestionDifficulty = {
  EASY: { code: 1, name: '简单' },
  MEDIUM: { code: 2, name: '中等' },
  HARD: { code: 3, name: '困难' },
  HELL: { code: 4, name: '地狱' }
};

// 获取我的题目列表
export const getMyQuestions = (params: QuestionPageRequest): Promise<ApiResponse<PageResult<Question>>> => {
  return request.get('/api/questions/my', { params });
};

// 收藏题目
export const favoriteQuestion = (questionId: number): Promise<ApiResponse<any>> => {
  return request.post(`/api/favorites/questions/${questionId}`);
};

// 取消收藏题目
export const unfavoriteQuestion = (questionId: number): Promise<ApiResponse<any>> => {
  return request.delete(`/api/favorites/questions/${questionId}`);
};

// 检查收藏状态
export const checkFavoriteStatus = (questionId: number): Promise<ApiResponse<boolean>> => {
  return request.get(`/api/favorites/questions/${questionId}/status`);
};

// 获取我的收藏题目列表
export const getFavoriteQuestions = (params: QuestionPageRequest): Promise<ApiResponse<PageResult<Question>>> => {
  return request.get('/api/favorites/questions', { params });
}; 