import React from 'react';
import { FaEthereum } from 'react-icons/fa';

const TokenIcon = ({ type, size = "small", network = "sepolia" }) => {
  const sizeClasses = size === "large" ? "w-6 h-6" : "w-4 h-4";
  
  // Handle native token based on network
  if (!type || type === 'native') {
    if (network === 'polygon') {
      return (
        <div className="bg-white dark:bg-[#1a1b1f] rounded-full p-0.5">
          <img src="/logos/pol.png" alt="MATIC" className={sizeClasses} />
        </div>
      );
    }
    return <FaEthereum className="text-gray-600 dark:text-gray-400" size={size === "large" ? 24 : 16} />;
  }

  // Handle other tokens
  switch (type) {
    case 'usdc':
      return (
        <div className="bg-white dark:bg-[#1a1b1f] rounded-full p-0.5">
          <img src="/logos/usdc.png" alt="USDC" className={sizeClasses} />
        </div>
      );
    case 'usdt':
      return (
        <div className="bg-white dark:bg-[#1a1b1f] rounded-full p-0.5">
          <img src="/logos/usdt.png" alt="USDT" className={sizeClasses} />
        </div>
      );
    default:
      return <FaEthereum className="text-gray-600 dark:text-gray-400" size={size === "large" ? 24 : 16} />;
  }
};

export default TokenIcon; 