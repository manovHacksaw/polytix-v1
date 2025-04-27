"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAddress, formatDate, resolveIpfsUrl, cn } from "@/lib/utils" // Added cn
import { CalendarClock, Clock, Users, FileText } from "lucide-react" // Added FileText for proposals
import Image from "next/image"
import { useContract } from "@/context/contract-context"
import { useState, useEffect } from "react"

// Placeholder image URL using the provided IPFS hash
const DUMMY_PLACEHOLDER_IMAGE = "https://gateway.pinata.cloud/ipfs/bafkreibluy7juck62zxdgzy3tjviuczrvcsjyt2yc3lwmvuielbaczckpi";

export default function OverviewTab({
  campaignInfo,
  proposals = [], // Default to empty array
  candidates: initialCandidates = [], // Default to empty array
  isOwner,
  isCandidate, // If the current user is *registered* as a candidate
  isRegisteredVoter, // If the current user is eligible based on registration rules
  isBeforeStart,
  isDuringVoting,
  isAfterEnd,
}) {
  const { contract } = useContract()
  const [candidates, setCandidates] = useState(initialCandidates)
  // Combine loading states for simplicity if only fetching candidates here
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(campaignInfo?.votingType === 0)

  useEffect(() => {
    // Ensure proposals is always an array for safety
    const safeProposals = Array.isArray(proposals) ? proposals : [];
    // Set initial candidates state, ensuring it's an array
    setCandidates(Array.isArray(initialCandidates) ? initialCandidates : []);

    // Only fetch if it's a candidate campaign and contract exists
    if (campaignInfo?.votingType === 0 && contract) {
        async function fetchCandidateData() {
            // Prevent fetching if candidates passed via props seem complete
             const needsFetching = initialCandidates.some(c => c.statement === "Loading details..." || c.imageHash === "loading");
            if (!needsFetching) {
                console.log("OverviewTab: Skipping fetch, candidate data seems complete from props.");
                setIsLoadingCandidates(false);
                return;
            }

            setIsLoadingCandidates(true);
            console.log("OverviewTab: Fetching candidate data for campaign:", campaignInfo.id);
            try {
                const candidateCount = await contract.getCandidateIds(campaignInfo.id);
                const fetchedCandidates = [];
                for (let i = 0; i < candidateCount; i++) {
                    try {
                        const candidateInfo = await contract.getCandidateInfo(campaignInfo.id, i);
                        const voteCountResult = await contract.getCandidateInfo(campaignInfo.id, i); // Assuming this returns vote count

                        fetchedCandidates.push({
                            id: i,
                            address: candidateInfo[0],
                            name: candidateInfo[1],
                            statement: candidateInfo[2] || "No statement provided.",
                            imageHash: candidateInfo[3] || "no-image",
                            voteCount: Number(voteCountResult[4] ?? 0) // Get vote count from the second call or fallback
                        });
                    } catch (candidateErr) {
                        console.error(`OverviewTab: Error fetching candidate ${i}:`, candidateErr);
                        // Keep initial data if fetch fails for one
                        const existing = initialCandidates.find(c => c.id === i);
                        if (existing) fetchedCandidates.push({ ...existing, statement: "Error loading details", imageHash: "no-image" });
                    }
                }
                setCandidates(fetchedCandidates);
            } catch (err) {
                console.error("OverviewTab: Error fetching candidate count:", err);
                // Fallback to initial candidates if count fetch fails
                setCandidates(initialCandidates.map(c => ({...c, statement: "Error loading data", imageHash: "no-image" })));
            } finally {
                setIsLoadingCandidates(false);
            }
        }
        fetchCandidateData();
    } else {
         // If not candidate-based or no contract, stop loading
         setIsLoadingCandidates(false);
    }
  }, [contract, campaignInfo, initialCandidates]); // Depend on initialCandidates too

  // Ensure campaignInfo exists before rendering details
  if (!campaignInfo) {
    return <Skeleton className="h-48 w-full" />; // Or a more specific loading state
  }

  return (
    <div className="space-y-6">
      {/* Campaign Details Card */}
     
      {/* Candidates Section */}
      {campaignInfo.votingType === 0 && (
        <Card className="rounded-xl shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Candidates</CardTitle>
            <CardDescription>
              {isLoadingCandidates
                ? "Loading candidate details..."
                : `${candidates.length} candidate${candidates.length !== 1 ? 's' : ''} participating`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoadingCandidates ? (
                // Skeletons with circular image placeholder
                Array(Math.max(2, candidates.length)) // Show at least 2 skeletons
                  .fill(0).map((_, idx) => (
                    <div key={`skeleton-${idx}`} className="p-4 flex gap-4 border rounded-lg bg-muted/30">
                      <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" /> {/* Circular skeleton */}
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                      </div>
                    </div>
                  ))
              ) : candidates.length > 0 ? (
                candidates.map((candidate) => {
                  const imageUrl = (candidate.imageHash && candidate.imageHash !== "no-image")
                                   ? resolveIpfsUrl(candidate.imageHash)
                                   : DUMMY_PLACEHOLDER_IMAGE; // Use dummy if invalid/missing
                  return(
                    <Card key={candidate.id} className="overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                       {/* Use Card here for structure */}
                      <CardContent className="p-4 flex items-start gap-4">
                          {/* Circular Image Container */}
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden border">
                            <Image
                              // Use resolved URL or placeholder
                              src={imageUrl || "/placeholder.svg"} // Final fallback
                              width={64}
                              height={64}
                              alt={candidate.name || 'Candidate'}
                              className="w-full h-full object-cover" // Ensure image covers the circle
                              unoptimized // Good for IPFS
                              // Optional: Add error handling for the image itself
                              onError={(e) => { e.currentTarget.src = DUMMY_PLACEHOLDER_IMAGE; }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-base">{candidate.name || `Candidate ${candidate.id}`}</h3>
                            <p className="text-xs text-muted-foreground font-mono mb-2">{formatAddress(candidate.address)}</p>
                            <p className="text-sm text-muted-foreground line-clamp-3">{candidate.statement || "No statement provided."}</p>
                          </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <p className="col-span-1 md:col-span-2 text-center p-8 text-muted-foreground">
                  No candidates have registered for this campaign yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proposals Section */}
      {campaignInfo.votingType === 1 && (
        <Card className="rounded-xl shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Proposals</CardTitle>
            <CardDescription>{proposals.length} proposal{proposals.length !== 1 ? 's' : ''} submitted</CardDescription>
          </CardHeader>
          <CardContent>
             {/* Use a list for proposals */}
            {proposals.length > 0 ? (
              <ul className="space-y-3">
                {proposals.map((proposal, index) => (
                  <li key={proposal.id || index} className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                     {/* Optionally add a small icon */}
                     <div className="flex items-start gap-3">
                         <FileText className="h-4 w-4 mt-1 text-primary flex-shrink-0"/>
                         <p className="text-sm text-foreground flex-1">{proposal.content}</p>
                     </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center p-8 text-muted-foreground">
                No proposals found for this campaign.
              </p>
            )}
          </CardContent>
        </Card>
      )}

    
    </div>
  )
}