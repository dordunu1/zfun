import React from 'react';
import { motion } from 'framer-motion';
import { FaEthereum, FaBitcoin, FaCoins, FaCog } from 'react-icons/fa';
import { SiDogecoin, SiLitecoin, SiRipple, SiCardano } from 'react-icons/si';

const CryptoSplash = () => {
  // Factory production coins
  const factoryCoins = [
    // Source container coins (left side - static)
    { Icon: FaEthereum, delay: 0, y: -10, x: -70, scale: 0.9, static: true },
    { Icon: FaBitcoin, delay: 0.2, y: -12, x: -68, scale: 0.85, static: true },
    { Icon: SiDogecoin, delay: 0.4, y: -8, x: -72, scale: 0.8, static: true },
    
    // Production line coins (moving from left container to right)
    { Icon: FaEthereum, delay: 0, y: -10, x: -70, scale: 1.0 },
    { Icon: FaBitcoin, delay: 0.4, y: -12, x: -70, scale: 0.95 },
    { Icon: SiDogecoin, delay: 0.8, y: -8, x: -70, scale: 0.9 },
    { Icon: SiLitecoin, delay: 1.2, y: -14, x: -70, scale: 1.0 },
    { Icon: SiRipple, delay: 1.6, y: -10, x: -70, scale: 0.95 },
    { Icon: SiCardano, delay: 2.0, y: -12, x: -70, scale: 1.0 },
    { Icon: FaCoins, delay: 2.4, y: -8, x: -70, scale: 0.9 },
    
    // Target container coins (right side - static)
    { Icon: FaBitcoin, delay: 0, y: -10, x: 65, scale: 0.8, static: true },
    { Icon: SiDogecoin, delay: 0.2, y: -14, x: 68, scale: 0.75, static: true },
    { Icon: FaEthereum, delay: 0.4, y: -12, x: 62, scale: 0.85, static: true },
    { Icon: SiLitecoin, delay: 0.6, y: -8, x: 70, scale: 0.7, static: true },
  ];

  // Container pulse animation
  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: [0.15, 0.2, 0.15],
      scale: [0.95, 1, 0.95],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Border shimmer animation
  const borderVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: [0, 1, 0],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Gear rotation animation
  const gearVariants = {
    initial: { rotate: 0, opacity: 0.4 },
    animate: { 
      rotate: 360,
      opacity: [0.4, 0.7, 0.4],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Static coin variants
  const staticCoinVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: (custom) => ({
      opacity: [0.4, 0.5, 0.4],
      scale: custom.scale,
      transition: {
        opacity: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        },
        scale: {
          duration: 0.5,
          delay: custom.delay
        }
      }
    })
  };

  // Moving coin variants with enhanced path
  const movingCoinVariants = {
    initial: { 
      opacity: 0,
      scale: 0,
      x: -70,
      y: custom => custom.y,
      rotate: 0
    },
    animate: (custom) => ({
      opacity: [0, 1, 1, 1, 0],
      scale: [0, custom.scale, custom.scale * 1.1, custom.scale, 0],
      rotate: [0, 180, 360, 540, 720],
      y: [
        custom.y,
        custom.y - 20, // Arc up
        custom.y - 25, // Peak
        custom.y - 15, // Arc down
        custom.y
      ],
      x: [-70, -20, 0, 40, 65], // Improved path with processing pause
      transition: {
        duration: 3,
        delay: custom.delay,
        repeat: Infinity,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  // Particle animation for container activity
  const particleVariants = {
    initial: { opacity: 0, y: 0 },
    animate: { 
      opacity: [0, 0.5, 0],
      y: [-10, 10],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="relative w-[480px] h-48"
      initial="initial"
      animate="animate"
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ffbd]/5 to-transparent" 
        style={{ 
          backgroundSize: '20px 20px',
          backgroundImage: 'linear-gradient(to right, #00ffbd05 1px, transparent 1px), linear-gradient(to bottom, #00ffbd05 1px, transparent 1px)'
        }} 
      />

      {/* Source container (left) */}
      <motion.div
        variants={containerVariants}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-28 h-28 rounded-lg border border-[#00ffbd]/20 bg-[#00ffbd]/5"
        style={{ 
          boxShadow: '0 0 20px rgba(0, 255, 189, 0.15)',
          backdropFilter: 'blur(8px)'
        }}
      >
        {/* Container particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`particle-left-${i}`}
            variants={particleVariants}
            className="absolute w-1 h-1 rounded-full bg-[#00ffbd]/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </motion.div>

      {/* Target container (right) */}
      <motion.div
        variants={containerVariants}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-28 h-28 rounded-lg border border-[#00ffbd]/20 bg-[#00ffbd]/5"
        style={{ 
          boxShadow: '0 0 20px rgba(0, 255, 189, 0.15)',
          backdropFilter: 'blur(8px)'
        }}
      >
        {/* Container particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`particle-right-${i}`}
            variants={particleVariants}
            className="absolute w-1 h-1 rounded-full bg-[#00ffbd]/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </motion.div>

      {/* Conveyor belt effect */}
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-64 h-6">
        <div className="absolute inset-0 bg-[#00ffbd]/5 rounded-full" />
        <motion.div
          animate={{
            backgroundPosition: ['0px 0px', '20px 0px'],
            transition: { duration: 1, repeat: Infinity, ease: "linear" }
          }}
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 255, 189, 0.1) 10px, rgba(0, 255, 189, 0.1) 20px)',
          }}
        />
      </div>

      {/* Processing beam effect */}
      <motion.div
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-20 bg-[#00ffbd]/10 rounded-full blur-md"
      />

      {/* Rotating gears */}
      <motion.div
        variants={gearVariants}
        className="absolute left-24 top-1/2 -translate-y-1/2 w-8 h-8 text-[#00ffbd]"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(0, 255, 189, 0.5))'
        }}
      >
        <FaCog className="w-full h-full" />
      </motion.div>
      <motion.div
        variants={gearVariants}
        className="absolute right-24 top-1/2 -translate-y-1/2 w-8 h-8 text-[#00ffbd]"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(0, 255, 189, 0.5))'
        }}
      >
        <FaCog className="w-full h-full" />
      </motion.div>

      {/* Static coins */}
      {factoryCoins.filter(coin => coin.static).map((coin, index) => (
        <motion.div
          key={`static-${index}`}
          custom={coin}
          variants={staticCoinVariants}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            transform: `translate(${coin.x}px, ${coin.y}px)`
          }}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <coin.Icon 
              className="text-[#00ffbd]/50"
              style={{ 
                filter: 'drop-shadow(0 0 8px rgba(0, 255, 189, 0.3))',
                width: '100%',
                height: '100%'
              }}
            />
          </div>
        </motion.div>
      ))}

      {/* Moving coins with trails */}
      {factoryCoins.filter(coin => !coin.static).map((coin, index) => (
        <motion.div
          key={`moving-${index}`}
          custom={coin}
          variants={movingCoinVariants}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {/* Coin trail */}
          <motion.div
            className="absolute w-full h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #00ffbd20)',
              filter: 'blur(4px)',
              width: '20px',
              height: '2px',
              transform: 'translateX(-10px)'
            }}
          />
          <div className="w-8 h-8 flex items-center justify-center">
            <coin.Icon 
              className="text-[#00ffbd]"
              style={{ 
                filter: 'drop-shadow(0 0 12px rgba(0, 255, 189, 0.5))',
                width: '100%',
                height: '100%'
              }}
            />
          </div>
        </motion.div>
      ))}

      {/* Processing stage indicators */}
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-64 flex justify-between items-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-[#00ffbd]"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          className="w-2 h-2 rounded-full bg-[#00ffbd]"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
          className="w-2 h-2 rounded-full bg-[#00ffbd]"
        />
      </div>
    </motion.div>
  );
};

export default CryptoSplash; 