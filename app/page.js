"use client"
import { ActiveCampaigns } from '@/components/active-campaigns'
import { CTASection } from '@/components/sections/cta-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { HeroSection } from '@/components/sections/HeroSection'
import { HowItWorksSection } from '@/components/sections/how-it-works'
import { useContract } from '@/context/contract-context'
import React, { useEffect } from 'react'


const page = () => {
  const {contract, address, chainId, isConnected, provider} = useContract();
  const listenForEvents = async () => {
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
  };
  
  useEffect(() => {
    listenForEvents();
  
   
  }, []);
  return (
    <div>
      <HeroSection/>
      <HowItWorksSection/>
      <ActiveCampaigns/>
<FeaturesSection/>
<CTASection/>
     


      
    </div>
  )
}

export default page