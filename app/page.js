"use client"
import { useEffect, useState } from 'react'
import { useContract } from '@/context/contract-context'
import { HeroSection } from '@/components/sections/HeroSection'
import { HowItWorksSection } from '@/components/sections/how-it-works'
import { ActiveCampaigns } from '@/components/active-campaigns'
import { FeaturesSection } from '@/components/sections/features-section'
import { CTASection } from '@/components/sections/cta-section'
import WalletConnectionDialog from '@/components/wallet-connection-dialog'

// Updated Page Component
const Page = () => {
  const { contract, isConnected } = useContract();
  const [showDialog, setShowDialog] = useState(false);
  
  const listenForEvents = async () => {
    if (contract) {
      contract.on("CampaignCreated", (campaignId, creator, votingType, restriction, startTime, endTime, event) => {
        console.log("New Campaign Created, listened:", {
          campaignId: campaignId.toString(),
          creator,
          votingType,
          restriction,
          startTime: startTime.toString(),
          endTime: endTime.toString(),
          transactionHash: event.transactionHash
        });
      });
    }
  };
  
  useEffect(() => {
    if (contract) {
      listenForEvents();
    }
  }, [contract]);
  
  // Show dialog when user is not connected after 15 seconds
  useEffect(() => {
    if (!isConnected) {
      // Delayed appearance - 15 seconds
      const timer = setTimeout(() => {
        setShowDialog(true);
      }, 15000);
      
      return () => clearTimeout(timer);
    } else {
      setShowDialog(false);
    }
  }, [isConnected]);
  
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <ActiveCampaigns />
      <FeaturesSection />
      <CTASection />
      
      {showDialog && <WalletConnectionDialog onClose={() => setShowDialog(false)} />}
    </div>
  );
};

export default Page;