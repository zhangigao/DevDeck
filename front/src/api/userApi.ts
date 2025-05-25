import api from './config';

// 获取上传token
export const getUploadToken = async () => {
  return api.get('/user/upload-token');
};

// 更新用户头像
export const updateAvatar = async (avatarUrl: string) => {
  return api.post('/user/update-avatar', { avatarUrl });
};

// 更新用户资料
export const updateUserProfile = async (data: { nickname: string }) => {
  return api.put('/user/nickname', data);
};

// 修改密码
export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
  return api.put('/user/password', data);
};

// 验证码登录
export const loginByCode = async (data: { email: string; code: string }) => {
  return api.post('/user/login/code', data);
};

// 退出登录
export const logout = async () => {
  return api.get('/user/logout');
};

// 获取当前用户信息
export const getCurrentUser = async () => {
  return api.get('/user/current');
}; 