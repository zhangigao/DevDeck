import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Steps, message, Row, Col } from 'antd';
import { MailOutlined, LockOutlined, CheckCircleOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api, { API_BASE_URL } from '@/api/config';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const ForgotPasswordPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaUuid, setCaptchaUuid] = useState('');
  const [form] = Form.useForm();

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
        type: 3 // 修改密码
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

  // 验证邮箱和验证码
  const verifyEmail = async () => {
    try {
      await form.validateFields(['email', 'captchaCode', 'code']);
      setLoading(true);
      
      // 在实际项目中，这里应该调用API验证邮箱验证码是否正确
      /* 
      const response = await api.post('/user/verify-code', {
        email: form.getFieldValue('email'),
        code: form.getFieldValue('code')
      });
      
      if (response.code === 200) {
        setCurrentStep(1);
      } else {
        message.error(response.message || '验证码错误');
      }
      */
      
      // 模拟API验证
      setTimeout(() => {
        setCurrentStep(1);
        setLoading(false);
      }, 1000);
    } catch (error) {
      // 表单验证失败
      setLoading(false);
    }
  };

  // 重置密码
  const resetPassword = async () => {
    try {
      await form.validateFields(['password', 'confirmPassword']);
      setLoading(true);
      
      // 在实际项目中，这里应该调用API重置密码
      /* 
      const response = await api.post('/user/reset-password', {
        email: form.getFieldValue('email'),
        code: form.getFieldValue('code'),
        password: form.getFieldValue('password')
      });
      
      if (response.code === 200) {
        message.success('密码重置成功，请使用新密码登录');
        setCurrentStep(2);
      } else {
        message.error(response.message || '密码重置失败');
      }
      */
      
      // 模拟API调用
      setTimeout(() => {
        message.success('密码重置成功，请使用新密码登录');
        setCurrentStep(2);
        setLoading(false);
      }, 1500);
    } catch (error) {
      // 表单验证失败
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg border-0 rounded-lg">
        <div className="text-center mb-6">
          <Title level={2} className="text-primary-600">找回密码</Title>
          <Text type="secondary">我们将帮助您重置密码</Text>
        </div>

        <Steps current={currentStep} className="mb-8">
          <Step title="验证邮箱" />
          <Step title="重置密码" />
          <Step title="完成" />
        </Steps>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          {currentStep === 0 && (
            <>
              <Paragraph className="mb-4">
                请输入您注册时使用的邮箱地址，我们将向该邮箱发送验证码。
              </Paragraph>
              
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
                      <img 
                        src={captchaImage ? `data:image/png;base64,${captchaImage}` : ''}
                        alt="验证码" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </Col>
              </Row>
              
              <Form.Item
                name="code"
                rules={[{ required: true, message: '请输入邮箱验证码' }]}
              >
                <div className="flex">
                  <Input 
                    prefix={<CheckCircleOutlined className="text-gray-400" />}
                    placeholder="邮箱验证码" 
                    className="flex-1 mr-2 rounded-md py-2"
                    size="large"
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
              
              <Form.Item>
                <Button 
                  type="primary" 
                  className="w-full h-12 text-lg rounded-md bg-gradient-to-r from-primary-500 to-secondary-500 border-0 hover:from-primary-600 hover:to-secondary-600"
                  onClick={verifyEmail}
                  loading={loading}
                  size="large"
                >
                  下一步
                </Button>
              </Form.Item>
            </>
          )}
          
          {currentStep === 1 && (
            <>
              <Paragraph className="mb-4">
                请设置您的新密码。
              </Paragraph>
              
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 8, message: '密码长度不能少于8个字符' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: '密码必须包含大小写字母、数字和特殊字符'
                  }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-gray-400" />} 
                  placeholder="新密码" 
                  size="large"
                  className="rounded-md py-2"
                />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认新密码' },
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
                  placeholder="确认新密码" 
                  size="large"
                  className="rounded-md py-2"
                />
              </Form.Item>
              
              <Form.Item>
                <div className="flex justify-between">
                  <Button 
                    type="default" 
                    onClick={() => setCurrentStep(0)}
                    size="large"
                    className="min-w-24 rounded-md"
                  >
                    上一步
                  </Button>
                  <Button 
                    type="primary"
                    onClick={resetPassword}
                    loading={loading}
                    size="large"
                    className="min-w-24 rounded-md bg-gradient-to-r from-primary-500 to-secondary-500 border-0 hover:from-primary-600 hover:to-secondary-600"
                  >
                    重置密码
                  </Button>
                </div>
              </Form.Item>
            </>
          )}
          
          {currentStep === 2 && (
            <div className="text-center py-8">
              <div className="text-6xl text-green-500 mb-4 flex justify-center">
                <CheckCircleOutlined />
              </div>
              <Title level={3} className="text-primary-600">密码重置成功</Title>
              <Paragraph className="text-gray-500 mb-8">
                您的密码已成功重置，现在可以使用新密码登录您的账户。
              </Paragraph>
              <Link to="/login">
                <Button 
                  type="primary" 
                  className="mt-4 h-12 min-w-48 rounded-md bg-gradient-to-r from-primary-500 to-secondary-500 border-0 hover:from-primary-600 hover:to-secondary-600"
                  size="large"
                >
                  返回登录
                </Button>
              </Link>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage; 