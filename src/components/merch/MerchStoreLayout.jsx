import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BiStore, BiArrowBack, BiLogOut, BiHomeAlt, BiPackage, BiCart, BiCog, BiDollarCircle, BiListPlus, BiHistory, BiUser, BiMenu, BiX } from 'react-icons/bi';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { toast, Toaster } from 'react-hot-toast';

const MerchStoreLayout = () => {
  const { logout, user, cartCount } = useMerchAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  // Navigation items based on user type
  const buyerNavItems = [
    { to: '/merch-store', icon: BiHomeAlt, label: 'Browse', exact: true },
    { to: '/merch-store/cart', icon: BiCart, label: 'Cart', count: cartCount },
    { to: '/merch-store/orders', icon: BiPackage, label: 'My Orders' },
    { to: '/merch-store/settings', icon: BiCog, label: 'Settings' },
  ];

  const sellerNavItems = [
    { to: '/merch-store/dashboard', icon: BiHomeAlt, label: 'Dashboard' },
    { to: '/merch-store/products', icon: BiStore, label: 'My Products' },
    { to: '/merch-store/add-product', icon: BiListPlus, label: 'Add Product' },
    { to: '/merch-store/sales', icon: BiDollarCircle, label: 'Sales' },
    { to: '/merch-store/orders-received', icon: BiHistory, label: 'Orders' },
    { to: '/merch-store/settings', icon: BiCog, label: 'Settings' },
  ];

  const navItems = user?.isSeller ? sellerNavItems : buyerNavItems;

  return (
    <div className="min-h-screen bg-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#FF1B6B',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Top Navigation */}
      <nav className="fixed top-0 right-0 left-0 bg-white shadow-sm z-50">
        <div className="w-full px-0">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center pl-4">
              {user && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-600 hover:text-[#FF1B6B] mr-2"
                >
                  {isMobileMenuOpen ? (
                    <BiX className="w-6 h-6" />
                  ) : (
                    <BiMenu className="w-6 h-6" />
                  )}
                </button>
              )}
              <Link to="/merch-store" className="flex items-center gap-2">
                <BiStore className="w-8 h-8 text-[#FF1B6B]" />
                <span className="text-xl font-bold text-[#FF1B6B] hidden sm:inline">
                  MerchStore
                </span>
              </Link>
              <div className="ml-4 px-3 py-1 bg-red-100 border border-red-200 rounded-full">
                <span className="text-xs font-medium text-red-600">Development Mode - No Real Transactions</span>
              </div>
            </div>

            {/* Right side */}
            <motion.div
              className="flex items-center gap-2 sm:gap-4 pr-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {user ? (
                <>
                  {!user.isSeller && (
                    <Link
                      to="/merch-store/become-seller"
                      className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#FF1B6B] text-[#FF1B6B] hover:bg-[#FF1B6B] hover:text-white transition-all duration-300"
                    >
                      Become a Seller
                    </Link>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 sm:gap-4">
                  <Link
                    to="/merch-store/login"
                    className="px-3 sm:px-4 py-2 text-[#FF1B6B] hover:text-[#D4145A] transition-colors text-sm sm:text-base"
                  >
                    Login
                  </Link>
                  <Link
                    to="/merch-store/signup"
                    className="px-3 sm:px-4 py-2 rounded-full bg-[#FF1B6B] text-white hover:bg-[#D4145A] transition-all duration-300 text-sm sm:text-base"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              <Link 
                to="/"
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full border-2 border-[#FF1B6B] text-[#FF1B6B] hover:bg-[#FF1B6B] hover:text-white transition-all duration-300 group text-sm sm:text-base"
              >
                <BiArrowBack className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium hidden sm:inline">Back to Token Factory</span>
                <span className="font-medium sm:hidden">Back</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {user && isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside 
              className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg z-50 lg:hidden overflow-y-auto"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Welcome,</p>
                    <p className="font-medium text-gray-900 text-lg">{user.name}</p>
                    <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                      user.isSeller 
                        ? 'bg-pink-50 text-[#FF1B6B]' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <BiUser className="w-4 h-4" />
                      <span>{user.isSeller ? 'Seller Account' : 'Buyer Account'}</span>
                    </div>
                  </div>
                </div>

                <nav className="flex-1 p-4">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          end={item.exact}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-[#FF1B6B] text-white'
                                : 'text-gray-600 hover:bg-pink-50 hover:text-[#FF1B6B]'
                            }`
                          }
                        >
                          <item.icon className="text-xl" />
                          <span>{item.label}</span>
                          {item.count > 0 && (
                            <span className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${
                              location.pathname === item.to
                                ? 'bg-white text-[#FF1B6B]'
                                : 'bg-[#FF1B6B] text-white'
                            }`}>
                              {item.count}
                            </span>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-pink-50 hover:text-[#FF1B6B] rounded-lg transition-colors"
                  >
                    <BiLogOut className="text-xl" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      {user && (
        <motion.aside 
          className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-50 hidden lg:block"
          initial={{ x: -64 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="h-full flex flex-col">
            <div className="p-6">
              <div className="mt-2">
                <p className="text-sm text-gray-500">Welcome,</p>
                <p className="font-medium text-gray-900">{user.name}</p>
                <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                  user.isSeller 
                    ? 'bg-pink-50 text-[#FF1B6B]' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <BiUser className="w-4 h-4" />
                  <span>{user.isSeller ? 'Seller Account' : 'Buyer Account'}</span>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-[#FF1B6B] text-white'
                            : 'text-gray-600 hover:bg-pink-50 hover:text-[#FF1B6B]'
                        }`
                      }
                    >
                      <item.icon className="text-xl" />
                      <span>{item.label}</span>
                      {item.count > 0 && (
                        <span className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${
                          location.pathname === item.to
                            ? 'bg-white text-[#FF1B6B]'
                            : 'bg-[#FF1B6B] text-white'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-pink-50 hover:text-[#FF1B6B] rounded-lg transition-colors"
              >
                <BiLogOut className="text-xl" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </motion.aside>
      )}

      {/* Main Content */}
      <div className={`${user ? 'lg:ml-64 mt-16' : 'mt-16'} min-h-[calc(100vh-4rem)] bg-white`}>
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MerchStoreLayout; 