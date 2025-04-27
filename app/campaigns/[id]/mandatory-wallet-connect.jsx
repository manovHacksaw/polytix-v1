import React from 'react';
import { Wallet, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you use Shadcn UI Button

const MandatoryWalletConnectDialog = ({ onConnectWallet, onGoBack }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      aria-modal="true"
      role="dialog"
      aria-labelledby="mandatory-connect-title"
    >
      <div
        className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow-2xl max-w-md w-full mx-4
                   transform transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in zoom-in-95"
        // Prevent clicks inside from propagating (though backdrop click isn't handled here)
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <Wallet className="h-12 w-12 text-blue-500 mb-4" />
          <h3
            id="mandatory-connect-title"
            className="text-xl font-semibold text-gray-900 dark:text-white mb-3"
          >
            Connect Wallet to Participate
          </h3>

          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
            To view campaign details, check your eligibility, register, vote, or view results, you need to connect your Web3 wallet first.
          </p>

          {/* Action Buttons */}
          <div className="grid gap-3 w-full">
            <Button
              onClick={onConnectWallet}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              size="lg" // Make the primary action prominent
            >
              <Wallet size={18} className="mr-2" />
              Connect Wallet
            </Button>

            <Button
              onClick={onGoBack}
              variant="outline"
              className="w-full"
            >
               <ArrowLeft size={16} className="mr-2" />
              Back to Campaigns
            </Button>
          </div>

           <p className="text-xs text-gray-400 dark:text-gray-500 mt-5">
            Connecting allows the platform to interact with the blockchain on your behalf (with your approval).
          </p>
        </div>
      </div>
    </div>
  );
};

export default MandatoryWalletConnectDialog;