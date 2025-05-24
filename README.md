# Dev-Deck 前端刷题平台

Dev-Deck是一个面向开发者的刷题和社区交流平台，提供题目练习、社区讨论以及完整的后台管理系统。

## 项目结构

```
quiz/
├── front/                # 前端代码
│   ├── src/              # 源代码
│   │   ├── components/   # 共用组件
│   │   ├── layouts/      # 布局组件
│   │   ├── pages/        # 页面组件
│   │   │   ├── admin/    # 后台管理页面
│   │   │   ├── auth/     # 认证页面
│   │   │   ├── community/# 社区页面
│   │   │   ├── quiz/     # 刷题页面
│   │   │   ├── user/     # 用户页面
│   │   ├── router/       # 路由配置
│   │   ├── store/        # 状态管理
│   │   ├── styles/       # 样式文件
│   │   ├── utils/        # 工具函数
│   └── package.json      # 前端依赖
│
└── dev-deck/             # 后端代码
    ├── src/              # 源代码
    │   ├── main/
    │   │   ├── java/org/zhj/devdeck/
    │   │   │   ├── controller/    # 控制器
    │   │   │   ├── service/       # 服务层
    │   │   │   ├── entity/        # 实体类
    │   │   │   ├── mapper/        # MyBatis映射
    │   │   │   ├── config/        # 配置类
    │   │   │   └── ...
    │   │   └── resources/        # 资源文件
    └── pom.xml                   # Maven依赖
```

## 功能特性

### 前端功能

1. **用户系统**
   - 登录/注册/找回密码
   - 个人资料管理
   - 权限控制

2. **刷题系统**
   - 题目列表和分类
   - 题目详情与解答
   - 进度追踪

3. **社区系统**
   - 帖子发布与浏览
   - 评论与回复
   - 点赞、收藏功能
   - 话题和标签

4. **后台管理系统**
   - 仪表盘数据统计
   - 用户管理
   - 角色与权限管理
   - 内容审核
   - 社区管理

### 后端功能

1. **用户认证与授权**
   - JWT认证
   - 基于角色的权限控制

2. **数据管理**
   - 用户数据
   - 题目数据
   - 社区内容
   - 审核系统

3. **性能与安全**
   - 数据缓存
   - 安全防护
   - 日志记录

## 技术栈

### 前端
- React + TypeScript
- Ant Design 组件库
- TailwindCSS 样式框架
- React Router 路由管理
- Redux 状态管理
- Axios 网络请求

### 后端
- Spring Boot
- Spring Security
- MyBatis
- MySQL 数据库
- Redis 缓存

## 快速开始

### 前端开发

```bash
# 进入前端目录
cd front

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 后端开发

```bash
# 进入后端目录
cd dev-deck

# 使用Maven编译
mvn clean package

# 运行Spring Boot应用
mvn spring-boot:run
```

## 路由说明

### 前端路由

- `/` - 首页
- `/quiz` - 刷题页面
- `/category/:categoryId` - 分类题目页面
- `/profile` - 个人资料页面
- `/community` - 社区首页
- `/community/post/:postId` - 帖子详情页
- `/admin` - 管理后台
  - `/admin/dashboard` - 仪表盘
  - `/admin/user-list` - 用户管理
  - `/admin/user-roles` - 角色管理
  - `/admin/avatar-review` - 头像审核

### 后端API

- `/auth/**` - 认证相关
- `/users/**` - 用户管理
- `/questions/**` - 题目管理
- `/community/**` - 社区相关
- `/admin/**` - 管理后台

## 数据库设计

### 主要表结构

1. **用户系统**
   - users - 用户信息
   - roles - 角色定义
   - user_roles - 用户角色关联
   - permissions - 权限定义
   - role_permissions - 角色权限关联

2. **刷题系统**
   - questions - 题目信息
   - question_categories - 题目分类
   - question_tags - 题目标签
   - user_progress - 用户做题进度

3. **社区系统**
   - posts - 帖子信息
   - comments - 评论信息
   - topics - 话题信息
   - likes - 点赞记录
   - favorites - 收藏记录
   - reports - 举报记录

4. **内容审核**
   - review_tasks - 审核任务
   - review_logs - 审核日志

## 贡献指南

1. Fork本项目
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个Pull Request

## 许可证

本项目采用MIT许可证 - 详情见LICENSE文件 