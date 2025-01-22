import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

export default function Login() {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useMerchAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If we have state from signup, pre-fill the email
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/merch-store');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Welcome!');
      navigate('/merch-store');
    } catch (error) {
      if (error.message !== 'Sign in cancelled') {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#FFF5F7]'} flex items-center justify-center p-4`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full space-y-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-xl`}
      >
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome back</h2>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <Link to="/merch-store/signup" className="text-[#FF1B6B] hover:text-[#D4145A] font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {location.state?.message && (
          <div className={`${isDarkMode ? 'bg-green-900 border-green-800' : 'bg-green-50 border-green-100'} border rounded-lg p-4`}>
            <p className={`text-sm ${isDarkMode ? 'text-green-100' : 'text-green-800'}`}>{location.state.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors`}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors pr-10`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 mt-1 pr-3 flex items-center ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#FF1B6B] focus:ring-[#FF1B6B] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/merch-store/forgot-password" className="font-medium text-[#FF1B6B] hover:text-[#D4145A]">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#FF1B6B] hover:bg-[#D4145A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 border ${isDarkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 bg-white hover:bg-gray-50'} rounded-lg shadow-sm text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B] transition-colors`}
            >
              <FcGoogle className="w-5 h-5" />
              Google
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 