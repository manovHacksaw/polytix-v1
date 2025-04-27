"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Vote, AlertTriangle, Users } from "lucide-react"
import { formatAddress, resolveIpfsUrl } from "@/lib/utils"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { X } from "lucide-react"

export default function VoteTab({
  campaignInfo,
  proposals,
  candidates: initialCandidates,
  contract,
  campaignId,
  isConnected,
  connectWallet,
  onVoteSuccess,
}) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [candidates, setCandidates] = useState(initialCandidates)
  const [loading, setLoading] = useState(true)

  // Loading state for candidates
  const candidatesLoading = campaignInfo?.votingType === 0 && loading

  useEffect(() => {
    async function fetchCandidateData() {
      if (!contract || campaignInfo?.votingType !== 0) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log("Fetching candidate data for campaign:", campaignInfo.id)
        
        // Get the total number of candidates
        const candidateCount = await contract.getCandidateIds(campaignInfo.id)
        console.log(`Found ${candidateCount} candidates`)
        
        const fetchedCandidates = []
        
        // Fetch each candidate's details
        for (let i = 0; i < candidateCount; i++) {
          try {
            // Get candidate data from contract
            const candidateInfo = await contract.getCandidateInfo(campaignInfo.id, i)
            console.log(`Candidate ${i} data:`, candidateInfo)
            
            // Extract candidate data
            const candidateAddress = candidateInfo[0]
            const candidateName = candidateInfo[1]
            const candidateStatement = candidateInfo[2]
            const candidateImageHash = candidateInfo[3] || "no-image"
            
            // Get vote count for this candidate
            const voteCount = candidateInfo[4]
            
            fetchedCandidates.push({
              id: i,
              address: candidateAddress,
              name: candidateName,
              statement: candidateStatement,
              imageHash: candidateImageHash,
              voteCount: Number(voteCount)
            })
          } catch (candidateErr) {
            console.error(`Error fetching candidate ${i}:`, candidateErr)
          }
        }
        
        setCandidates(fetchedCandidates)
      } catch (err) {
        console.error("Error fetching candidates:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCandidateData()
  }, [contract, campaignInfo])

  const handleVote = async () => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    if (selectedOption === null) {
      toast.error("Please select an option to vote for")
      setError("Please select an option to vote for")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      toast.loading("Casting your vote...", {
        id: "vote-transaction",
      })

      // Call contract to vote
      let tx
      if (campaignInfo.votingType === 0) {
        // Candidate-based
        tx = await contract.voteForCandidate(campaignId, selectedOption)
      } else {
        // Proposal-based
        tx = await contract.voteForProposal(campaignId, selectedOption)
      }

      await tx.wait()

      toast.success("Your vote has been cast successfully!", {
        id: "vote-transaction",
        duration: 5000,
      })

      setSuccess("Your vote has been cast successfully!")

      // Notify parent component
      if (onVoteSuccess) {
        setTimeout(() => {
          onVoteSuccess()
        }, 2000)
      }
    } catch (err) {
      console.error("Error voting:", err)

      toast.error("Failed to cast your vote", {
        id: "vote-transaction",
        duration: 5000,
      })

      setError("Failed to cast your vote. Please try again.")
      setShowErrorDialog(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-primary" />
            Connect Wallet to Vote
          </CardTitle>
          <CardDescription>You need to connect your wallet to vote in this campaign</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Vote className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground mb-6">Connect your wallet to cast your vote in this campaign</p>
          <Button onClick={connectWallet}>Connect Wallet</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-2 border-primary/10 shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-primary" />
            Cast Your Vote
          </CardTitle>
          <CardDescription>
            {campaignInfo.votingType === 1 ? "Select a proposal to vote for" : "Select a candidate to vote for"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
              Important Information
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>Your vote is final and cannot be changed once submitted</li>
              <li>Voting requires a blockchain transaction that may take a few moments to complete</li>
              <li>Make sure you have enough gas in your wallet to complete the transaction</li>
            </ul>
          </div>

          <RadioGroup
            value={selectedOption !== null ? selectedOption.toString() : undefined}
            onValueChange={(value) => setSelectedOption(Number.parseInt(value))}
            className="space-y-4"
          >
            {campaignInfo.votingType === 1
              ? proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="flex items-start space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={proposal.id.toString()} id={`proposal-${proposal.id}`} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={`proposal-${proposal.id}`} className="font-medium cursor-pointer">
                        Proposal {proposal.id + 1}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{proposal.content}</p>
                    </div>
                  </div>
                ))
              : candidatesLoading ? (
                  // Show skeletons while loading
                  Array(3).fill(0).map((_, idx) => (
                    <div
                      key={`skeleton-${idx}`}
                      className="flex items-start space-x-2 border rounded-md p-4"
                    >
                      <Skeleton className="h-4 w-4 mt-1 rounded-full" />
                      <div className="flex-1">
                        <div className="flex gap-4">
                          <Skeleton className="w-12 h-12 rounded-md flex-shrink-0" />
                          <div className="flex-1">
                            <Skeleton className="h-5 w-1/3 mb-1" />
                            <Skeleton className="h-3 w-1/4 mb-2" />
                            <Skeleton className="h-3 w-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )
                : candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-start space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={candidate.id.toString()} id={`candidate-${candidate.id}`} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          {candidate.imageHash &&
                          candidate.imageHash !== "loading" &&
                          candidate.imageHash !== "no-image" ? (
                            <Image
                              src={resolveIpfsUrl(candidate.imageHash)}
                              width={48}
                              height={48}
                              alt={candidate.name}
                              className="rounded-md object-cover"
                            />
                          ) : (
                            <Users className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={`candidate-${candidate.id}`} className="font-medium cursor-pointer">
                            {candidate.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">{formatAddress(candidate.address)}</p>
                          <p className="text-sm text-muted-foreground mt-1">{candidate.statement}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="bg-muted/10 border-t px-6 py-4">
          <Button 
            className="w-full" 
            onClick={handleVote} 
            disabled={selectedOption === null || isSubmitting || candidatesLoading} 
            size="lg"
          >
            {isSubmitting ? "Casting Vote..." : candidatesLoading ? "Loading Candidates..." : "Cast Vote"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        {/* Increased max-width, standard padding */}
        <DialogTitle></DialogTitle>
        <DialogContent className="sm:max-w-2xl p-6">
          {/* Optional Close Button Top Right */}
          <button
            onClick={() => setShowErrorDialog(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10" // Ensure button is above content
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {/* Main Content Area */}
          <div>
             {/* Header Section: Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-8 w-8 text-amber-500 flex-shrink-0" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Vote Transaction Failed
              </h3>
            </div>

            {/* Primary Description */}
            <p className="text-sm text-muted-foreground mb-5">
              We encountered an issue while trying to submit your vote. This could be due to network congestion or recent platform updates (migration to Polygon Amoy).
            </p>

            {/* Context Box (Subtle Styling) */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50 mb-6">
               {/* Removed explicit title, incorporated into description above */}
               <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Troubleshooting Suggestions:
               </p>
               <ul className="list-disc pl-5 space-y-1.5 text-sm text-amber-700 dark:text-amber-400">
                 <li>Consider slightly increasing the transaction's gas fee within your wallet settings.</li>
                 <li>Wait a few moments and then click "Try Again".</li>
                 <li>Double-check that your wallet is connected and set to the correct network (Polygon Amoy).</li>
               </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-gray-200 dark:border-gray-700">
               <Button variant="outline" onClick={() => setShowErrorDialog(false)}>
                  Close
               </Button>
               <Button
                 onClick={() => {
                   setShowErrorDialog(false);
                   handleVote(); // Re-trigger the vote attempt
                 }}
               >
                  Try Again
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  )
}