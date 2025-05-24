import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 题目类型枚举
export enum QuestionType {
  SingleChoice = 'singleChoice',
  MultipleChoice = 'multipleChoice',
  TextAnswer = 'textAnswer',
}

// 选项类型
export interface Choice {
  id: string;
  content: string;
}

// 题目类型定义
export interface Question {
  id: number;
  uuid: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty: number;
  choices?: Choice[];
  correctAnswer: string | string[];
  hint?: string;
  source?: string;
  isOfficial: boolean;
  submitCount: number;
  tags: string[];
}

// 用户答案类型
export interface UserAnswer {
  questionId: number;
  answer: any;
  isCorrect: boolean;
  timestamp?: number;
}

// 题目状态类型定义
export interface QuestionsState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<number, UserAnswer>;
  favorites: number[];
  isLoading: boolean;
  error: string | null;
}

// 初始状态
const initialState: QuestionsState = {
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  favorites: [],
  isLoading: false,
  error: null,
};

// 创建 slice
const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    // 开始获取题目
    fetchQuestionsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    // 获取题目成功
    fetchQuestionsSuccess: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
      state.isLoading = false;
      state.currentQuestionIndex = 0;
    },
    // 获取题目失败
    fetchQuestionsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // 下一题
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    // 上一题
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    // 跳转到指定题目
    goToQuestion: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.questions.length) {
        state.currentQuestionIndex = index;
      }
    },
    // 提交答案
    submitAnswer: (state, action: PayloadAction<UserAnswer>) => {
      const { questionId, answer, isCorrect } = action.payload;
      state.userAnswers[questionId] = {
        questionId,
        answer,
        isCorrect,
        timestamp: Date.now(),
      };
    },
    // 收藏/取消收藏题目
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const questionId = action.payload;
      const index = state.favorites.indexOf(questionId);
      
      if (index === -1) {
        state.favorites.push(questionId);
      } else {
        state.favorites.splice(index, 1);
      }
    },
    // 清除用户答案
    clearUserAnswers: (state) => {
      state.userAnswers = {};
    },
    // 重置状态
    resetQuestions: () => initialState,
  },
});

// 导出 actions
export const {
  fetchQuestionsStart,
  fetchQuestionsSuccess,
  fetchQuestionsFailure,
  nextQuestion,
  prevQuestion,
  goToQuestion,
  submitAnswer,
  toggleFavorite,
  clearUserAnswers,
  resetQuestions,
} = questionsSlice.actions;

// 导出 reducer
export default questionsSlice.reducer; 