import React from 'react';
import { Link } from 'react-router-dom';
import { BiPlus } from 'react-icons/bi';
import { useTheme } from '../context/ThemeContext';
import { useWallet } from '../context/WalletContext';

export default function Navbar({ onCreateClick }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { connect, disconnect, address, isConnected } = useWallet();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1b1f] border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              NFT Creator
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={onCreateClick}
              className="flex items-center gap-2 px-4 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-medium rounded-lg"
            >
              <BiPlus size={20} />
              Create
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>

            {/* Wallet Connection */}
            {isConnected ? (
              <button
                onClick={disconnect}
                className="px-4 py-2 bg-gray-100 dark:bg-[#2d2f36] text-gray-900 dark:text-white font-medium rounded-lg"
              >
                {address.slice(0, 6)}...{address.slice(-4)}
              </button>
            ) : (
              <button
                onClick={connect}
                className="px-4 py-2 bg-gray-100 dark:bg-[#2d2f36] text-gray-900 dark:text-white font-medium rounded-lg"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 