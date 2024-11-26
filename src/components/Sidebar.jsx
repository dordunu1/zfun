import React from 'react';
import { BiPlus, BiTrendingUp, BiHistory, BiTime, BiGrid } from 'react-icons/bi';

export default function Sidebar({ onCreateToken }) {
  const menuItems = [
    { icon: BiGrid, text: 'Dashboard', active: true },
    { icon: BiTrendingUp, text: 'Trending Tokens' },
    { icon: BiTime, text: 'Recent Tokens' },
    { icon: BiHistory, text: 'History' }
  ];

  return (
    <div className="fixed w-64 h-screen bg-white dark:bg-[#0d0e12] text-gray-700 dark:text-gray-300 p-6 border-r border-gray-200 dark:border-gray-800">
      <button
        onClick={onCreateToken}
        className="w-full bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center mb-8 gap-2"
      >
        <BiPlus className="text-xl" />
        Create Token
      </button>

      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center py-2.5 px-4 rounded-lg transition-colors ${
              item.active 
                ? 'bg-gray-100 dark:bg-[#1a1b1f] text-gray-900 dark:text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-[#1a1b1f]'
            }`}
          >
            <item.icon className="mr-3 text-xl" />
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}