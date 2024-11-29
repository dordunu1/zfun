import React from 'react';

const GlowingDots = () => {
  return (
    <div className="absolute top-3 right-3 flex gap-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-[#00ffbd] dark:bg-[#00ffbd] opacity-40 dark:opacity-100 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
};

export default GlowingDots; 