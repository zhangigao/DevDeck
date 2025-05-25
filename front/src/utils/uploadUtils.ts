import { getUploadToken as fetchUploadToken } from '@/api/userApi';
import { message } from 'antd';

// 获取七牛云上传凭证
export const getUploadToken = async () => {
  try {
    console.log('开始获取上传token...');
    
    // 检查localStorage中的token
    const localToken = localStorage.getItem('token');
    console.log('uploadUtils - localStorage中的token:', localToken);
    
    const response = await fetchUploadToken();
    console.log('获取到上传token响应:', response);
    
    if (!response.data) {
      message.error('获取上传凭证失败：服务器返回数据格式不正确');
      throw new Error('上传凭证返回数据格式不正确');
    }
    
    // 打印token的详细信息
    console.log('七牛云上传token:', response.data);
    console.log('token长度:', response.data.length);
    
    return response.data;
  } catch (error) {
    console.error('获取上传凭证失败:', error);
    message.error('获取上传凭证失败，请确认您已登录');
    throw error;
  }
};

// 上传文件到七牛云
export const uploadToQiniu = async (file: File, key: string) => {
  try {
    // 获取上传凭证
    const token = await getUploadToken();
    
    console.log('开始上传文件到七牛云...');
    console.log('文件信息:', { name: file.name, size: file.size, type: file.type });
    console.log('前端生成的key:', key);
    console.log('七牛云token:', token);
    
    // 使用FormData直接上传到七牛云
    const result = await uploadWithFormData(file, token, key);
    
    // 构建完整的图片URL
    const imageUrl = `http://swsrer8tf.hn-bkt.clouddn.com/${result.key}`;
    console.log('构建的图片URL:', imageUrl);
    
    return {
      ...result,
      url: imageUrl
    };
    
  } catch (error) {
    console.error('上传过程发生错误:', error);
    throw error;
  }
};

// 使用FormData直接上传到七牛云
async function uploadWithFormData(file: File, token: string, key: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('token', token);
  formData.append('key', key); // 使用前端生成的key
  
  console.log('使用FormData上传到七牛云');
  console.log('FormData内容:');
  for (let [formKey, value] of formData.entries()) {
    console.log(formKey, ':', value);
  }
  
  const response = await fetch('https://upload-z2.qiniup.com', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('上传失败响应:', errorText);
    throw new Error(`上传失败: ${response.status} ${response.statusText}`);
  }
  
  const result = await response.json();
  console.log('FormData上传完成:', result);
  return result;
}

// 生成用户头像的文件名
export const generateAvatarKey = (uuid: string, fileName: string) => {
  const fileExt = fileName.split('.').pop();
  return `avatars/${uuid}_${Date.now()}.${fileExt}`;
}; 