import React, { useState } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { BiChevronDown } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { unichainTestnet } from '../config/wagmi';
import { createPortal } from 'react-dom';

// Network configurations with logos, names, and sections
const NETWORKS = {
  mainnet: [
    {
      ...mainnet,
      logo: '/eth.png',
      name: 'Ethereum'
    },
    {
      id: 'unichain-mainnet',
      chainId: 1301,
      name: 'Unichain',
      logo: '/unichain-logo.png',
      disabled: true,
      comingSoon: true
    }
  ],
  testnet: [
    {
      ...sepolia,
      logo: '/sepolia.png',
      name: 'Sepolia'
    },
    {
      ...unichainTestnet,
      logo: '/unichain.png',
      name: 'Unichain Testnet'
    }
  ]
};

export default function NetworkSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { chain } = useNetwork();
  const { switchNetwork, isLoading } = useSwitchNetwork();
  const [buttonRect, setButtonRect] = useState(null);

  // Find current network across all sections
  const currentNetwork = [...NETWORKS.mainnet, ...NETWORKS.testnet].find(net => net.id === chain?.id) || NETWORKS.mainnet[0];

  const handleNetworkSwitch = async (network) => {
    if (network.disabled) {
      toast.error('This network is coming soon!');
      setIsOpen(false);
      return;
    }

    if (network.id === chain?.id) {
      setIsOpen(false);
      return;
    }

    try {
      await switchNetwork?.(network.id);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error('Failed to switch network');
    }
  };

  const handleButtonClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setButtonRect(rect);
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="relative" style={{ zIndex: 99999 }}>
        <button
          onClick={handleButtonClick}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#1a1b1f] hover:bg-gray-200 dark:hover:bg-[#2d2f36] disabled:opacity-50"
        >
          <img 
            src={currentNetwork.logo} 
            alt={currentNetwork.name}
            className="w-5 h-5 rounded-full"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentNetwork.name}
          </span>
          <BiChevronDown 
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isOpen && buttonRect && createPortal(
        <div 
          className="fixed"
          style={{
            top: `${buttonRect.bottom + 8}px`,
            left: `${buttonRect.left}px`,
            zIndex: 99999
          }}
        >
          <div className="w-56 rounded-lg bg-white dark:bg-[#1a1b1f] shadow-lg border border-gray-200 dark:border-gray-800 py-1">
            {/* Mainnet Section */}
            <div className="px-3 py-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Mainnet
              </div>
              {NETWORKS.mainnet.map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network)}
                  disabled={isLoading || network.disabled}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2d2f36] ${
                    network.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  } ${network.id === chain?.id ? 'bg-gray-100 dark:bg-[#2d2f36]' : ''}`}
                >
                  <img 
                    src={network.logo} 
                    alt={network.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {network.name}
                  </span>
                  {network.comingSoon && (
                    <span className="text-xs text-[#00ffbd] ml-auto">Coming Soon</span>
                  )}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-800 my-1" />

            {/* Testnet Section */}
            <div className="px-3 py-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Testnet
              </div>
              {NETWORKS.testnet.map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network)}
                  disabled={isLoading}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2d2f36] ${
                    network.id === chain?.id ? 'bg-gray-100 dark:bg-[#2d2f36]' : ''
                  }`}
                >
                  <img 
                    src={network.logo} 
                    alt={network.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {network.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
} 