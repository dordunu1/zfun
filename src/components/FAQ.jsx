import React from 'react';
import { Dialog } from '@headlessui/react';
import { BiX, BiHelpCircle } from 'react-icons/bi';

const faqs = [
  {
    question: "What security measures are in place?",
    answer: "The contract includes initialization protection, ownership controls via OpenZeppelin's Ownable, and ReentrancyGuard protection. Each token can only be initialized once and has input validation for names, symbols, and decimals."
  },
  {
    question: "What can token creators do?",
    answer: "Token creators can set the initial supply, name, symbol, and decimals (up to 18) of their token. They receive full ownership of their created token and the initial supply is minted to their address."
  },
  {
    question: "What are the limitations?",
    answer: "Tokens are non-upgradeable once deployed. There's no built-in burning mechanism, no additional minting after initial supply, no pausing functionality, and no token recovery mechanism."
  },
  {
    question: "What's the creation fee?",
    answer: "The creation fee is fixed at 0.02 ETH. This fee is required to create a new token and can only be withdrawn by the factory owner."
  },
  {
    question: "Are the tokens standard ERC20?",
    answer: "Yes, all created tokens are standard ERC20 tokens using OpenZeppelin's implementation, ensuring compatibility with all ERC20-supporting platforms and wallets."
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
          <Dialog.Panel className="bg-white dark:bg-[#0d0e12] rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                Frequently Asked Questions
              </Dialog.Title>
              <button onClick={() => onClose(false)} className="text-gray-500 hover:text-gray-700">
                <BiX size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}