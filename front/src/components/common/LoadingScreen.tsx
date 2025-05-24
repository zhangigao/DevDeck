import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingScreenProps {
  fullScreen?: boolean;
  tip?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  fullScreen = true,
  tip = '加载中...'
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="text-center">
          <Spin indicator={antIcon} className="text-primary-500" />
          <div className="mt-4 text-lg text-gray-600 font-medium">
            {tip}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Spin indicator={antIcon} className="text-primary-500" />
        <div className="mt-4 text-lg text-gray-600 font-medium">
          {tip}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 