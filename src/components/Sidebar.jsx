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
  FaChartBar,
  FaLink
} from 'react-icons/fa';
import { BiHome, BiCollection, BiHistory, BiHomeAlt, BiCoin } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai'
import { BsCollection, BsClockHistory } from 'react-icons/bs'
import { HiOutlineHome } from 'react-icons/hi'
import { MdOutlineLocalActivity } from 'react-icons/md'
import { TbChartCandle } from 'react-icons/tb'
import { RiPaintLine, RiUserLine } from 'react-icons/ri'

export default function Sidebar({ onOpenModal, onOpenNFTModal }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    // Primary Actions Group
    {
      icon: BiCoin,
      label: 'Create Token',
      action: onOpenModal,
      primary: true,
    },
    {
      icon: RiPaintLine,
      label: 'Create NFT',
      action: onOpenNFTModal,
    },
    // Divider
    { type: 'divider' },
    // Main Navigation Group
    {
      icon: HiOutlineHome,
      label: 'Dashboard',
      to: '/',
      isRouterLink: true,
    },
    {
      icon: BsCollection,
      label: 'Collections',
      to: '/collections',
      isRouterLink: true,
      noDefaultHighlight: true,
    },
    // Divider
    { type: 'divider' },
    // Trading & Analytics Group
    {
      icon: FaChartLine,
      label: 'Trading',
      to: '/trading',
      isRouterLink: true,
    },
    {
      icon: FaLink,
      label: 'Bridge',
      to: '/bridge',
      isRouterLink: true,
    },
    {
      icon: TbChartCandle,
      label: 'Trending Tokens',
      to: '#',
      isRouterLink: true,
      comingSoon: true
    },
    {
      icon: BsClockHistory,
      label: 'Recent Tokens',
      to: '#',
      isRouterLink: true,
      comingSoon: true
    },
    // Divider
    { type: 'divider' },
    // User Section
    {
      icon: RiUserLine,
      label: 'Account',
      to: '/account',
      isRouterLink: true,
      noDefaultHighlight: true,
    },
    {
      icon: BiHistory,
      label: 'History',
      to: '/history',
      isRouterLink: true,
    },
  ];

  const socialLinks = [
    { icon: FaTelegram, href: 'https://t.me/chriswilder', label: 'Telegram' },
    { icon: FaTwitter, href: 'https://x.com/TokenFac', label: 'X (Twitter)' },
    { icon: FaDiscord, href: 'https://discord.com/users/chriswilder', label: 'Discord' },
    { icon: FaGithub, href: 'https://github.com/dordunu1', label: 'GitHub' },
  ];

  const renderMenuItem = (item, index) => {
    // Handle divider
    if (item.type === 'divider') {
      return (
        <div key={`divider-${index}`} className="my-2 border-b border-gray-200 dark:border-gray-800" />
      );
    }

    const commonClasses = `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 relative group
      ${item.primary 
        ? 'text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-black hover:bg-[#00ffbd] font-semibold' 
        : `text-gray-800 dark:text-gray-200 ${!item.comingSoon ? 'hover:text-black dark:hover:text-black hover:bg-[#00ffbd]' : 'cursor-default opacity-50'} 
           ${item.isRouterLink && isActive(item.to) && !item.noDefaultHighlight ? 'text-[#00ffbd]' : ''}`}
      ${isCollapsed ? 'justify-center' : ''}
    `;

    if (item.isRouterLink) {
      return (
        <Link
          key={index}
          to={item.to}
          className={commonClasses}
          onClick={item.comingSoon ? (e) => e.preventDefault() : undefined}
        >
          <item.icon size={20} className={`flex-shrink-0 ${item.isRouterLink && isActive(item.to) && !item.noDefaultHighlight ? 'text-[#00ffbd]' : ''}`} />
          {!isCollapsed && (
            <span className="truncate">{item.label}</span>
          )}
          {item.comingSoon && !isCollapsed && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Coming Soon
            </span>
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