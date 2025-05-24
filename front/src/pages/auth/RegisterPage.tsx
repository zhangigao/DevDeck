import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Divider, message, Row, Col, Image } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '@/api/config';
import axios from 'axios';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [captchaLoading, setCapachaLoading] = useState(false);
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaUuid, setCaptchaUuid] = useState('');
  const navigate = useNavigate();

  // 获取图形验证码
  const fetchCaptcha = async () => {
    try {
      setCapachaLoading(true);
      const response = await api.post('/user/captcha', { uuid: '' });
      
      // API响应拦截器已经处理了非200状态的情况
      setCaptchaImage(response.data.imageBase64);
      setCaptchaUuid(response.data.uuid);
    } catch (error) {
      console.error('获取验证码错误:', error);
      // 错误处理已在API拦截器中完成
    } finally {
      setCapachaLoading(false);
    }
  };

  // 组件加载时获取验证码
  useEffect(() => {
    fetchCaptcha();
  }, []);

  // 发送邮箱验证码
  const sendVerificationCode = async () => {
    try {
      // 获取表单中的邮箱和图形验证码
      const email = form.getFieldValue('email');
      const captchaCode = form.getFieldValue('captchaCode');
      
      // 验证邮箱和验证码是否已输入
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
      
      setLoading(true);
      await api.post('/user/verification-code', {
        email,
        captchaUuid,
        captchaCode,
        type: 1 // 注册
      });
      
      message.success(`验证码已发送到 ${email}`);
    } catch (error) {
      console.error('发送验证码错误:', error);
      // 错误处理已在API拦截器中完成
      // 发生错误时刷新验证码
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // 注册提交
  const onFinish = async (values: any) => {
    setLoading(true);
    
    try {
      const response = await api.post('/user/register', {
        email: values.email,
        password: values.password,
        code: values.verificationCode
      });
      
      message.success('注册成功，请登录');
      navigate('/auth/login');
    } catch (error) {
      console.error('注册错误:', error);
      // 错误处理已在API拦截器中完成
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg border-0 rounded-lg">
        <div className="text-center mb-6">
          <Title level={2} className="text-primary-600">注册 Dev-Deck</Title>
          <Text type="secondary">创建您的账户以开始刷题之旅</Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          scrollToFirstError
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
            name="verificationCode"
            rules={[{ required: true, message: '请输入邮箱验证码' }]}
          >
            <div className="flex">
              <Input 
                prefix={<SafetyOutlined className="text-gray-400" />} 
                placeholder="邮箱验证码" 
                size="large"
                className="rounded-md py-2 flex-1 mr-2" 
              />
              <Button 
                onClick={sendVerificationCode}
                loading={loading}
                className="bg-secondary-500 hover:bg-secondary-600 text-white border-0"
                size="large"
              >
                获取验证码
              </Button>
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码长度不能少于8个字符' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: '密码必须包含大小写字母、数字和特殊字符'
              }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="设置密码" 
              size="large"
              className="rounded-md py-2" 
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="确认密码" 
              size="large"
              className="rounded-md py-2" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-12 text-lg rounded-md bg-gradient-to-r from-primary-500 to-secondary-500 border-0 hover:from-primary-600 hover:to-secondary-600" 
              loading={loading}
              size="large"
            >
              注册
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">已有账户？</Text>
        </Divider>

        <div className="text-center">
          <Link to="/auth/login">
            <Button 
              type="default" 
              size="large"
              className="rounded-md"
            >
              返回登录
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage; 