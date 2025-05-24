import React, { useEffect } from 'react';
import { notification } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearNotification } from '@/store/slices/uiSlice';

const NotificationContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { notification: notificationData } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    if (notificationData && notificationData.message) {
      notification[notificationData.type || 'info']({
        message: notificationData.title || '通知',
        description: notificationData.message,
        placement: notificationData.placement || 'topRight',
        duration: notificationData.duration || 4.5,
        onClose: () => {
          dispatch(clearNotification());
        },
      });
    }
  }, [notificationData, dispatch]);

  return null; // 这是一个逻辑组件，不渲染任何UI
};

export default NotificationContainer; 