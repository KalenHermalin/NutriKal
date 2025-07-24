import React from 'react';
import { motion } from 'framer-motion';

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label: string;
  unit?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  size = 120,
  strokeWidth = 12,
  color = 'primary',
  label,
  unit = 'g'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            className="text-muted/20"
            style={{
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth,
            }}
            cx={size / 2}
            cy={size / 2}
            r={radius}
          />
          
          {/* Progress circle */}
          <motion.circle
            className={`text-${color}`}
            style={{
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth,
              strokeDasharray: circumference,
              strokeLinecap: 'round',
            }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            cx={size / 2}
            cy={size / 2}
            r={radius}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold leading-none">{value.toFixed(1)}{unit}</span>
          <span className="text-xs text-muted">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
