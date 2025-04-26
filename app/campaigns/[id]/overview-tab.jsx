import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAddress, formatDate, resolveIpfsUrl } from "@/lib/utils"
import { CalendarClock, Clock, Users } from "lucide-react"
import Image from "next/image"
import { useContract } from "@/context/contract-context"
import { useState, useEffect } from "react"

export default function OverviewTab({
  campaignInfo,
  proposals,
  candidates: initialCandidates,
  isOwner,
  isCandidate,
  isBeforeStart,
  isDuringVoting,
  isAfterEnd,
}) {
  const { contract } = useContract();
  const [candidates, setCandidates] = useState(initialCandidates);
  const [loading, setLoading] = useState(true);

  // Loading state for candidates
  const candidatesLoading = campaignInfo?.votingType === 0 && loading;

  useEffect(() => {
    async function fetchCandidateData() {
      if (!contract || campaignInfo?.votingType !== 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching candidate data for campaign:", campaignInfo.id);
        
        // Get the total number of candidates
        
        const candidateCount = await contract.getCandidateIds(campaignInfo.id);
        console.log(`Found ${candidateCount} candidates`);
        
        const fetchedCandidates = [];
        
        // Fetch each candidate's details
        for (let i = 0; i < candidateCount; i++) {
          try {
            // Get candidate data from contract
            const candidateInfo = await contract.getCandidateInfo(campaignInfo.id, i);
            console.log(`Candidate ${i} data:`, candidateInfo);
            
            // Extract candidate data
            const candidateAddress = candidateInfo[0];
            const candidateName = candidateInfo[1];
            const candidateStatement = candidateInfo[2];
            const candidateImageHash = candidateInfo[3] || "no-image";
            console.log(resolveIpfsUrl(candidateImageHash));
            
            
            // Get vote count for this candidate
            const voteCount = candidateInfo[4];
            
            fetchedCandidates.push({
              id: i,
              address: candidateAddress,
              name: candidateName,
              statement: candidateStatement,
              imageHash: candidateImageHash,
              voteCount: Number(voteCount)
            });
            // console.log(resolveIpfsUrl(imageHash))
          } catch (candidateErr) {
            console.error(`Error fetching candidate ${i}:`, candidateErr);
          }
        }
        
        setCandidates(fetchedCandidates);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCandidateData();
  }, [contract, campaignInfo]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Overview of this campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Campaign Type</h3>
              <p className="text-sm text-muted-foreground">
                {campaignInfo.votingType === 0 ? "Candidate-Based Election" : "Proposal-Based Voting"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Participation</h3>
              <p className="text-sm text-muted-foreground">
                {campaignInfo.restriction === 0
                  ? "Open to All"
                  : campaignInfo.restriction === 1
                    ? "Limited (Token Gated)"
                    : "Registration Required"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Start Date</h3>
              <p className="text-sm text-muted-foreground">{formatDate(campaignInfo.startTime)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">End Date</h3>
              <p className="text-sm text-muted-foreground">{formatDate(campaignInfo.endTime)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Creator</h3>
              <p className="text-sm text-muted-foreground">{formatAddress(campaignInfo.creator)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Status</h3>
              <div>
                <Badge
                  variant={isDuringVoting ? "default" : isAfterEnd ? "secondary" : "outline"}
                  className={
                    isDuringVoting
                      ? "bg-green-600 hover:bg-green-700"
                      : isAfterEnd
                        ? ""
                        : "text-blue-600 border-blue-300"
                  }
                >
                  {isBeforeStart ? "Upcoming" : isDuringVoting ? "Active" : "Ended"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {campaignInfo.votingType === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Candidates</CardTitle>
            <CardDescription>
              {candidatesLoading
                ? "Loading candidate details from blockchain..."
                : `${candidates.length} candidates in this election`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidatesLoading ? (
                // Show skeletons while loading
                Array(3).fill(0).map((_, idx) => (
                  <Card key={`skeleton-${idx}`} className="overflow-hidden">
                    <div className="p-4 flex gap-4">
                      <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0"></div>
                      <div className="flex-1">
                        <Skeleton className="h-5 w-1/2 mb-2" />
                        <Skeleton className="h-3 w-1/3 mb-4" />
                        <Skeleton className="h-3 w-full mb-2" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <Card key={candidate.id} className="overflow-hidden">
                    <div className="p-4 flex gap-4">
                      <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        {candidate.imageHash &&
                        candidate.imageHash !== "loading" &&
                        candidate.imageHash !== "no-image" ? (
                          <Image
                            src={resolveIpfsUrl(candidate.imageHash)}
                            width={64}
                            height={64}
                            alt={candidate.name}
                            className="rounded-md object-cover"
                          />
                        ) : (
                          <Users className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{candidate.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{formatAddress(candidate.address)}</p>
                        <p className="text-sm text-muted-foreground line-clamp-3">{candidate.statement}</p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center p-8 text-muted-foreground">
                  No candidates found for this campaign
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Proposals</CardTitle>
            <CardDescription>{proposals.length} proposals in this campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <Card key={proposal.id} className="overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-medium mb-1">Proposal {proposal.id + 1}</h3>
                    <p className="text-sm text-muted-foreground">{proposal.content}</p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>Current participation statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-base">Participation</h3>
                <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                  <div>Total Votes Cast: {campaignInfo.totalVotes}</div>
                  {campaignInfo.restriction !== 0 && <div>Registered: {campaignInfo.registeredVoterCount}</div>}
                  <div>
                    {campaignInfo.votingType === 0 ? "Candidates" : "Proposals"}: {campaignInfo.itemCount}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarClock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-base">Timeline</h3>
                <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                  <div>Start: {formatDate(campaignInfo.startTime)}</div>
                  <div>End: {formatDate(campaignInfo.endTime)}</div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-base">Status</h3>
                <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                  <div>Campaign: {isBeforeStart ? "Upcoming" : isDuringVoting ? "Active" : "Ended"}</div>
                  {isCandidate && (
                    <div>
                      Your Role: <span className="text-purple-600">Candidate</span>
                    </div>
                  )}
                  {isOwner && (
                    <div>
                      Your Role: <span className="text-blue-600">Creator</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}