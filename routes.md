# Dev-Deck 路由访问指南

## 前端路由访问路径

### 主要页面路由
- 首页: `/`
- 刷题页面: `/quiz`
- 分类题目页面: `/category/:categoryId`（例如：`/category/1`）
- 个人资料页面: `/profile`（需要登录）

### 社区路由
- 社区首页: `/community`
- 帖子详情页: `/community/post/:postId`（例如：`/community/post/1`）

### 认证相关路由
- 登录页: `/auth/login`
- 注册页: `/auth/register`
- 找回密码页: `/auth/forgot-password`

### 管理后台路由
- 管理后台首页/仪表盘: `/admin/dashboard`
- 用户管理: `/admin/user-list`
- 角色管理: `/admin/user-roles`
- 头像审核: `/admin/avatar-review`

## 访问说明

1. **普通用户访问**：
   - 所有公开页面可直接访问
   - 需要登录才能访问个人资料页面 `/profile`

2. **管理员访问**：
   - 管理员可以访问所有页面，包括管理后台页面
   - 管理后台入口：`/admin` 或 `/admin/dashboard`

## 测试访问说明

我们已修复了路由问题，并且临时设置了：
- `PrivateRoute` 组件中 `isLoggedIn = true`，确保可以访问需要登录的页面
- `AdminRoute` 组件中 `isAdmin = true`，确保可以访问管理后台页面

因此，现在应该可以正常访问所有路由。如果之后需要实现真实的权限验证，请修改这两个组件，连接到实际的用户认证系统。 