import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Checkbox, Tabs, Typography, Divider, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import api, { API_BASE_URL } from '@/api/config';
import axios from 'axios';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaUuid, setCaptchaUuid] = useState('');

  // 获取图形验证码
  const fetchCaptcha = async () => {
    try {
      setCaptchaLoading(true);
      const response = await api.post('/user/captcha', { uuid: '' });
      
      // API响应拦截器已经处理了非200状态的情况
      setCaptchaImage(response.data.imageBase64);
      setCaptchaUuid(response.data.uuid);
    } catch (error) {
      console.error('获取验证码错误:', error);
      // 错误处理已在API拦截器中完成
    } finally {
      setCaptchaLoading(false);
    }
  };

  // 组件加载时获取验证码
  useEffect(() => {
    fetchCaptcha();
  }, []);

  // 密码登录
  const onPasswordFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await api.post('/user/login', {
        email: values.username,
        password: values.password
      });
      
      console.log('登录API响应:', response);
      
      // API 响应拦截器会自动处理非200状态
      const { token, uuid, email, nickname, avatarUrl, id } = response.data;
      
      if (!uuid) {
        console.error('登录响应中缺少uuid字段:', response.data);
        message.error('登录失败: 响应数据不完整');
        return;
      }
      
      // 先打印一下token，确认接收到了
      console.log('登录成功，获取到token:', token);
      console.log('登录成功，获取到完整用户信息:', { id, uuid, email, nickname, avatarUrl });
      
      // 存储token到localStorage
      localStorage.setItem('token', token);
      console.log('token已保存到localStorage');
      
      // 构建完整的用户对象
      const user = {
        uuid,
        username: values.username,
        email: email || values.username,
        nickname: nickname || '用户',
        avatarUrl,
        id // 可选，如果后端返回了
      };
      
      // 保存用户信息
      localStorage.setItem('user', JSON.stringify(user));
      console.log('用户信息已保存到localStorage:', user);
      
      // 更新Redux状态
      dispatch(login({ token, user }));
      
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      console.error('登录错误:', error);
      // 错误处理已经在API拦截器中完成
    } finally {
      setLoading(false);
    }
  };

  // 验证码登录
  const onCodeFinish = async (values: any) => {
    setLoading(true);
    try {
      // 直接使用验证码登录
      const response = await api.post('/user/login/code', {
        email: values.email,
        code: values.code
      });
      
      console.log('验证码登录API响应:', response);
      
      // API 响应拦截器会自动处理非200状态
      const { token, uuid, email: userEmail, nickname, avatarUrl, id } = response.data;
      
      if (!uuid) {
        console.error('登录响应中缺少uuid字段:', response.data);
        message.error('登录失败: 响应数据不完整');
        return;
      }
      
      // 先打印一下token，确认接收到了
      console.log('验证码登录成功，获取到token:', token);
      console.log('验证码登录成功，获取到完整用户信息:', { id, uuid, userEmail, nickname, avatarUrl });
      
      // 存储token到localStorage
      localStorage.setItem('token', token);
      console.log('token已保存到localStorage');
      
      // 构建完整的用户对象
      const user = {
        uuid,
        username: userEmail,
        email: userEmail,
        nickname: nickname || '用户',
        avatarUrl,
        id // 可选，如果后端返回了
      };
      
      // 保存用户信息
      localStorage.setItem('user', JSON.stringify(user));
      console.log('用户信息已保存到localStorage:', user);
      
      // 更新Redux状态
      dispatch(login({ token, user }));
      
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      console.error('验证码登录错误:', error);
      // 错误处理已经在API拦截器中完成
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg border-0 rounded-lg">
        <div className="text-center mb-6">
          <Title level={2} className="text-primary-600">登录 Dev-Deck</Title>
          <Text type="secondary">欢迎回来，请登录您的账户</Text>
        </div>

        <Tabs defaultActiveKey="password" centered>
          <TabPane tab="密码登录" key="password">
            <Form
              name="password_login"
              initialValues={{ remember: true }}
              onFinish={onPasswordFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入邮箱' }]}
              >
                <Input 
                  prefix={<MailOutlined className="text-gray-400" />} 
                  placeholder="邮箱" 
                  size="large"
                  className="rounded-md py-2"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-gray-400" />} 
                  placeholder="密码"
                  size="large" 
                  className="rounded-md py-2"
                />
              </Form.Item>

              <Form.Item>
                <div className="flex justify-between">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <Link to="/auth/forgot-password" className="text-primary-500 hover:text-primary-700">
                    忘记密码？
                  </Link>
                </div>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className="w-full h-12 text-lg rounded-md bg-gradient-to-r from-primary-500 to-secondary-500 border-0 hover:from-primary-600 hover:to-secondary-600" 
                  loading={loading}
                  size="large"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="验证码登录" key="code">
            <Form
              form={form}
              name="code_login"
              onFinish={onCodeFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined className="text-gray-400" />} 
                  placeholder="邮箱地址" 
                  size="large"
                  className="rounded-md py-2"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    name="captchaCode"
                    rules={[{ required: true, message: '请输入图形验证码' }]}
                  >
                    <Input 
                      prefix={<SafetyOutlined className="text-gray-400" />} 
                      placeholder="图形验证码" 
                      size="large"
                      className="rounded-md py-2" 
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <div 
                    className="h-[40px] flex items-center justify-center border border-gray-200 rounded-md cursor-pointer overflow-hidden" 
                    onClick={fetchCaptcha}
                  >
                    {captchaLoading ? (
                      <div className="animate-pulse bg-gray-200 w-full h-full"></div>
                    ) : (
                      captchaImage && (
                        <img 
                          src={captchaImage ? `data:image/png;base64,${captchaImage}` : ''}
                          alt="验证码" 
                          className="w-full h-full object-cover"
                        />
                      )
                    )}
                  </div>
                </Col>
              </Row>

              <Form.Item
                name="code"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <div className="flex">
                  <Input 
                    placeholder="邮箱验证码" 
                    className="flex-1 mr-2 rounded-md py-2" 
                    size="large"
                    prefix={<SafetyOutlined className="text-gray-400" />}
                  />
                  <Button 
                    onClick={() => {
                      const email = form.getFieldValue('email');
                      const captchaCode = form.getFieldValue('captchaCode');
                      if (!email) {
                        message.error('请输入邮箱地址');
                        return;
                      }
                      
                      if (!captchaCode) {
                        message.error('请输入图形验证码');
                        return;
                      }
                      
                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                        message.error('请输入有效的邮箱地址');
                        return;
                      }
                      
                      // 发送验证码
                      api.post('/user/verification-code', { 
                        email,
                        captchaUuid,
                        captchaCode,
                        type: 2 // 登录
                      })
                        .then(() => {
                          message.success(`验证码已发送到 ${email}`);
                        })
                        .catch(err => {
                          console.error('发送验证码错误:', err);
                          fetchCaptcha(); // 刷新验证码
                        });
                    }}
                    loading={loading}
                    className="bg-secondary-500 hover:bg-secondary-600 text-white border-0"
                    size="large"
                  >
                    获取验证码
                  </Button>
                </div>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className="w-full h-12 text-lg rounded-md bg-gradient-to-r from-primary-500 to-secondary-500 border-0 hover:from-primary-600 hover:to-secondary-600" 
                  loading={loading}
                  size="large"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <Divider>
          <Text type="secondary">还没有账号？</Text>
        </Divider>

        <div className="text-center">
          <Link to="/auth/register">
            <Button type="default" size="large" className="rounded-md">
              注册新账号
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage; 