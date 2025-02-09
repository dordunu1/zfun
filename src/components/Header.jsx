import React from 'react';
import { BiSun, BiMoon } from 'react-icons/bi';
import { useTheme } from '../context/ThemeContext';
import { useAccount } from 'wagmi';
import NetworkSelector from './NetworkSelector';
import PriceTicker from './PriceTicker';

export default function Header() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isConnected } = useAccount();

  return (
    <header className="fixed top-0 right-0 lg:left-64 left-0 h-16 bg-white dark:bg-[#0d0e12] border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between z-10 transition-all duration-300">
      <PriceTicker />
      
      <div className="flex items-center gap-4">
        <NetworkSelector />
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1b1f] text-gray-600 dark:text-gray-300"
        >
          {isDarkMode ? <BiSun size={20} /> : <BiMoon size={20} />}
        </button>
      </div>
    </header>
  );
}