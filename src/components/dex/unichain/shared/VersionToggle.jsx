import React from 'react';
import { useUniswapVersion } from '../../../../hooks/useUniswapVersion';

export default function VersionToggle() {
  const { version, setVersion } = useUniswapVersion();

  return (
    <div className="flex items-center justify-center space-x-2 p-1.5 bg-white/10 dark:bg-[#1a1b1f] rounded-xl border border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setVersion('v2')}
        className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
          version === 'v2'
            ? 'bg-[#00ffbd] text-black shadow-[0_0_10px_#00ffbd]'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        V2
      </button>
      <button
        onClick={() => setVersion('v3')}
        className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
          version === 'v3'
            ? 'bg-[#00ffbd] text-black shadow-[0_0_10px_#00ffbd]'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        V3
      </button>
    </div>
  );
} 