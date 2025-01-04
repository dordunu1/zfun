import { Navigate } from 'react-router-dom';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { motion } from 'framer-motion';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useMerchAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-12 h-12 rounded-full border-4 border-[#FF1B6B] border-t-transparent"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
} 