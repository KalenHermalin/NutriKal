import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  color = 'text-primary', 
  text 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <motion.div
        className={`rounded-full border-t-transparent border-solid ${color} border-4`}
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <p className="mt-4 text-muted text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
