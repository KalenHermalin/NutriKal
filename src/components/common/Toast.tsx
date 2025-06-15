import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  useEffect(() => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warn(message);
        break;
      case 'info':
        toast.info(message);
        break;
      default:
        toast(message);
    }
  }, [message, type]);

  return null;
};

export default Toast;
