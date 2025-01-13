import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiX, BiCheckCircle, BiPackage, BiTime, BiWallet } from 'react-icons/bi';

const WithdrawalTermsModal = ({ isOpen, onClose, onAccept, token }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isWaitingWallet, setIsWaitingWallet] = useState(false);

  const handleAccept = async () => {
    if (termsAccepted) {
      setIsWaitingWallet(true);
      try {
        await onAccept();
      } finally {
        setIsWaitingWallet(false);
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">Withdrawal Terms & Conditions</h3>
                <button
                  onClick={onClose}
                  disabled={isWaitingWallet}
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BiX className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {isWaitingWallet ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="relative">
                      <BiWallet className="w-12 h-12 text-[#FF1B6B]" />
                      <motion.div
                        className="absolute inset-0 border-2 border-[#FF1B6B] rounded-lg"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    <p className="text-gray-900 font-medium text-center">Please confirm the withdrawal request in your wallet</p>
                    <p className="text-gray-500 text-sm text-center">Waiting for wallet confirmation...</p>
                  </div>
                ) : (
                  <>
                    {/* Timeline */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-pink-50 rounded-lg">
                          <BiPackage className="w-6 h-6 text-[#FF1B6B]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Order Processing</h4>
                          <p className="text-gray-600 mt-1">
                            When an order is placed, you have 3 days to confirm shipping. The order amount will be held in escrow during this period.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-pink-50 rounded-lg">
                          <BiTime className="w-6 h-6 text-[#FF1B6B]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Funds Release</h4>
                          <p className="text-gray-600 mt-1">
                            After shipping confirmation, funds will be held for 14 days to ensure successful delivery. This amount will then be added to your available balance.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-pink-50 rounded-lg">
                          <BiCheckCircle className="w-6 h-6 text-[#FF1B6B]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Withdrawal Processing</h4>
                          <p className="text-gray-600 mt-1">
                            Your {token} withdrawal will be processed after the 14-day holding period from the shipping confirmation date.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Terms Acceptance */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mt-1 h-4 w-4 text-[#FF1B6B] focus:ring-[#FF1B6B] rounded"
                        />
                        <span className="text-sm text-gray-600">
                          I understand that funds from orders are released to my available balance only after:
                          1) Confirming shipping within 3 days of order placement
                          2) A 14-day holding period after shipping confirmation
                          I also understand that withdrawal requests will be processed after these conditions are met.
                        </span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t">
                <button
                  onClick={handleAccept}
                  disabled={!termsAccepted || isWaitingWallet}
                  className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 ${
                    termsAccepted && !isWaitingWallet
                      ? 'bg-[#FF1B6B] hover:bg-[#D4145A]'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isWaitingWallet ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <span>Waiting for Confirmation...</span>
                    </>
                  ) : (
                    'Accept & Request Withdrawal'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WithdrawalTermsModal; 