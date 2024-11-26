import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CreateTokenModal from './components/CreateTokenModal';
import FAQ from './components/FAQ';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  return (
    <ThemeProvider>
      <WalletProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0b0f]">
          <Toaster position="top-right" />
          <Sidebar onCreateToken={() => setIsModalOpen(true)} />
          <div className="flex-1">
            <Header />
            <main className="mt-16 p-8">
              <div className="text-center mt-20">
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Welcome to Token Factory
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Launch your own token on the Ethereum testnet. Start creating now!
                </p>
              </div>
            </main>
          </div>
          <CreateTokenModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
          <FAQ 
            isOpen={isFAQOpen}
            onClose={setIsFAQOpen}
          />
        </div>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;