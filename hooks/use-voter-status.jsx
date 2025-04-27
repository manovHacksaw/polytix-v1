"use client"

import { useState, useEffect, useCallback } from "react"
import { useContract } from "@/context/contract-context"

// Define enum values locally to match the ACTUAL CONTRACT returns
const VotingRestriction = {
  OpenToAll: 0,
  Limited: 1,
  RequiredRegistration: 2,
}

// **** CORRECTED ENUM VALUES TO MATCH CONTRACT ****
const RegistrationType = {
  Voter: 0,     // Matches contract return for Voter
  Candidate: 1, // Matches contract return for Candidate
  // We don't need a 'None' here because the contract reverts if not registered.
}

export function useVoterStatus(campaignId) {
  const { contract, address, isConnected } = useContract()
  const [isLoading, setIsLoading] = useState(true)
  const [isRegisteredVoter, setIsRegisteredVoter] = useState(false) // Eligible based on registration rules
  const [isRegisteredCandidate, setIsRegisteredCandidate] = useState(false) // Specifically a candidate
  const [hasVoted, setHasVoted] = useState(false)
  const [error, setError] = useState(null)

  const checkVoterStatus = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    if (!contract || !isConnected || !address || !campaignId) {
      console.log("VoterStatus Hook: Prerequisites not met.");
      setIsLoading(false);
      return { isRegisteredVoter: false, isRegisteredCandidate: false, hasVoted: false, error: "Prerequisites not met", isLoading: false };
    }

    console.log(`VoterStatus Hook: Checking status for campaign ${campaignId} and address ${address}`);
    let status = {
        isRegisteredVoter: false,
        isRegisteredCandidate: false,
        hasVoted: false,
        error: null,
        isLoading: true,
    };

    try {
      const campaignInfo = await contract.getCampaignBasicInfo(campaignId)
      const restrictionType = Number(campaignInfo[1])

      let userRegType; // Will hold 0 or 1 if registered, otherwise undefined
      let isEligibleBasedOnRegistration = false; // Default to false

      if (restrictionType === VotingRestriction.RequiredRegistration) {
        try {
          const rawRegType = await contract.getUserRegistrationType(campaignId, address);
          userRegType = Number(rawRegType); // Convert uint8/BigInt to number

          console.log(" ---------------------- >USER REGISTRATION TYPE RAW", rawRegType);
          console.log(" ---------------------- >USER REGISTRATION TYPE NUMBER", userRegType);

          // Check if the user is registered as EITHER Voter (0) or Candidate (1)
          if (userRegType === RegistrationType.Voter || userRegType === RegistrationType.Candidate) {
             isEligibleBasedOnRegistration = true;
          } else {
              // Should not happen if contract returns only 0 or 1, but safety check
              console.warn(`VoterStatus Hook: Unexpected registration type value: ${userRegType}`);
              isEligibleBasedOnRegistration = false;
          }

        } catch (regError) {
          // This catch block specifically handles the "User not registered" revert
          if (regError.message?.includes("User not registered") || regError.reason?.includes("User not registered") || regError.error?.message?.includes("User not registered") ) {
            console.log(`VoterStatus Hook: User is not registered for required campaign ${campaignId}.`);
            // userRegType remains undefined
            isEligibleBasedOnRegistration = false;
          } else {
            // Re-throw other unexpected errors
            console.error(`VoterStatus Hook: Unexpected error checking registration type:`, regError);
            throw new Error("Failed to check registration status.");
          }
        }
      } else {
        // If registration is not required, user is eligible by default
        isEligibleBasedOnRegistration = true;
      }

      // Check voting status (only if eligible based on registration)
      // Although contract might allow checking even if not registered, it's logical to check only if eligible.
      let voted = false;
      if(isEligibleBasedOnRegistration || restrictionType !== VotingRestriction.RequiredRegistration){ // Check vote status if eligible OR if registration wasn't required
          voted = await contract.hasUserVoted(campaignId, address);
      }


      // Update the temporary status object
      // isRegisteredVoter now correctly reflects eligibility based on registration rules
      status.isRegisteredVoter = isEligibleBasedOnRegistration;
      // Check if specifically a candidate (value 1)
      status.isRegisteredCandidate = (userRegType === RegistrationType.Candidate);
      status.hasVoted = voted;

      // Update hook's internal state
      setIsRegisteredVoter(status.isRegisteredVoter)
      setIsRegisteredCandidate(status.isRegisteredCandidate)
      setHasVoted(status.hasVoted)
      setError(null)

      console.log(`VoterStatus Hook: Final status set for campaign ${campaignId}:`, status);

    } catch (err) {
      console.error(`VoterStatus Hook: Error checking voter status for campaign ${campaignId}:`, err)
      const errorMsg = err.message || "Failed to fetch voter status from blockchain";
      setError(errorMsg);
      status.error = errorMsg;
      // Reset states on error
      setIsRegisteredVoter(false)
      setIsRegisteredCandidate(false)
      setHasVoted(false)
    } finally {
      setIsLoading(false)
      status.isLoading = false;
      console.log(`VoterStatus Hook: Finished status check for campaign ${campaignId}. Loading: false.`);
      return status;
    }
  }, [contract, address, isConnected, campaignId])

  useEffect(() => {
    checkVoterStatus()
  }, [checkVoterStatus])

  return {
    isLoading,
    isRegisteredVoter,
    isRegisteredCandidate,
    hasVoted,
    error,
    refetch: checkVoterStatus,
  }
}