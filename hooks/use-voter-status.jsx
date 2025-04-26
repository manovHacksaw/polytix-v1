"use client"

import { useState, useEffect } from "react"
import { useContract } from "@/context/contract-context"

export function useVoterStatus(campaignId) {
  const { contract, address, isConnected } = useContract()
  const [isLoading, setIsLoading] = useState(true)
  const [isRegisteredVoter, setIsRegisteredVoter] = useState(false)
  const [isRegisteredCandidate, setIsRegisteredCandidate] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function checkVoterStatus() {
      if (!contract || !isConnected || !address || !campaignId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Get user registration type (0=None, 1=Voter, 2=Candidate)
        const registrationType = await contract.getUserRegistrationType(campaignId, address)

        // Check if user has voted
        const voted = await contract.hasUserVoted(campaignId, address)

        // Update states based on blockchain data
        setIsRegisteredVoter(registrationType > 0) // Either voter or candidate
        setIsRegisteredCandidate(registrationType === 2) // Specifically a candidate
        setHasVoted(voted)

        console.log("Voter status:", {
          registrationType: Number(registrationType),
          isRegisteredVoter: registrationType > 0,
          isRegisteredCandidate: registrationType === 2,
          hasVoted: voted,
        })
      } catch (err) {
        console.error("Error checking voter status:", err)
        setError("Failed to fetch voter status from blockchain")
      } finally {
        setIsLoading(false)
      }
    }

    checkVoterStatus()
  }, [contract, address, isConnected, campaignId])

  return {
    isLoading,
    isRegisteredVoter,
    isRegisteredCandidate,
    hasVoted,
    error,
  }
}
