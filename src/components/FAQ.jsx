import React, { useState } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import { BiX, BiHelpCircle } from 'react-icons/bi';

const tokenFaqs = [
  {
    question: "What security measures are in place?",
    answer: "The contract includes initialization protection, ownership controls via OpenZeppelin's Ownable, and ReentrancyGuard protection. Each token can only be initialized once and has input validation for names, symbols, and decimals. Learn more about OpenZeppelin's security features here: ",
    link: "https://docs.openzeppelin.com/contracts/4.x/api/security"
  },
  {
    question: "What can token creators do?",
    answer: "Token creators can set the initial supply, name, symbol, and decimals (up to 18) of their token. They receive full ownership of their created token and the initial supply is minted to their address. Read more about ERC20 implementation here: ",
    link: "https://docs.openzeppelin.com/contracts/4.x/erc20"
  },
  {
    question: "What are the limitations?",
    answer: "Tokens are non-upgradeable once deployed. There's no built-in burning mechanism, no additional minting after initial supply, no pausing functionality, and no token recovery mechanism."
  },
  {
    question: "What's the creation fee and how is it used?",
    answer: "The creation fee is 0.02 ETH. This fee helps cover operational costs including server maintenance, IPFS hosting, Firebase services, and most importantly, contributes to my audit fund. My goal is to undergo a comprehensive smart contract audit to ensure maximum security for our users."
  },
  {
    question: "Are the tokens standard ERC20?",
    answer: "Yes, all created tokens are standard ERC20 tokens using OpenZeppelin's implementation, ensuring compatibility with all ERC20-supporting platforms and wallets. Learn more about the standard here: ",
    link: "https://eips.ethereum.org/EIPS/eip-20"
  }
];

const nftFaqs = [
  {
    question: "What security features protect NFT creators and collectors?",
    answer: "Our NFT contracts implement multiple security layers including OpenZeppelin's ReentrancyGuard to prevent reentrancy attacks, Ownable for secure ownership management, and Pausable for emergency stops. We use ERC721Enumerable and ERC1155Supply for accurate token tracking. Learn more about these security features: ",
    link: "https://docs.openzeppelin.com/contracts/4.x/api/security"
  },
  {
    question: "How are NFT metadata and assets stored?",
    answer: "All NFT metadata and assets are stored on IPFS, ensuring decentralized and permanent storage. The IPFS hashes are immutably recorded on-chain. We use Pinata for reliable pinning services to ensure your NFT assets remain accessible."
  },
  {
    question: "What anti-bot measures are in place?",
    answer: "Our contracts include multiple bot prevention mechanisms: configurable mint limits per wallet, optional whitelist functionality, and transaction rate limiting. For whitelisted sales, we use Merkle trees for efficient and secure verification."
  },
  {
    question: "How does the whitelist system work?",
    answer: "Our whitelist implementation uses Merkle trees (via OpenZeppelin's MerkleProof) for gas-efficient and secure verification. Whitelisted addresses can have custom mint limits and pricing. Learn more about Merkle proofs: ",
    link: "https://docs.openzeppelin.com/contracts/4.x/api/utils#MerkleProof"
  },
  {
    question: "What royalty standards are supported?",
    answer: "We implement EIP-2981 for on-chain royalties, compatible with major marketplaces. Creators can set royalty percentages (up to 10%) that are enforced at the contract level. Read about the standard: ",
    link: "https://eips.ethereum.org/EIPS/eip-2981"
  },
  {
    question: "Can the contracts be upgraded after deployment?",
    answer: "No, our contracts are purposely non-upgradeable to ensure immutability and security. All parameters (baseURI, royalties, etc.) are set at deployment and cannot be changed unless specifically allowed through controlled functions."
  },
  {
    question: "What's the creation fee and how is it used?",
    answer: "The creation fee (0.02 ETH for ERC721, 0.025 ETH for ERC1155) supports our infrastructure costs including IPFS hosting, Firebase services, and server maintenance. A portion is allocated to our audit fund - we're actively working towards a comprehensive audit by a reputable firm."
  },
  {
    question: "What's the difference between ERC721 and ERC1155?",
    answer: "ERC721 tokens are unique, ideal for 1/1 artwork or unique collectibles. ERC1155 supports both fungible and non-fungible tokens, perfect for editions or collections with multiple copies. Learn more: ",
    link: "https://docs.openzeppelin.com/contracts/4.x/erc721"
  },
  {
    question: "How are gas costs optimized?",
    answer: "We implement several gas optimizations: efficient storage packing, minimal storage operations, optimized metadata handling, and batch minting support for ERC1155. Our contracts are thoroughly tested for gas efficiency."
  },
  {
    question: "What happens if something goes wrong?",
    answer: "Contracts include emergency pause functionality (for admins only) and clear error messages. While we can't modify or upgrade contracts, the pause feature provides a safety mechanism in extreme situations."
  }
];

