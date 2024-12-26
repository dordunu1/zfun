import React from 'react';
import { useConnect } from 'wagmi';

export class WalletErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Check if it's the provider error
    if (error.message.includes('invalid EIP-1193 provider')) {
      return { hasError: true };
    }
    throw error;
  }

  render() {
    if (this.state.hasError) {
      return <MobileWalletConnect />;
    }

    return this.props.children;
  }
}

function MobileWalletConnect() {
  const { connect, connectors } = useConnect();
  
  // Filter out injected connector for mobile
  const mobileConnectors = connectors.filter(c => c.id !== 'injected');

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Connect Wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please connect using one of the following methods:
        </p>
        <div className="space-y-3">
          {mobileConnectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="w-full px-4 py-3 text-left rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
            >
              <span className="text-gray-900 dark:text-white font-medium">
                {connector.name}
              </span>
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 