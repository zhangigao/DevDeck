import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, Tabs, Typography, message, Upload, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { uploadToQiniu, generateAvatarKey } from '@/utils/uploadUtils';
import { updateUserProfile as updateProfile } from '@/store/slices/authSlice';
import { updateUserProfile, changePassword, updateAvatar } from '@/api/userApi';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        nickname: user.nickname || '',
      });
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 调用更新个人资料API，只更新昵称
      const response = await updateUserProfile({
        nickname: values.nickname
      });
      
      // 响应拦截器已经返回了response.data，所以可以直接访问code
      if ((response as any).code === 200) {
        // 更新Redux中的用户信息
        dispatch(updateProfile({
          nickname: values.nickname
        }));
        message.success('个人信息已更新');
      }
    } catch (error) {
      console.error('更新个人信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPasswordFinish = async (values: any) => {
    setLoading(true);
    try {
      // 调用修改密码API
      const response = await changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      
      // 响应拦截器已经返回了response.data，所以可以直接访问code
      if ((response as any).code === 200) {
        message.success('密码已更新');
        form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
      }
    } catch (error) {
      console.error('修改密码失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理头像上传
  const handleAvatarUpload = async (info: any) => {
    const file = info.file;
    
    if (!file) return;
    
    try {
      setUploadLoading(true);
      
      // 确保user和uuid存在
      if (!user || !user.uuid) {
        message.error('用户信息不完整，无法上传头像');
        return;
      }
      
      // 生成文件名
      const key = generateAvatarKey(user.uuid, file.name);
      
      // 上传到七牛云
      const result = await uploadToQiniu(file, key);
      
      // 获取图片URL
      const avatarUrl = result.url;
      console.log('上传成功，图片URL:', avatarUrl);
      
      // 调用后端接口更新头像
      const response = await updateAvatar(avatarUrl);
      
      if ((response as any).code === 200) {
        // 更新Redux中的用户信息
        dispatch(updateProfile({
          avatarUrl
        }));
        message.success('头像已更新');
      } else {
        message.error((response as any).message || '更新头像失败');
      }
    } catch (error) {
      console.error('上传头像失败:', error);
      message.error('上传头像失败，请重试');
    } finally {
      setUploadLoading(false);
    }
  };

  // 上传按钮
  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  return (
    <div className="profile-page">
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mr-6 mb-4 md:mb-0 relative">
            {uploadLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full z-10">
                <Spin />
              </div>
            )}
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={(file) => {
                // 验证文件类型
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('只能上传图片文件!');
                  return Upload.LIST_IGNORE;
                }
                
                // 验证文件大小
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error('图片大小不能超过2MB!');
                  return Upload.LIST_IGNORE;
                }
                
                // 手动处理上传
                handleAvatarUpload({ file });
                return false;
              }}
            >
              <div className="flex flex-col items-center justify-center" style={{ width: 120, height: 120 }}>
                {user?.avatarUrl ? (
                  <Avatar 
                    size={100} 
                    src={user.avatarUrl} 
                    alt="头像" 
                  />
                ) : (
                  <Avatar size={100} icon={<UserOutlined />} />
                )}
                <div className="mt-2 text-center">
                  <UploadOutlined /> 更换头像
                </div>
              </div>
            </Upload>
          </div>
          <div>
            <Title level={3}>个人中心</Title>
            <Text type="secondary">管理你的账户信息和偏好设置</Text>
          </div>
        </div>
      </Card>

      <Card>
        <Tabs defaultActiveKey="profile">
          <TabPane tab="基本信息" key="profile">
            <Form 
              layout="vertical" 
              onFinish={onFinish}
              form={form}
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} disabled />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input prefix={<MailOutlined />} disabled />
              </Form.Item>
              
              <Form.Item
                name="nickname"
                label="昵称"
                rules={[{ required: true, message: '请输入昵称' }]}
              >
                <Input prefix={<IdcardOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存更改
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="修改密码" key="password">
            <Form layout="vertical" onFinish={onPasswordFinish}>
              <Form.Item
                name="currentPassword"
                label="当前密码"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 8, message: '密码长度不能少于8个字符' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="确认新密码"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  更新密码
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfilePage; 