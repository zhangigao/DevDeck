// 路由检查脚本
// 此文件仅用于检查路由是否正确配置，不会在应用中使用

const routesToCheck = [
  { path: '/', name: '首页' },
  { path: '/quiz', name: '刷题页面' },
  { path: '/category/1', name: '分类题目页面' },
  { path: '/profile', name: '个人资料页面' },
  { path: '/community', name: '社区首页' },
  { path: '/community/post/1', name: '帖子详情页' },
  { path: '/admin', name: '管理后台首页' },
  { path: '/admin/dashboard', name: '管理后台仪表盘' },
  { path: '/admin/user-list', name: '用户管理' },
  { path: '/admin/user-roles', name: '角色管理' },
  { path: '/admin/avatar-review', name: '头像审核' },
];

// 如何使用:
// 1. 打开浏览器控制台
// 2. 复制以下代码到控制台执行
/*
async function checkRoutes() {
  for (const route of routesToCheck) {
    console.log(`检查路由: ${route.path} (${route.name})`);
    try {
      const response = await fetch(route.path);
      console.log(`状态: ${response.status} ${response.ok ? '✅' : '❌'}`);
    } catch (error) {
      console.error(`错误: ${error.message}`);
    }
  }
}
checkRoutes();
*/ 