# Dev-Deck 刷题平台

Dev-Deck是一个专为开发者设计的智能刷题平台，帮助开发者高效学习、巩固知识，提升技术实力。

## 主要功能

- **账户体系**
  - 邮箱注册登录（验证码机制）
  - 密码找回功能
  - 用户基础信息（头像/昵称）

- **刷题功能**
  - 卡片堆叠式UI
    - 滑动切换题目（左滑跳过/右滑收藏）
    - 自适应题型展示
  - 题型支持
    - 单选题（单选按钮）
    - 多选题（多选checkbox）
    - 简答题（文本框输入）
  - 刷题模式
    - 随机模式（全题库随机）
    - 专项模式（按知识点筛选）
  - 答题反馈
    - 正确答案展示（提交后显示）
    - 解析内容展示（Markdown支持）
    - 错题自动收集

- **题目管理**
  - 用户上传题目
    - 题型选择
    - 知识点标签（多层级分类）
    - 题目内容（Markdown编辑器）
    - 参考答案与解析
  - 审核状态展示（待审/通过/拒绝）

## 技术栈

- **前端**
  - React + TypeScript
  - Ant Design（UI组件库）
  - Redux Toolkit（状态管理）
  - React Router（路由管理）
  - TailwindCSS（样式）
  - React Spring（动画效果）
  - React Swipeable（滑动手势）

## 开发指南

### 环境要求

- Node.js 16+
- npm 8+ 或 yarn 1.22+

### 安装依赖

```bash
npm install
# 或
yarn
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 测试账号

在开发阶段，您可以使用以下测试账号登录系统：

- 邮箱: admin@example.com
- 密码: password

## 项目结构

```
src/
├── api/         # API请求
├── assets/      # 静态资源
├── components/  # 通用组件
├── hooks/       # 自定义钩子
├── pages/       # 页面组件
├── store/       # Redux状态管理
├── styles/      # 全局样式
├── types/       # TypeScript类型定义
└── utils/       # 工具函数
```

## 开发规范

- 遵循TypeScript类型定义规范
- 组件使用函数式组件和React Hooks
- 使用ESLint和Prettier保持代码风格一致

## 后期计划

- 添加社区互动功能
- 支持更多题型（如编程题）
- 提供个人学习数据分析和可视化
- 增加竞赛和排行榜功能 