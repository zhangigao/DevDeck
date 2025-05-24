import React from 'react';
import { List, Avatar, Space, Typography, Button } from 'antd';
import { UserOutlined, FireOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface UserData {
  id: number;
  name: string;
  avatar?: string;
  postCount: number;
  isActive?: boolean;
}

interface ActiveUserListProps {
  users: UserData[];
}

const ActiveUserList: React.FC<ActiveUserListProps> = ({ users }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={users}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar 
                src={item.avatar} 
                icon={!item.avatar ? <UserOutlined /> : undefined}
              />
            }
            title={
              <Space>
                <Text strong>{item.name}</Text>
                {item.isActive && (
                  <FireOutlined style={{ color: '#f5222d' }} />
                )}
              </Space>
            }
            description={`发帖数: ${item.postCount}`}
          />
          <Button type="link" size="small">
            关注
          </Button>
        </List.Item>
      )}
    />
  );
};

export default ActiveUserList; 