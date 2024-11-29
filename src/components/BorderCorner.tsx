import React from 'react';

interface BorderCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const BorderCorner: React.FC<BorderCornerProps> = ({ position }) => {
  const baseClasses = "absolute w-8 h-8";
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 rotate-90',
    'bottom-left': 'bottom-0 left-0 -rotate-90',
    'bottom-right': 'bottom-0 right-0 rotate-180'
  };

  return (
    <div className={`${baseClasses} ${positionClasses[position]}`}>
      <div className="absolute w-full h-[2px] bg-[#00ffbd] dark:bg-[#00ffbd] opacity-40 dark:opacity-100" />
      <div className="absolute w-[2px] h-full bg-[#00ffbd] dark:bg-[#00ffbd] opacity-40 dark:opacity-100" />
      <div className="absolute w-2 h-2 bg-[#00ffbd] dark:bg-[#00ffbd] opacity-25 dark:opacity-50" />
    </div>
  );
};

export default BorderCorner; 