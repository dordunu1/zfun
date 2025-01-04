import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiGrid, FiDollarSign, FiCreditCard, FiSettings, FiSun, FiMoon } from 'react-icons/fi';

export default function AdminLayout() {
  const location = useLocation();
  const [theme, setTheme] = React.useState(localStorage.getItem('admin-theme') || 'light');

  useEffect(() => {
    // Apply theme class to document root
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    // Store theme preference
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/admin', icon: <FiGrid />, label: 'Dashboard' },
    { path: '/admin/withdrawals', icon: <FiCreditCard />, label: 'Withdrawals' },
    { path: '/admin/sales', icon: <FiDollarSign />, label: 'Sales' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-[#FF1B6B]">Admin Panel</h1>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } transition-colors duration-200`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-14">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive(item.path)
                    ? 'border-[#FF1B6B] text-[#FF1B6B]'
                    : `border-transparent ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:border-gray-600 hover:text-gray-300'
                          : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        <Outlet />
      </main>
    </div>
  );
} 