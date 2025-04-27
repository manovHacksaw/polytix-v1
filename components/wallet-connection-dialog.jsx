import React, { useEffect } from 'react';
import { X, Wallet, ShieldCheck } from 'lucide-react'; // Added ShieldCheck for visual appeal
import { useContract } from '@/context/contract-context';

const WalletConnectionDialog = ({ onClose }) => {
  const { connect: connectWallet } = useContract();

  // Add escape key handler
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
      aria-modal="true" // Accessibility: Mark as modal
      role="dialog"     // Accessibility: Define role
      aria-labelledby="wallet-dialog-title" // Accessibility: Title reference
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 
                   overflow-hidden flex flex-col md:flex-row 
                   transform transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dialog
      >
        {/* Left Side - Visual */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white w-1/3">
          <Wallet size={64} className="mb-4 drop-shadow-lg" />
          <h2 className="text-2xl font-semibold text-center mb-2">Secure Connection</h2>
          <p className="text-sm text-blue-100 text-center opacity-90">
            Connect safely to access platform features.
          </p>
        </div>

        {/* Right Side - Content & Actions */}
        <div className="p-6 md:p-8 flex flex-col justify-between relative w-full md:w-2/3">
           {/* Close Button - Absolutely positioned top-right */}
           <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white
                       p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>

          <div> {/* Content Area */}
            <h3 id="wallet-dialog-title" className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
               <Wallet className="h-5 w-5 text-blue-500 md:hidden" /> {/* Icon for mobile */}
               Connect Your Wallet
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm md:text-base">
              To interact with campaigns and utilize all features, please connect your preferred Web3 wallet. Your assets remain secure and under your control.
            </p>

            {/* Security Note (Simplified) */}
            <div className="flex items-start gap-3 text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-8">
               <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
               <span>We will never perform transactions without your explicit approval. You can disconnect anytime.</span>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col gap-3">
             <button
              onClick={() => {
                connectWallet(); // Call the connect function from context
                // Optionally close the dialog immediately or wait for connection success/failure
                // onClose(); // Example: close immediately
              }}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 
                         text-white font-semibold rounded-lg transition-colors duration-200 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <Wallet size={18} className="mr-2" />
              Connect Wallet
            </button>

            <button
              onClick={onClose}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 
                         dark:hover:text-gray-200 transition-colors py-2 mt-2"
            >
              Maybe Later
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WalletConnectionDialog;