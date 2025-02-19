import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export const Modal = ({ show, onClose, size = 'md', children }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    '3xl': 'max-w-7xl',
    '7xl': 'max-w-[80vw]',
    full: 'max-w-full'
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-[99999]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all`}>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.Header = function ModalHeader({ children }) {
  return (
    <Dialog.Title className="text-xl font-medium text-gray-900 dark:text-white p-6 border-b border-gray-200 dark:border-gray-700">
      {children}
    </Dialog.Title>
  );
};

Modal.Body = function ModalBody({ children }) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
}; 