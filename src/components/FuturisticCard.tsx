import React from 'react';
import BorderCorner from './BorderCorner';
import GlowingDots from './GlowingDots';

interface FuturisticCardProps {
  children?: React.ReactNode;
}

const FuturisticCard: React.FC<FuturisticCardProps> = ({ children }) => {
  return (
    <div className="relative w-full h-full bg-white dark:bg-[#0a0f18] rounded-sm overflow-hidden group border border-gray-200 dark:border-gray-800">
      {/* Border Corners */}
      <BorderCorner position="top-left" />
      <BorderCorner position="top-right" />
      <BorderCorner position="bottom-left" />
      <BorderCorner position="bottom-right" />

      {/* Glowing Dots */}
      <GlowingDots />

      {/* Main Content */}
      <div className="relative z-10 w-full h-full p-8">
        {children}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00ffbd05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated Border Lines */}
      <div className="absolute top-8 right-8 left-8 h-[1px] bg-gradient-to-r from-transparent via-[#00ffbd40] to-transparent" />
      <div className="absolute bottom-8 right-8 left-8 h-[1px] bg-gradient-to-r from-transparent via-[#00ffbd40] to-transparent" />
      <div className="absolute left-8 top-8 bottom-8 w-[1px] bg-gradient-to-b from-transparent via-[#00ffbd40] to-transparent" />
      <div className="absolute right-8 top-8 bottom-8 w-[1px] bg-gradient-to-b from-transparent via-[#00ffbd40] to-transparent" />

      {/* Light theme overlay */}
      <div className="absolute inset-0 bg-white/50 dark:bg-transparent pointer-events-none" />
    </div>
  );
};

export default FuturisticCard; 