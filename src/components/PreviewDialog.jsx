import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { BiX, BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const PreviewDialog = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ensure data.nfts exists and is an array
  const nfts = Array.isArray(data.nfts) ? data.nfts : [];
  const totalPages = Math.ceil(nfts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Helper function to safely get prefix counts
  const getPrefixCounts = (metadata) => {
    if (!metadata) return {};
    if (metadata.prefix_counts) return metadata.prefix_counts;

    const prefixCounts = {};
    if (Array.isArray(nfts)) {
      nfts.forEach(nft => {
        if (nft.id) {
          const prefix = nft.id.split('-')[0];
          prefixCounts[prefix] = (prefixCounts[prefix] || 0) + 1;
        }
      });
    }
    return prefixCounts;
  };

  const prefixCounts = getPrefixCounts(data.metadata);
  const totalNFTs = Object.values(prefixCounts).reduce((sum, count) => sum + (parseInt(count) || 0), 0);
  const prefixGroupsCount = Object.keys(prefixCounts).length;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#0a0b0f] p-6 rounded-lg">
            {/* L-shaped corners */}
            <div className="absolute -top-[2px] -left-[2px] w-8 h-8">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -top-[2px] -right-[2px] w-8 h-8">
              <div className="absolute top-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute top-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8">
              <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>

            {/* Glowing dots in corners */}
            <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />

            <div className="relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Imported Collection Preview
                </h3>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1b1f] transition-colors cursor-pointer"
                >
                  <BiX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="bg-gray-100 dark:bg-[#151619] rounded-lg p-4">
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Collection Info</h3>
                    <div className="space-y-2">
                      <p className="text-gray-900 dark:text-gray-100">
                        <span className="font-semibold">Name:</span> {data?.metadata?.name || 'Untitled Collection'}
                      </p>
                      <p className="text-gray-900 dark:text-gray-100">
                        <span className="font-semibold">Description:</span> {data?.metadata?.description || 'No description'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Collection Stats</h3>
                      <p className="text-gray-900 dark:text-gray-100">
                        <span className="font-semibold">Total NFTs:</span> {totalNFTs}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Prefix Groups</h3>
                      <p className="text-gray-900 dark:text-gray-100">
                        <span className="font-semibold">Count:</span> {Object.keys(prefixCounts || {}).length}
                      </p>
                    </div>
                  </div>

                  {Object.keys(prefixCounts).length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Prefix Distribution</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(prefixCounts).map(([prefix, count]) => (
                          <div key={prefix} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-900 dark:text-gray-100">
                              <span className="font-semibold">{prefix}-:</span> {count}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {nfts.length > 0 && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sample NFTs</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>Showing {startIndex + 1}-{Math.min(endIndex, nfts.length)} of {nfts.length} NFTs</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              className="p-1 disabled:opacity-50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:hover:text-gray-600 dark:disabled:hover:text-gray-400"
                            >
                              <BiChevronLeft className="h-5 w-5" />
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className="p-1 disabled:opacity-50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:hover:text-gray-600 dark:disabled:hover:text-gray-400"
                            >
                              <BiChevronRight className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {nfts.slice(startIndex, endIndex).map((nft, index) => (
                          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="mb-1 text-gray-900 dark:text-gray-100">
                                  <span className="font-semibold">ID:</span> {nft.id}
                                </p>
                                <p className="mb-1 text-gray-900 dark:text-gray-100">
                                  <span className="font-semibold">Name:</span> {nft.name}
                                </p>
                                <p className="mb-1 text-gray-900 dark:text-gray-100">
                                  <span className="font-semibold">Description:</span> {nft.description}
                                </p>
                              </div>
                              <div>
                                <div>
                                  <p className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Properties:</p>
                                  <div className="grid grid-cols-1 gap-1">
                                    {Object.entries(nft).map(([key, value]) => {
                                      if (!['id', 'name', 'description', 'image', 'animation_url', 'attributes'].includes(key)) {
                                        return (
                                          <p key={key} className="text-sm text-gray-700 dark:text-gray-300">
                                            <span className="font-medium">{key}:</span> {value}
                                          </p>
                                        );
                                      }
                                      return null;
                                    })}
                                    {nft.attributes && nft.attributes.map((attr, idx) => (
                                      <p key={`attr-${idx}`} className="text-sm text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">{attr.trait_type}:</span> {attr.value}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.metadata?.traits && Object.keys(data.metadata.traits).length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Trait Types</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(data.metadata.traits).map(([trait, values]) => (
                          <div key={trait} className="bg-white dark:bg-[#1a1b1f] p-3 rounded">
                            <p className="font-medium mb-2">{trait}</p>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(values) ? values.map((value, i) => (
                                <span 
                                  key={i}
                                  className="inline-block px-2 py-1 text-xs rounded bg-gray-100 dark:bg-[#151619]"
                                >
                                  {value}
                                </span>
                              )) : (
                                <span className="text-sm">{values}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PreviewDialog; 