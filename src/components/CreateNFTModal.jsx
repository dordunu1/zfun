import React from 'react';
import { Dialog } from '@headlessui/react';
import { BiX } from 'react-icons/bi';

export default function CreateNFTModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-[#0d0e12] rounded-xl p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              Create NFT Collection
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <BiX size={24} />
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            NFT creation coming soon! Stay tuned for updates.
          </p>

          <button
            onClick={onClose}
            className="w-full px-6 py-2.5 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 