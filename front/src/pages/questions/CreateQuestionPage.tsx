import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Radio, 
  Select, 
  Space, 
  Divider, 
  InputNumber,
  Row,
  Col,
  Tabs,
  message
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, EyeOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { QuestionType } from '@/store/slices/questionsSlice';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// 模拟标签数据
const mockTags = [
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'React', label: 'React' },
  { value: 'Vue', label: 'Vue' },
  { value: 'Angular', label: 'Angular' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'HTML', label: 'HTML' },
  { value: 'CSS', label: 'CSS' },
  { value: '算法', label: '算法' },
  { value: '数据结构', label: '数据结构' },
  { value: '设计模式', label: '设计模式' },
];

const CreateQuestionPage: React.FC = () => {
  const [form] = Form.useForm();
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.SingleChoice);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  // 切换预览模式
  const togglePreview = () => {
    if (!previewMode) {
      const content = form.getFieldValue('content');
      setPreviewContent(content || '');
    }
    setPreviewMode(!previewMode);
  };

  // 处理表单提交
  const onFinish = (values: any) => {
    setLoading(true);
    console.log('提交的表单数据:', values);
    
    // 模拟API调用
    setTimeout(() => {
      message.success('题目创建成功');
      setLoading(false);
      form.resetFields();
    }, 1500);
  };

  // 处理题目类型变更
  const handleTypeChange = (e: any) => {
    setQuestionType(e.target.value);
  };

  // 渲染题目设置部分
  const renderQuestionSettings = () => {
    switch (questionType) {
      case QuestionType.SingleChoice:
      case QuestionType.MultipleChoice:
        return (
          <>
            <Divider orientation="left">选项设置</Divider>
            <Form.List name="choices">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space 
                      key={key} 
                      style={{ display: 'flex', marginBottom: 8 }} 
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'id']}
                        rules={[{ required: true, message: '请输入选项标识' }]}
                      >
                        <Input placeholder="选项标识 (如: A, B, C)" style={{ width: 150 }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'content']}
                        rules={[{ required: true, message: '请输入选项内容' }]}
                        style={{ width: '100%', minWidth: 300 }}
                      >
                        <Input placeholder="选项内容" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      block 
                      icon={<PlusOutlined />}
                    >
                      添加选项
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item
              name="correctAnswer"
              label="正确答案"
              rules={[{ required: true, message: '请选择正确答案' }]}
            >
              {questionType === QuestionType.SingleChoice ? (
                <Select placeholder="选择正确答案">
                  {form.getFieldValue('choices')?.map((choice: any) => (
                    <Option key={choice?.id} value={choice?.id}>
                      {choice?.id}: {choice?.content}
                    </Option>
                  ))}
                </Select>
              ) : (
                <Select
                  mode="multiple"
                  placeholder="选择正确答案 (可多选)"
                  optionFilterProp="children"
                >
                  {form.getFieldValue('choices')?.map((choice: any) => (
                    <Option key={choice?.id} value={choice?.id}>
                      {choice?.id}: {choice?.content}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </>
        );
      
      case QuestionType.TextAnswer:
        return (
          <>
            <Divider orientation="left">答案设置</Divider>
            <Form.Item
              name="correctAnswer"
              label="参考答案"
              rules={[{ required: true, message: '请输入参考答案' }]}
            >
              <TextArea rows={6} placeholder="输入参考答案" />
            </Form.Item>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <Title level={3}>创建题目</Title>
            <Text type="secondary">创建新的题目，支持多种题型</Text>
          </div>
          <Button onClick={togglePreview} icon={<EyeOutlined />}>
            {previewMode ? '编辑模式' : '预览模式'}
          </Button>
        </div>
      </Card>

      <Card>
        {previewMode ? (
          <div className="question-preview">
            <Title level={4}>题目预览</Title>
            <Divider />
            <div className="markdown-content">
              <ReactMarkdown>{previewContent}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              type: QuestionType.SingleChoice,
              difficulty: 2,
              choices: [
                { id: 'A', content: '' },
                { id: 'B', content: '' },
                { id: 'C', content: '' },
                { id: 'D', content: '' },
              ],
            }}
          >
            <Row gutter={24}>
              <Col span={24} md={16}>
                <Tabs defaultActiveKey="basic">
                  <TabPane tab="基本信息" key="basic">
                    <Form.Item
                      name="title"
                      label="题目标题"
                      rules={[{ required: true, message: '请输入题目标题' }]}
                    >
                      <Input placeholder="请输入题目标题" />
                    </Form.Item>
                    
                    <Form.Item
                      name="content"
                      label={
                        <div className="flex justify-between w-full">
                          <span>题目内容</span>
                          <Text type="secondary">支持 Markdown 格式</Text>
                        </div>
                      }
                      rules={[{ required: true, message: '请输入题目内容' }]}
                    >
                      <TextArea 
                        rows={10} 
                        placeholder="请输入题目内容，支持 Markdown 格式" 
                      />
                    </Form.Item>
                    
                    <Form.Item
                      name="hint"
                      label="提示信息"
                    >
                      <TextArea 
                        rows={3} 
                        placeholder="可选，为题目添加提示信息" 
                      />
                    </Form.Item>
                  </TabPane>
                  
                  <TabPane tab="高级设置" key="advanced">
                    <Form.Item
                      name="source"
                      label="题目来源"
                    >
                      <Input placeholder="可选，题目的来源，如书籍、网站等" />
                    </Form.Item>
                    
                    <Form.Item
                      name="submitCount"
                      label="提交次数"
                    >
                      <InputNumber min={0} placeholder="初始提交次数" />
                    </Form.Item>
                    
                    <Form.Item
                      name="isOfficial"
                      label="是否官方题目"
                      valuePropName="checked"
                    >
                      <Radio.Group>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </TabPane>
                </Tabs>
              </Col>
              
              <Col span={24} md={8}>
                <Card title="题目设置" bordered={false}>
                  <Form.Item
                    name="type"
                    label="题目类型"
                    rules={[{ required: true, message: '请选择题目类型' }]}
                  >
                    <Radio.Group onChange={handleTypeChange}>
                      <Space direction="vertical">
                        <Radio value={QuestionType.SingleChoice}>单选题</Radio>
                        <Radio value={QuestionType.MultipleChoice}>多选题</Radio>
                        <Radio value={QuestionType.TextAnswer}>问答题</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                  
                  <Form.Item
                    name="difficulty"
                    label="难度等级"
                    rules={[{ required: true, message: '请选择难度等级' }]}
                  >
                    <Radio.Group>
                      <Radio value={1}>简单</Radio>
                      <Radio value={2}>中等</Radio>
                      <Radio value={3}>困难</Radio>
                    </Radio.Group>
                  </Form.Item>
                  
                  <Form.Item
                    name="tags"
                    label="标签"
                    rules={[{ required: true, message: '请至少选择一个标签' }]}
                  >
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="选择或创建标签"
                      options={mockTags}
                    />
                  </Form.Item>
                </Card>
                
                {renderQuestionSettings()}
              </Col>
            </Row>
            
            <Divider />
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  创建题目
                </Button>
                <Button htmlType="reset">
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default CreateQuestionPage; 