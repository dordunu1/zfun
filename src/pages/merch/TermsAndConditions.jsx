import React from 'react';
import { FiShield, FiDollarSign, FiTruck, FiRefreshCw, FiUserCheck, FiUsers, FiSettings } from 'react-icons/fi';

export default function TermsAndConditions() {
  const sections = [
    {
      title: "Platform Fees and Charges",
      icon: <FiDollarSign className="w-6 h-6" />,
      items: [
        "5% platform fee is automatically deducted from each sale",
        "Refund requests will have a 5% fee deducted (platform fee is non-refundable)",
        "Minimum withdrawal amount: 5 USDC/USDT for sellers"
      ]
    },
    {
      title: "Order Processing and Shipping",
      icon: <FiTruck className="w-6 h-6" />,
      items: [
        "Sellers have 3 days to confirm shipping for orders",
        "Orders not shipped within 3 days may be automatically cancelled",
        "Sellers must provide valid tracking information when confirming shipping"
      ]
    },
    {
      title: "Refunds and Cancellations",
      icon: <FiRefreshCw className="w-6 h-6" />,
      items: [
        "Only cancelled orders are eligible for refund requests",
        "Refund requests typically take up to 1 week to process",
        "Refunds will be processed to the original payment address",
        "Platform fees (5%) are non-refundable on refunded orders"
      ]
    },
    {
      title: "Payment and Withdrawals",
      icon: <FiDollarSign className="w-6 h-6" />,
      items: [
        "Supported payment tokens: USDT and USDC",
        "Payments are processed on either Unichain or Polygon network",
        "Sellers are responsible for gas fees during withdrawals",
        "Withdrawals are processed on the seller's selected network"
      ]
    },
    {
      title: "Seller Obligations",
      icon: <FiUserCheck className="w-6 h-6" />,
      items: [
        "Sellers must maintain accurate product listings",
        "Sellers are responsible for order fulfillment within the 3-day window",
        "Sellers must handle shipping and provide tracking information",
        "Sellers' available balance reflects total sales minus platform fees and pending refunds"
      ]
    },
    {
      title: "Buyer Protection",
      icon: <FiShield className="w-6 h-6" />,
      items: [
        "3-day window to request refund for cancelled orders",
        "Refund amounts will be processed minus the 5% platform fee",
        "Buyers can track order status and shipping information",
        "Buyers can view refund request status and transaction details"
      ]
    },
    {
      title: "Platform Rights",
      icon: <FiSettings className="w-6 h-6" />,
      items: [
        "The platform reserves the right to pause operations if necessary",
        "Admin can update platform fees (maximum 10%)",
        "Platform may hold funds for pending refunds",
        "Platform maintains records of all transactions and activities"
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Please read these terms and conditions carefully before using the MerchStore platform. 
          These terms outline the rules and regulations for the use of our services.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <div 
            key={section.title}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#FF1B6B]/10 rounded-lg text-[#FF1B6B]">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              <ul className="space-y-3 text-gray-600">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2">
                    <span className="text-[#FF1B6B] mt-1.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mt-2">
          By using the MerchStore platform, you agree to these terms and conditions. 
          We reserve the right to modify these terms at any time.
        </p>
      </div>
    </div>
  );
} 