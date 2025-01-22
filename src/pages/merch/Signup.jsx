import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

export default function Signup() {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signup, loginWithGoogle } = useMerchAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Password validation regex
  const passwordRegex = {
    length: /.{6,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*]/
  };

  // Check password requirements
  const passwordChecks = {
    length: passwordRegex.length.test(formData.password),
    uppercase: passwordRegex.uppercase.test(formData.password),
    lowercase: passwordRegex.lowercase.test(formData.password),
    number: passwordRegex.number.test(formData.password),
    special: passwordRegex.special.test(formData.password)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Password validation
    const passwordRegex = {
      length: /.{6,}/,
      uppercase: /[A-Z]/,
      lowercase: /[a-z]/,
      number: /[0-9]/,
      special: /[!@#$%^&*]/
    };

    const validations = [
      { test: passwordRegex.length, message: 'Password must be at least 6 characters long' },
      { test: passwordRegex.uppercase, message: 'Password must include at least one uppercase letter' },
      { test: passwordRegex.lowercase, message: 'Password must include at least one lowercase letter' },
      { test: passwordRegex.number, message: 'Password must include at least one number' },
      { test: passwordRegex.special, message: 'Password must include at least one special character' }
    ];

    for (const validation of validations) {
      if (!validation.test.test(formData.password)) {
        toast.error(validation.message);
        setIsLoading(false);
        return;
      }
    }

    try {
      // Create user account using context's signup function
      await signup(formData.email, formData.password, { 
        name: formData.name,
        email: formData.email,
        isBuyer: true,
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        }
      });

      // Show success message and redirect
      toast.success('Account created successfully! Please sign in.');
      navigate('/merch-store/login', { 
        state: { 
          message: 'Account created successfully! Please sign in.',
          email: formData.email
        },
        replace: true 
      });

    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const userCredential = await loginWithGoogle();
      
      // Check if this was a new signup or returning user
      const userDoc = await getDoc(doc(db, 'users', userCredential.uid));
      const isNewUser = userDoc.data().createdAt === new Date().toISOString();
      
      // Show appropriate success message
      toast.success(isNewUser ? 'Account created successfully!' : 'Welcome back!');
      
      navigate('/merch-store', {
        replace: true
      });
    } catch (error) {
      setIsGoogleLoading(false);
      if (error.message !== 'Sign in cancelled') {
        toast.error(error.message);
      }
    }
  };

  // If we're in a loading state, don't show the form
  if (isGoogleLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#FFF5F7]'} flex items-center justify-center p-4`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[#FF1B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Setting up your account...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-[#FFF5F7]'} flex items-center justify-center p-4`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full space-y-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-xl`}
      >
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create an account</h2>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/merch-store/login" className="text-[#FF1B6B] hover:text-[#D4145A] font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent`}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent`}
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
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent pr-10`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 mt-1 pr-3 flex items-center ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Password must include:</p>
                <ul className="text-xs space-y-1 pl-1">
                  <li className={`flex items-center gap-2 ${passwordChecks.length ? 'text-green-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {passwordChecks.length && <FiCheck className="w-4 h-4" />}
                    <span>At least 6 characters</span>
                  </li>
                  <li className={`flex items-center gap-2 ${passwordChecks.uppercase ? 'text-green-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {passwordChecks.uppercase && <FiCheck className="w-4 h-4" />}
                    <span>At least one uppercase letter (A-Z)</span>
                  </li>
                  <li className={`flex items-center gap-2 ${passwordChecks.lowercase ? 'text-green-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {passwordChecks.lowercase && <FiCheck className="w-4 h-4" />}
                    <span>At least one lowercase letter (a-z)</span>
                  </li>
                  <li className={`flex items-center gap-2 ${passwordChecks.number ? 'text-green-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {passwordChecks.number && <FiCheck className="w-4 h-4" />}
                    <span>At least one number (0-9)</span>
                  </li>
                  <li className={`flex items-center gap-2 ${passwordChecks.special ? 'text-green-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {passwordChecks.special && <FiCheck className="w-4 h-4" />}
                    <span>At least one special character (!@#$%^&*)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent pr-10`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute inset-y-0 right-0 mt-1 pr-3 flex items-center ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#FF1B6B] hover:bg-[#D4145A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
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
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 border ${isDarkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 bg-white hover:bg-gray-50'} rounded-lg shadow-sm text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FcGoogle className="w-5 h-5" />
              {isGoogleLoading ? 'Setting up account...' : 'Google'}
            </button>
          </div>
        </form>

        <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          By creating an account, you agree to our{' '}
          <Link to="/merch-store/terms" className="text-[#FF1B6B] hover:text-[#D4145A]">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/merch-store/terms" className="text-[#FF1B6B] hover:text-[#D4145A]">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
} 