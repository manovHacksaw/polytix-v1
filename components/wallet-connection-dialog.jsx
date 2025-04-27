import React, { useEffect } from 'react';
import { X, AlertCircle, ArrowRight, Wallet } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow-2xl max-w-md w-full mx-4 
        transform transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Connect Your Wallet</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
            p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Enhance your experience by connecting your wallet. This enables you to participate in campaigns and access all platform features.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">Your security is our priority:</p>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                  <li>We'll never access your funds without explicit approval</li>
                  <li>All transactions require your signature</li>
                  <li>Disconnect your wallet at any time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid gap-3">
          <button 
            onClick={connectWallet}
            className="flex items-center justify-between px-6 py-3 bg-blue-600 hover:bg-blue-700 
            text-white font-medium rounded-lg transition-colors group"
          >
            <span>Connect with MetaMask</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button 
            onClick={connectWallet}
            className="flex items-center justify-between px-6 py-3 border border-gray-300 
            dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 
            text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors group"
          >
            <span>Connect with WalletConnect</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 
            dark:hover:text-gray-300 transition-colors"
          >
            Remind me later
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionDialog;