import React, { useState } from 'react';
import { Card, Table, Button, Typography, Space, Tag, Modal, Input, Avatar, Radio, Image, Row, Col, Progress, Tooltip, Select } from 'antd';
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined, RobotOutlined, UserOutlined, EyeOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface AvatarReviewData {
  id: number;
  userId: number;
  username: string;
  nickname: string;
  avatarUrl: string;
  submitTime: string;
  aiReviewResult: {
    status: 'pass' | 'reject' | 'pending';
    score: number;
    categories: Array<{
      name: string;
      score: number;
    }>;
    suggestion: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewTime?: string;
  rejectReason?: string;
}

const AvatarReviewPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<AvatarReviewData | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'approved' | 'rejected'>('approved');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // 模拟头像审核数据
  const avatarReviewData: AvatarReviewData[] = [
    {
      id: 1,
      userId: 101,
      username: 'user101',
      nickname: '张三',
      avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      submitTime: '2023-11-25 14:23:45',
      aiReviewResult: {
        status: 'pass',
        score: 0.98,
        categories: [
          { name: '色情', score: 0.01 },
          { name: '暴力', score: 0.02 },
          { name: '违禁品', score: 0.01 },
          { name: '不良场景', score: 0.01 },
        ],
        suggestion: '通过',
      },
      status: 'pending',
    },
    {
      id: 2,
      userId: 102,
      username: 'user102',
      nickname: '李四',
      avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
      submitTime: '2023-11-25 13:45:12',
      aiReviewResult: {
        status: 'pending',
        score: 0.75,
        categories: [
          { name: '色情', score: 0.15 },
          { name: '暴力', score: 0.05 },
          { name: '违禁品', score: 0.08 },
          { name: '不良场景', score: 0.10 },
        ],
        suggestion: '需人工审核',
      },
      status: 'pending',
    },
    {
      id: 3,
      userId: 103,
      username: 'user103',
      nickname: '王五',
      avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
      submitTime: '2023-11-25 12:34:56',
      aiReviewResult: {
        status: 'reject',
        score: 0.32,
        categories: [
          { name: '色情', score: 0.08 },
          { name: '暴力', score: 0.45 },
          { name: '违禁品', score: 0.12 },
          { name: '不良场景', score: 0.25 },
        ],
        suggestion: '拒绝',
      },
      status: 'pending',
    },
    {
      id: 4,
      userId: 104,
      username: 'user104',
      nickname: '赵六',
      avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
      submitTime: '2023-11-25 11:23:45',
      aiReviewResult: {
        status: 'pass',
        score: 0.94,
        categories: [
          { name: '色情', score: 0.02 },
          { name: '暴力', score: 0.01 },
          { name: '违禁品', score: 0.03 },
          { name: '不良场景', score: 0.04 },
        ],
        suggestion: '通过',
      },
      status: 'approved',
      reviewedBy: '管理员',
      reviewTime: '2023-11-25 12:00:00',
    },
    {
      id: 5,
      userId: 105,
      username: 'user105',
      nickname: '钱七',
      avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
      submitTime: '2023-11-25 10:12:34',
      aiReviewResult: {
        status: 'reject',
        score: 0.25,
        categories: [
          { name: '色情', score: 0.65 },
          { name: '暴力', score: 0.05 },
          { name: '违禁品', score: 0.08 },
          { name: '不良场景', score: 0.10 },
        ],
        suggestion: '拒绝',
      },
      status: 'rejected',
      reviewedBy: '管理员',
      reviewTime: '2023-11-25 10:30:00',
      rejectReason: '图片含有不适当内容',
    },
  ];

  // 表格分页配置
  const paginationConfig: TablePaginationConfig = {
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (total) => `共 ${total} 条记录`,
  };

  // 打开审核模态框
  const showReviewModal = (avatar: AvatarReviewData) => {
    setCurrentAvatar(avatar);
    setIsReviewModalVisible(true);
    setReviewDecision(avatar.aiReviewResult.status === 'reject' ? 'rejected' : 'approved');
    setRejectReason('');
  };

  // 处理审核提交
  const handleReviewSubmit = () => {
    if (!currentAvatar) return;
    
    if (reviewDecision === 'rejected' && !rejectReason) {
      Modal.warning({
        title: '请输入拒绝原因',
        content: '拒绝头像时需要提供拒绝原因',
      });
      return;
    }
    
    // TODO: 发送API请求保存审核结果
    console.log('审核结果:', {
      avatarId: currentAvatar.id,
      userId: currentAvatar.userId,
      decision: reviewDecision,
      rejectReason: reviewDecision === 'rejected' ? rejectReason : undefined,
    });
    
    setIsReviewModalVisible(false);
    // 成功提示和刷新数据
  };

  // 批量审核
  const handleBatchReview = (decision: 'approved' | 'rejected') => {
    if (selectedRowKeys.length === 0) {
      Modal.warning({
        title: '请选择要审核的头像',
        content: '您需要先选择要批量审核的头像',
      });
      return;
    }
    
    if (decision === 'rejected') {
      Modal.confirm({
        title: '批量拒绝确认',
        content: (
          <div>
            <p>您确定要拒绝选中的 {selectedRowKeys.length} 个头像吗？</p>
            <p>请输入拒绝原因：</p>
            <TextArea 
              rows={2} 
              placeholder="请输入拒绝原因"
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
        ),
        onOk: () => {
          if (!rejectReason) {
            Modal.warning({
              title: '请输入拒绝原因',
              content: '拒绝头像时需要提供拒绝原因',
            });
            return Promise.reject();
          }
          
          // TODO: 发送API请求批量拒绝
          console.log('批量拒绝:', {
            avatarIds: selectedRowKeys,
            rejectReason,
          });
          
          setSelectedRowKeys([]);
          setRejectReason('');
          // 成功提示和刷新数据
          return Promise.resolve();
        },
        okText: '确认拒绝',
        cancelText: '取消',
      });
    } else {
      Modal.confirm({
        title: '批量通过确认',
        content: `您确定要通过选中的 ${selectedRowKeys.length} 个头像吗？`,
        onOk: () => {
          // TODO: 发送API请求批量通过
          console.log('批量通过:', {
            avatarIds: selectedRowKeys,
          });
          
          setSelectedRowKeys([]);
          // 成功提示和刷新数据
        },
        okText: '确认通过',
        cancelText: '取消',
      });
    }
  };

  // 预览图片
  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  // 过滤数据
  const getFilteredData = () => {
    if (!filterStatus) return avatarReviewData;
    return avatarReviewData.filter(item => item.status === filterStatus);
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '用户',
      key: 'user',
      render: (_, record: AvatarReviewData) => (
        <div className="flex items-center">
          <div className="mr-3">
            <Avatar 
              src={record.avatarUrl} 
              size={40}
              icon={<UserOutlined />}
              className="cursor-pointer"
              onClick={() => handlePreview(record.avatarUrl)}
            />
          </div>
          <div>
            <div className="font-medium">{record.nickname}</div>
            <div className="text-xs text-gray-500">@{record.username}</div>
          </div>
        </div>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 180,
    },
    {
      title: 'AI审核结果',
      key: 'aiResult',
      width: 260,
      render: (_, record: AvatarReviewData) => {
        const { aiReviewResult } = record;
        const statusColor = 
          aiReviewResult.status === 'pass' ? 'success' : 
          aiReviewResult.status === 'reject' ? 'error' : 
          'warning';
        
        const statusText = 
          aiReviewResult.status === 'pass' ? 'AI建议通过' : 
          aiReviewResult.status === 'reject' ? 'AI建议拒绝' : 
          'AI建议人工审核';
          
        // 找出得分最高的违规类别
        const highestCategory = [...aiReviewResult.categories].sort((a, b) => b.score - a.score)[0];
        
        return (
          <div>
            <div className="flex items-center mb-1">
              <RobotOutlined className="mr-1" />
              <Tag color={statusColor}>{statusText}</Tag>
              <span className="ml-1">可信度: {Math.round(aiReviewResult.score * 100)}%</span>
            </div>
            {aiReviewResult.status !== 'pass' && highestCategory.score > 0.1 && (
              <div className="text-xs text-gray-500">
                主要问题: {highestCategory.name} ({Math.round(highestCategory.score * 100)}%)
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          pending: { color: 'warning', text: '待审核' },
          approved: { color: 'success', text: '已通过' },
          rejected: { color: 'error', text: '已拒绝' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '审核信息',
      key: 'reviewInfo',
      render: (_, record: AvatarReviewData) => {
        if (record.status === 'pending') {
          return <Text type="secondary">待审核</Text>;
        }
        
        return (
          <div>
            <div>审核人: {record.reviewedBy}</div>
            <div className="text-xs text-gray-500">时间: {record.reviewTime}</div>
            {record.rejectReason && (
              <div className="text-xs text-red-500 mt-1">
                原因: {record.rejectReason}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record: AvatarReviewData) => {
        if (record.status !== 'pending') {
          return (
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handlePreview(record.avatarUrl)}
            >
              查看
            </Button>
          );
        }
        
        return (
          <Space size="small">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handlePreview(record.avatarUrl)}
            >
              查看
            </Button>
            <Button 
              type="link" 
              onClick={() => showReviewModal(record)}
            >
              审核
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="avatar-review-page">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={4}>头像审核</Title>
          <Text type="secondary">审核用户上传的头像，确保内容符合平台规范</Text>
        </div>
      </div>

      <Card bordered={false} className="mb-4">
        <Paragraph className="mb-4">
          <ExclamationCircleOutlined className="text-warning mr-2" />
          系统将使用AI自动对用户上传的头像进行初步审核，对于明确违规的内容将自动拒绝，对于存在疑虑的内容需要管理员进行人工审核。
        </Paragraph>
        
        <div className="flex flex-wrap gap-4">
          <Select 
            placeholder="状态筛选" 
            style={{ width: 150 }}
            allowClear
            value={filterStatus}
            onChange={value => setFilterStatus(value)}
          >
            <Option value="pending">待审核</Option>
            <Option value="approved">已通过</Option>
            <Option value="rejected">已拒绝</Option>
          </Select>
          
          <Button icon={<FilterOutlined />}>筛选</Button>
          <Button icon={<ReloadOutlined />}>重置</Button>
          
          <div className="flex-1"></div>
          
          <Space>
            <Button 
              type="primary" 
              icon={<CheckOutlined />}
              onClick={() => handleBatchReview('approved')}
              disabled={selectedRowKeys.length === 0}
            >
              批量通过
            </Button>
            <Button 
              danger 
              icon={<CloseOutlined />}
              onClick={() => handleBatchReview('rejected')}
              disabled={selectedRowKeys.length === 0}
            >
              批量拒绝
            </Button>
          </Space>
        </div>
      </Card>

      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={getFilteredData()}
          pagination={paginationConfig}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
            getCheckboxProps: (record) => ({
              disabled: record.status !== 'pending',
            }),
          }}
        />
      </Card>

      {/* 审核模态框 */}
      <Modal
        title="头像审核"
        open={isReviewModalVisible}
        onOk={handleReviewSubmit}
        onCancel={() => setIsReviewModalVisible(false)}
        width={700}
        okText="提交审核"
        cancelText="取消"
      >
        {currentAvatar && (
          <div>
            <Row gutter={24}>
              <Col span={12}>
                <div className="text-center">
                  <div className="mb-4">
                    <Image
                      src={currentAvatar.avatarUrl}
                      alt="头像"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{currentAvatar.nickname}</div>
                    <div className="text-sm text-gray-500">@{currentAvatar.username}</div>
                    <div className="text-sm text-gray-500">提交时间: {currentAvatar.submitTime}</div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="font-medium mb-2">AI审核结果</div>
                  <div className="flex items-center mb-3">
                    <div className="mr-2">总体评分:</div>
                    <Progress 
                      percent={Math.round(currentAvatar.aiReviewResult.score * 100)} 
                      size="small" 
                      status={
                        currentAvatar.aiReviewResult.score > 0.8 ? 'success' : 
                        currentAvatar.aiReviewResult.score > 0.5 ? 'normal' : 
                        'exception'
                      }
                    />
                  </div>
                  
                  <div className="font-medium mb-2">违规检测:</div>
                  {currentAvatar.aiReviewResult.categories.map((category, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div className="mr-2 w-16">{category.name}:</div>
                      <Tooltip title={`${Math.round(category.score * 100)}%`}>
                        <Progress 
                          percent={Math.round(category.score * 100)} 
                          size="small" 
                          showInfo={false}
                          status={
                            category.score < 0.1 ? 'success' : 
                            category.score < 0.3 ? 'normal' : 
                            'exception'
                          }
                        />
                      </Tooltip>
                      <div className="ml-2 text-sm">
                        {Math.round(category.score * 100)}%
                      </div>
                    </div>
                  ))}
                  
                  <div className="font-medium mb-1 mt-3">AI建议:</div>
                  <div className={`text-${
                    currentAvatar.aiReviewResult.status === 'pass' ? 'green' : 
                    currentAvatar.aiReviewResult.status === 'reject' ? 'red' : 
                    'orange'
                  }-500`}>
                    {currentAvatar.aiReviewResult.suggestion}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="font-medium mb-2">审核决定:</div>
                  <Radio.Group 
                    value={reviewDecision} 
                    onChange={(e) => setReviewDecision(e.target.value)}
                  >
                    <Radio value="approved">通过</Radio>
                    <Radio value="rejected">拒绝</Radio>
                  </Radio.Group>
                </div>
                
                {reviewDecision === 'rejected' && (
                  <div>
                    <div className="font-medium mb-2">拒绝原因:</div>
                    <TextArea 
                      rows={3} 
                      placeholder="请输入拒绝原因，将通知给用户"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* 图片预览 */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="预览" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default AvatarReviewPage;