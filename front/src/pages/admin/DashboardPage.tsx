import React from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Button, Tag, Space, Progress } from 'antd';
import { UserOutlined, FileTextOutlined, CommentOutlined, EyeOutlined, LikeOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  // 用户统计数据
  const userStatistics = [
    { title: '总用户数', value: 12485, icon: <UserOutlined />, color: '#1890ff' },
    { title: '今日新增', value: 128, icon: <UserOutlined />, color: '#52c41a' },
    { title: '活跃用户', value: 3264, icon: <UserOutlined />, color: '#faad14' },
    { title: '题目总数', value: 2567, icon: <FileTextOutlined />, color: '#722ed1' },
  ];

  // 内容统计数据
  const contentStatistics = [
    { title: '总浏览量', value: 158465, icon: <EyeOutlined />, color: '#eb2f96' },
    { title: '社区帖子', value: 1247, icon: <CommentOutlined />, color: '#fa541c' },
    { title: '待审核题目', value: 45, icon: <QuestionCircleOutlined />, color: '#fa8c16' },
    { title: '待审核评论', value: 78, icon: <CommentOutlined />, color: '#13c2c2' },
  ];

  // 用户增长数据
  const userData = [
    { month: '1月', value: 3500 },
    { month: '2月', value: 4200 },
    { month: '3月', value: 5100 },
    { month: '4月', value: 6300 },
    { month: '5月', value: 7800 },
    { month: '6月', value: 9100 },
    { month: '7月', value: 10400 },
    { month: '8月', value: 11200 },
    { month: '9月', value: 11800 },
    { month: '10月', value: 12300 },
    { month: '11月', value: 12485 },
  ];

  // 用户分布数据
  const userDistribution = [
    { type: '初级开发者', value: 5234 },
    { type: '中级开发者', value: 4321 },
    { type: '高级开发者', value: 2123 },
    { type: '学生', value: 807 },
  ];

  // 待审核项目数据
  const reviewData = [
    {
      key: '1',
      title: '如何优化React渲染性能？',
      type: '题目',
      submitter: '张三',
      submitTime: '2023-11-25 14:23:45',
      status: '待审核',
    },
    {
      key: '2',
      title: 'TypeScript中的高级类型应用',
      type: '题目',
      submitter: '李四',
      submitTime: '2023-11-25 13:45:12',
      status: '待审核',
    },
    {
      key: '3',
      title: '用户头像更新',
      type: '头像',
      submitter: '王五',
      submitTime: '2023-11-25 12:34:56',
      status: '待审核',
    },
    {
      key: '4',
      title: '关于Vue3 Composition API的讨论',
      type: '评论',
      submitter: '赵六',
      submitTime: '2023-11-25 11:23:45',
      status: '待审核',
    },
    {
      key: '5',
      title: '微前端架构的实践与思考',
      type: '社区帖子',
      submitter: '钱七',
      submitTime: '2023-11-25 10:12:34',
      status: '待审核',
    },
  ];

  // 待审核项目表格列定义
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => {
        const color = 
          text === '题目' ? 'blue' : 
          text === '头像' ? 'green' : 
          text === '评论' ? 'orange' : 
          'purple';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '提交者',
      dataIndex: 'submitter',
      key: 'submitter',
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => <Tag color="volcano">{text}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">审核</Button>
        </Space>
      ),
    },
  ];

  // 系统状态数据
  const systemStatus = [
    { title: 'CPU使用率', value: 32, status: 'normal' },
    { title: '内存使用率', value: 58, status: 'normal' },
    { title: '磁盘使用率', value: 78, status: 'warning' },
    { title: '带宽使用率', value: 45, status: 'normal' },
  ];

  return (
    <div className="dashboard-page">
      <Title level={4}>系统概览</Title>
      <Text type="secondary" className="mb-6 block">欢迎使用 Dev-Deck 管理后台</Text>
      
      {/* 统计卡片 - 第一行 */}
      <Row gutter={[16, 16]} className="mb-6">
        {userStatistics.map((item, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card bordered={false} className="shadow-sm">
              <Statistic 
                title={
                  <div className="flex items-center">
                    <span style={{ color: item.color }} className="mr-2">{item.icon}</span>
                    {item.title}
                  </div>
                }
                value={item.value}
                valueStyle={{ color: item.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 统计卡片 - 第二行 */}
      <Row gutter={[16, 16]} className="mb-6">
        {contentStatistics.map((item, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card bordered={false} className="shadow-sm">
              <Statistic 
                title={
                  <div className="flex items-center">
                    <span style={{ color: item.color }} className="mr-2">{item.icon}</span>
                    {item.title}
                  </div>
                }
                value={item.value}
                valueStyle={{ color: item.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表替代为数据卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12} className="mb-6">
          <Card 
            title="用户增长趋势" 
            bordered={false} 
            className="shadow-sm"
            extra={<Button type="link" size="small">详情</Button>}
          >
            <div className="p-4">
              <ul className="list-none">
                {userData.map((item, index) => (
                  <li key={index} className="mb-2 flex justify-between">
                    <span>{item.month}</span>
                    <span>{item.value}人</span>
                    <Progress 
                      percent={Math.round(item.value / 12485 * 100)} 
                      showInfo={false} 
                      status="active"
                      style={{ width: '60%' }} 
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12} className="mb-6">
          <Card 
            title="用户分布" 
            bordered={false} 
            className="shadow-sm"
            extra={<Button type="link" size="small">详情</Button>}
          >
            <div className="p-4">
              <ul className="list-none">
                {userDistribution.map((item, index) => (
                  <li key={index} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span>{item.type}</span>
                      <span>{item.value}人 ({Math.round(item.value / 12485 * 100)}%)</span>
                    </div>
                    <Progress 
                      percent={Math.round(item.value / 12485 * 100)} 
                      status="active"
                      strokeColor={
                        index === 0 ? '#1890ff' : 
                        index === 1 ? '#52c41a' : 
                        index === 2 ? '#faad14' : 
                        '#eb2f96'
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 待审核项目表格 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={24}>
          <Card 
            title="待审核项目" 
            bordered={false} 
            className="shadow-sm"
            extra={<Button type="link" size="small">查看全部</Button>}
          >
            <Table 
              dataSource={reviewData} 
              columns={columns} 
              pagination={false}
              size="small"
              className="review-table"
            />
          </Card>
        </Col>
      </Row>

      {/* 系统状态 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card 
            title="系统状态" 
            bordered={false} 
            className="shadow-sm"
            extra={<Button type="link" size="small">详情</Button>}
          >
            <div className="p-4">
              {systemStatus.map((item, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <Text>{item.title}</Text>
                    <Text type={item.status === 'warning' ? 'warning' : undefined}>
                      {item.value}%
                    </Text>
                  </div>
                  <Progress 
                    percent={item.value} 
                    status={item.status === 'warning' ? 'exception' : undefined}
                    strokeColor={
                      item.status === 'warning' ? '#faad14' : undefined
                    }
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 