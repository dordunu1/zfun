import React, { useState, useEffect } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { getChadMinters, getEthPrice } from '../../../services/analytics';
import { useParams } from 'react-router-dom';

const RANK_EMOJIS = ['🏆', '🥈', '🥉'];

export default function ChadMinters() {
  const { symbol } = useParams();
  const [minters, setMinters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ethPrice, setEthPrice] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mintersData, usdPrice] = await Promise.all([
          getChadMinters(symbol),
          getEthPrice()
        ]);
        setMinters(mintersData);
        setEthPrice(usdPrice);
      } catch (error) {
        console.error('Error loading minters:', error);
        toast.error('Failed to load chad minters');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [symbol]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffbd]" />
      </div>
    );
  }

  const totalMinted = minters.reduce((sum, minter) => sum + minter.totalMinted, 0);

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Total Minters</div>
          <div className="text-2xl font-bold text-white">{minters.length}</div>
        </div>
        <div className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Total Minted</div>
          <div className="text-2xl font-bold text-white">{totalMinted}</div>
        </div>
        <div className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Avg. Per Minter</div>
          <div className="text-2xl font-bold text-white">
            {(totalMinted / minters.length || 0).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Minters List */}
      <div className="space-y-3">
        {minters.map((minter, index) => {
          const percentage = (minter.totalMinted / totalMinted) * 100;
          
          return (
            <div 
              key={minter.address}
              className="relative group rounded-lg p-4 border border-[#00ffbd]/30 bg-gradient-to-r from-[#00ffbd]/10 to-transparent hover:from-[#00ffbd]/20 transition-all duration-200"
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ffbd]/0 via-[#00ffbd]/5 to-[#00ffbd]/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-xl -z-10" />

              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm">
                  {index < 3 ? (
                    <span className="text-xl">{RANK_EMOJIS[index]}</span>
                  ) : (
                    <span className="text-lg font-bold text-[#00ffbd]">#{index + 1}</span>
                  )}
                </div>

                {/* Minter Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <button 
                      onClick={() => copyToClipboard(minter.address)}
                      className="text-sm text-white hover:text-[#00ffbd] transition-colors flex items-center gap-1 group/address"
                    >
                      {minter.address}
                      <BiCopy className="opacity-0 group-hover/address:opacity-100 transition-opacity" size={14} />
                    </button>

                    {/* Badge */}
                    <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm border border-[#00ffbd]/30">
                      {minter.totalMinted} mints
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <span>First Mint:</span>
                      <span className="text-white">
                        {new Date(minter.firstMint?.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                    {ethPrice && minter.totalValue && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <span>Total Value:</span>
                        <div className="flex items-center text-white">
                          <FaEthereum size={14} className="mr-1" />
                          {minter.totalValue.toFixed(2)}
                          <span className="text-gray-500 ml-1">
                            (${(minter.totalValue * ethPrice).toLocaleString()})
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="text-gray-400">
                      <span>Share: </span>
                      <span className="text-white">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-1 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00ffbd] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {minters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400">No minting activity yet</div>
          </div>
        )}
      </div>

      {minters.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="px-4 py-2 text-sm text-[#00ffbd] bg-[#00ffbd]/10 rounded-lg hover:bg-[#00ffbd]/20 transition-colors">
            Load More
          </button>
        </div>
      )}
    </div>
  );
} 