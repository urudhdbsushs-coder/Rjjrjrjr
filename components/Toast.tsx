
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 bg-gray-900 text-white py-3 px-5 rounded-lg shadow-2xl z-50 transform transition-all duration-500 fade-in">
      <p>{message}</p>
    </div>
  );
};

export default Toast;