export default function FAQ({ isOpen, onClose }) {
  return (
    <>
      <button
        onClick={() => onClose(true)}
        className="fixed bottom-6 right-6 bg-[#00ffbd] hover:bg-[#00e6a9] text-black p-3 rounded-full shadow-lg"
      >
        <BiHelpCircle size={24} />
      </button>

      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative bg-[#0a0b0f] rounded-lg p-6 max-w-md w-full">
            {/* Top left corner */}
            <div className="absolute -top-px -left-px w-24 h-24">
              <div className="absolute top-0 left-0 w-2 h-2 bg-[#00ffbd]" />
              <div className="absolute top-0 left-0 w-2 h-2 bg-[#00ffbd]" />
              <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#00ffbd]" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00ffbd]" />
            </div>

            {/* Top right corner */}
            <div className="absolute -top-px -right-px w-24 h-24">
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#00ffbd]" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#00ffbd]" />
              <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-[#00ffbd]" />
              <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r to-[#00ffbd]" />
            </div>

            {/* Bottom left corner */}
            <div className="absolute -bottom-px -left-px w-24 h-24">
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#00ffbd]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#00ffbd]" />
              <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-[#00ffbd]" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00ffbd]" />
            </div>

            {/* Bottom right corner */}
            <div className="absolute -bottom-px -right-px w-24 h-24">
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#00ffbd]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#00ffbd]" />
              <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-t from-[#00ffbd]" />
              <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r to-[#00ffbd]" />
            </div>

            {/* Three dots in top right */}
            <div className="absolute top-3 right-3 flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-[#00ffbd] rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            {/* Content container */}
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-semibold text-white">
                  Frequently Asked Questions
                </Dialog.Title>
                <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-300">
                  <BiX size={24} />
                </button>
              </div>

              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-[#1a1b1f] p-1 mb-6">
                  <Tab className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                     ${selected 
                      ? 'bg-[#00ffbd] text-black shadow'
                      : 'text-gray-400 hover:bg-[#2a2b2f] hover:text-white'
                     }`
                  }>
                    Tokens
                  </Tab>
                  <Tab className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                     ${selected 
                      ? 'bg-[#00ffbd] text-black shadow'
                      : 'text-gray-400 hover:bg-[#2a2b2f] hover:text-white'
                     }`
                  }>
                    NFTs
                  </Tab>
                </Tab.List>

                <div 
                  className="overflow-y-auto pr-2 custom-scrollbar" 
                  style={{ 
                    maxHeight: 'calc(80vh - 140px)',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#00ffbd #1a1b1f'
                  }}
                >
                  <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                      width: 4px;
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: #1a1b1f;
                      border-radius: 2px;
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: #00ffbd;
                      border-radius: 2px;
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: #00e6a9;
                    }
                  `}</style>

                  <Tab.Panels>
                    <Tab.Panel>
                      <div className="space-y-6">
                        {tokenFaqs.map((faq, index) => (
                          <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {faq.answer}
                              {faq.link && (
                                <a href={faq.link} target="_blank" rel="noopener noreferrer" className="text-[#00ffbd] hover:underline ml-1">
                                  Read more
                                </a>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className="space-y-6">
                        {nftFaqs.map((faq, index) => (
                          <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {faq.answer}
                              {faq.link && (
                                <a href={faq.link} target="_blank" rel="noopener noreferrer" className="text-[#00ffbd] hover:underline ml-1">
                                  Read more
                                </a>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </div>
              </Tab.Group>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}