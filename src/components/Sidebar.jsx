import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaBars, 
  FaChevronLeft,
  FaPlus,
  FaFileAlt,
  FaThLarge,
  FaChartLine,
  FaClock,
  FaHistory,
  FaGithub, 
  FaTelegram, 
  FaDiscord, 
  FaTwitter,
  FaChartBar 
} from 'react-icons/fa';
import { BiHome, BiCollection } from 'react-icons/bi';

export default function Sidebar({ onOpenModal, onOpenNFTModal }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { icon: FaPlus, label: 'Create Token', action: onOpenModal, primary: true },
    { icon: FaFileAlt, label: 'Create NFT', action: onOpenNFTModal },
    { icon: BiHome, label: 'Dashboard', to: '/', isRouterLink: true },
    { icon: BiCollection, label: 'Collections', to: '/collections', isRouterLink: true },
    { icon: FaChartLine, label: 'Trending Tokens', href: '#' },
    { icon: FaChartBar, label: 'Activity', href: '#' },
    { icon: FaClock, label: 'Recent Tokens', href: '#' },
    { icon: FaHistory, label: 'History', href: '#' },
  ];

  const socialLinks = [
    { icon: FaTelegram, href: 'https://t.me/chriswilder', label: 'Telegram' },
    { icon: FaTwitter, href: 'https://x.com/realchriswilder', label: 'X (Twitter)' },
    { icon: FaDiscord, href: 'https://discord.com/users/chriswilder', label: 'Discord' },
    { icon: FaGithub, href: 'https://github.com/dordunu1', label: 'GitHub' },
  ];

  const renderMenuItem = (item, index) => {
    const commonClasses = `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
      ${item.primary 
        ? 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1b1f]'}
      ${isCollapsed ? 'justify-center' : ''}
      ${item.isRouterLink && isActive(item.to) ? 'bg-[#00ffbd] text-black' : ''}
    `;

    if (item.isRouterLink) {
      return (
        <Link
          key={index}
          to={item.to}
          className={commonClasses}
        >
          <item.icon size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="truncate">{item.label}</span>
          )}
        </Link>
      );
    }

    return (
      <button
        key={index}
        onClick={item.action || (() => {})}
        className={commonClasses}
      >
        <item.icon size={20} className="flex-shrink-0" />
        {!isCollapsed && (
          <div className="flex items-center justify-between w-full min-w-0 transition-opacity duration-200">
            <span className="truncate">{item.label}</span>
          </div>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`fixed top-8 -left-3 p-1.5 rounded-full bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 lg:hidden z-30 transition-all duration-300 ${
          isMobileOpen ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'
        }`}
      >
        <FaChevronLeft 
          size={12} 
          className={`transform transition-transform duration-200 text-gray-600 dark:text-gray-400
            ${!isMobileOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-white dark:bg-[#0d0e12] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-20 flex flex-col
          ${isCollapsed ? 'w-20' : 'w-64'} 
          lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Top Section */}
        <div className="p-6 relative">
          {/* Toggle Button - Desktop Only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-8 p-1.5 rounded-full bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 hidden lg:flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2d2f36] transition-all duration-200 z-50"
          >
            <FaChevronLeft 
              size={12} 
              className={`transform transition-transform duration-200 text-gray-600 dark:text-gray-400
                ${isCollapsed ? 'rotate-180' : ''}
              `}
            />
          </button>

          <div className="flex items-center mb-8">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-10 h-10" />
              {!isCollapsed && (
                <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-opacity duration-200">
                  Token Factory
                </h1>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </div>
        </div>

        {/* Social Links - Bottom */}
        <div className={`mt-auto p-6 transition-all duration-200 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          <div className={`flex gap-3 ${isCollapsed ? 'flex-col' : ''}`}>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                title={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}