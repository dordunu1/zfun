import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BiTime } from 'react-icons/bi';
import { MdLocalOffer } from 'react-icons/md';
import CountdownTimer from '../shared/CountdownTimer';

const FeaturedDeals = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter only products with active discounts
  const discountedProducts = products.filter(product => 
    product.hasDiscount && 
    product.discountEndsAt && 
    new Date(product.discountEndsAt) > new Date()
  ).sort((a, b) => new Date(a.discountEndsAt) - new Date(b.discountEndsAt));

  useEffect(() => {
    if (discountedProducts.length <= 4) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 4;
        return next >= discountedProducts.length ? 0 : next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [discountedProducts.length]);

  if (discountedProducts.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-pink-500/5 via-pink-500/10 to-purple-500/5 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#FF1B6B] text-white rounded-full">
          <MdLocalOffer className="text-xl animate-pulse" />
          <span className="font-bold">HOT DEALS</span>
        </div>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-pink-500/20 to-transparent rounded-full" />
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence initial={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {discountedProducts.slice(currentIndex, currentIndex + 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link 
                  to={`/merch-store/product/${product.id}`}
                  className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative"
                >
                  {/* Glowing effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/50 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FF1B6B] text-white rounded-full text-sm font-bold">
                          <span>{product.discountPercent}% OFF</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white rounded-full text-sm">
                          <BiTime className="text-base animate-pulse" />
                          <CountdownTimer endsAt={product.discountEndsAt} />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-white font-medium line-clamp-1">{product.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <span className="text-[#FF1B6B] font-bold">
                                ${product.discountedPrice.toFixed(2)}
                              </span>
                              <span className="text-gray-300 text-sm line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                            <img
                              src={product.tokenLogo}
                              alt={product.acceptedToken}
                              className="w-4 h-4"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full">
                          <img 
                            src={product.network === 'polygon' ? '/polygon.png' : '/unichain-logo.png'} 
                            alt={product.network} 
                            className="w-4 h-4"
                          />
                          <span className="text-xs font-medium text-white capitalize">
                            {product.network}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Navigation dots */}
        {discountedProducts.length > 4 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: Math.ceil(discountedProducts.length / 4) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * 4)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / 4) === i 
                    ? 'bg-[#FF1B6B] w-4' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedDeals; 