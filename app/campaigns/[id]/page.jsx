"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useContract } from "@/context/contract-context"
import { useSubgraph } from "@/context/graphql/queries"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CalendarClock, Clock, Users, AlertCircle, RefreshCw, Award } from "lucide-react"
import { formatDate, formatAddress } from "@/lib/utils"
import RegisterTab from "./register-tab"
import ResultsTab from "./results-tab"
import CampaignCountdown from "./countdown-timer"
import { ApolloClient, InMemoryCache, gql } from "@apollo/client"
import OverviewTab from "./overview-tab"
import VoteTab from "./vote-tab"
import { useVoterStatus } from "@/hooks/use-voter-status"

// GraphQL client setup
const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/101223/polytix-final/v0.0.2",
  cache: new InMemoryCache(),
})

// GraphQL query for campaign details
const CAMPAIGN_DETAILS_QUERY = gql`
  query CampaignDetails($id: String!) {
    campaignCreateds(where: {campaignId: $id}, first: 1) {
      creator
      votingType
      restriction
      startTime
      endTime
      blockTimestamp
    }
    campaignStatusChangeds(where: {campaignId: $id}, orderBy: blockTimestamp, orderDirection: desc, first: 1) {
      status
    }
    voteCasts(where: {campaignId: $id}) {
      voter
      targetId
    }
    voterRegistereds(where: {campaignId: $id}) {
      voter
      tokenId
    }
    candidateAddeds(where: {campaignId: $id}, orderBy: candidateId, orderDirection: asc) {
      candidateId
      candidateAddress
      name
    }
    candidateRegistereds(where: {campaignId: $id}) {
      candidate
      tokenId
    }
    proposalAddeds(where: {campaignId: $id}, orderBy: proposalId, orderDirection: asc) {
      proposalId
      content
    }
  }
`

export default function CampaignDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id
  const { contract, address, isConnected, connectWallet } = useContract()
  const { refetchEvents } = useSubgraph()

  // State variables
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [campaignInfo, setCampaignInfo] = useState(null)
  const [proposals, setProposals] = useState([])
  const [candidates, setCandidates] = useState([])
  // Replace these lines:
  // const [userRegistered, setUserRegistered] = useState(false)
  // const [userVoted, setUserVoted] = useState(false)
  // const [isCandidate, setIsCandidate] = useState(false)

  // With this hook:
  const {
    isLoading: voterStatusLoading,
    isRegisteredVoter: userRegistered,
    isRegisteredCandidate: isCandidate,
    hasVoted: userVoted,
    error: voterStatusError,
  } = useVoterStatus(campaignId)
  const [isOwner, setIsOwner] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  console.log(candidates)

  // Time-based states
  const [isBeforeStart, setIsBeforeStart] = useState(false)
  const [isDuringVoting, setIsDuringVoting] = useState(false)
  const [isAfterEnd, setIsAfterEnd] = useState(false)

  // Helper function to fetch candidate data directly from contract
  const fetchCandidateDataFromContract = async (campaignId, candidateList) => {
    if (!contract) {
      console.warn("Contract instance not available for fetching candidate data")
      return candidateList
    }

    try {
      const updatedCandidates = [...candidateList]
      console.log(`Fetching detailed data for ${updatedCandidates.length} candidates from blockchain`)

      for (let i = 0; i < updatedCandidates.length; i++) {
        try {
          console.log(`Fetching data for candidate ${updatedCandidates[i].id} from contract`)
          const candidateInfo = await contract.getCandidateInfo(campaignId, updatedCandidates[i].id)

          // Update with contract data
          updatedCandidates[i].statement = candidateInfo[2] || "No statement provided"
          updatedCandidates[i].imageHash = candidateInfo[3] || "no-image"
          console.log(`Successfully fetched data for candidate ${updatedCandidates[i].id}`)
        } catch (candidateErr) {
          console.error(`Error fetching details for candidate ${updatedCandidates[i].id}:`, candidateErr)
          // Keep existing data, just log the error
        }
      }

      console.log("Completed fetching all candidate details from blockchain")
      return updatedCandidates
    } catch (err) {
      console.error("Failed to fetch candidate data from contract:", err)
      return candidateList // Return original list on failure
    }
  }

  // Fetch campaign data using GraphQL and contract calls
  const fetchCampaignData = async () => {
    if (!campaignId) {
      setError("Campaign ID is missing.")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Step 1: Fetch campaign data using GraphQL (Subgraph)
      console.log("Fetching campaign data from Subgraph...")
      const { data, error: queryError } = await client.query({
        query: CAMPAIGN_DETAILS_QUERY,
        variables: { id: String(campaignId) },
        fetchPolicy: "network-only",
      })

      if (queryError) throw queryError

      if (!data || !data.campaignCreateds || data.campaignCreateds.length === 0) {
        setError("Campaign not found in subgraph.")
        setLoading(false)
        return
      }

      // Process Subgraph data
      const campaignCreatedEvent = data.campaignCreateds[0]
      const voteCasts = data.voteCasts || []
      const voterRegistrations = data.voterRegistereds || []
      const candidateData = data.candidateAddeds || []
      const candidateRegistrations = data.candidateRegistereds || []
      const proposalData = data.proposalAddeds || []
      const statusChanges = data.campaignStatusChangeds || []

      // Time Calculations
      const now = Math.floor(Date.now() / 1000)
      const startTime = Number(campaignCreatedEvent.startTime)
      const endTime = Number(campaignCreatedEvent.endTime)
      const beforeStart = now < startTime
      const duringVoting = now >= startTime && now < endTime
      const afterEnd = now >= endTime
      setIsBeforeStart(beforeStart)
      setIsDuringVoting(duringVoting)
      setIsAfterEnd(afterEnd)

      // Process campaign metadata from Subgraph
      const campaignDescription = `Campaign #${campaignId}`
      const campaignResultType = 0

      // Process proposals or candidates based on voting type
      let processedProposals = []
      let processedCandidates = []

      if (Number(campaignCreatedEvent.votingType) === 1) {
        // Proposal-based - use Subgraph data
        processedProposals = proposalData.map((proposal) => {
          const voteCount = voteCasts.filter((vote) => String(vote.targetId) === String(proposal.proposalId)).length
          return {
            id: Number(proposal.proposalId),
            content: proposal.content,
            voteCount: voteCount,
          }
        })
        setProposals(processedProposals)
      } else {
        // Candidate-based - use Subgraph for basic data, will enhance with blockchain data later
        processedCandidates = candidateData.map((candidate) => {
          const voteCount = voteCasts.filter((vote) => String(vote.targetId) === String(candidate.candidateId)).length
          return {
            id: Number(candidate.candidateId),
            name: candidate.name,
            address: candidate.candidateAddress,
            statement: "Loading statement from blockchain...",
            imageHash: "loading",
            voteCount: voteCount,
          }
        })
      }

      // Combine Base Campaign Info from Subgraph
      const baseCampaignData = {
        id: campaignId,
        votingType: Number(campaignCreatedEvent.votingType),
        restriction: Number(campaignCreatedEvent.restriction),
        resultType: campaignResultType,
        creator: campaignCreatedEvent.creator,
        description: campaignDescription,
        startTime: startTime * 1000,
        endTime: endTime * 1000,
        status: statusChanges.length > 0 ? Number(statusChanges[0].status) : afterEnd ? 2 : duringVoting ? 1 : 0,
        totalVotes: voteCasts.length,
        itemCount: Number(campaignCreatedEvent.votingType) === 1 ? proposalData.length : candidateData.length,
        registeredVoterCount: voterRegistrations.length,
      }

      // User Status Checks - only check for owner, the rest comes from the hook
      const isCampaignOwner =
        isConnected && address && campaignCreatedEvent.creator.toLowerCase() === address.toLowerCase()
      setIsOwner(isCampaignOwner)

      // Set campaign info first to avoid loading delays
      setCampaignInfo(baseCampaignData)

      // Step 2: For candidate-based campaigns, fetch additional data from blockchain
      if (baseCampaignData.votingType === 0) {
        // Set initial candidate data from Subgraph
        setCandidates(processedCandidates)
        console.log("Initial candidate data set from Subgraph, fetching details from blockchain...")

        // Then fetch additional data from contract and update
        if (contract) {
          try {
            // Get campaign description and result type from contract
            console.log("Fetching campaign basic info from blockchain...")
            const basicInfo = await contract.getCampaignBasicInfo(campaignId)
            const updatedCampaignInfo = { ...baseCampaignData }
            updatedCampaignInfo.description = basicInfo[4] || baseCampaignInfo.description
            updatedCampaignInfo.resultType =
              basicInfo[2] !== undefined ? Number(basicInfo[2]) : baseCampaignInfo.resultType
            setCampaignInfo(updatedCampaignInfo)

            // Fetch detailed candidate data from contract (async)
            console.log("Fetching detailed candidate data from blockchain...")
            const enhancedCandidates = await fetchCandidateDataFromContract(campaignId, processedCandidates)
            setCandidates(enhancedCandidates)
            console.log("Candidate data successfully enhanced with blockchain data")
          } catch (err) {
            console.error("Error fetching additional contract data:", err)
            // We still have the basic data from Subgraph, so we can continue
          }
        } else {
          console.warn("Contract instance not available, using Subgraph data only for candidates")
        }
      } else {
        // For proposal-based campaigns, just set the proposals from Subgraph
        setProposals(processedProposals)
      }

      // Set initial active tab based on campaign status and user state
      if (afterEnd) {
        setActiveTab("results")
      } else if (duringVoting && userRegistered && !userVoted) {
        setActiveTab("vote")
      } else if (beforeStart && baseCampaignData.restriction === 2 && !userRegistered && !isCandidate) {
        setActiveTab("register")
      } else {
        setActiveTab("overview")
      }
    } catch (err) {
      console.error("Error fetching campaign details:", err)
      if (err.networkError) {
        setError("Network error: Could not reach the subgraph.")
      } else if (err.graphQLErrors) {
        setError(`GraphQL error: ${err.graphQLErrors.map((e) => e.message).join(", ")}`)
      } else {
        setError("Failed to load campaign details. Please check the console and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    if (campaignId) {
      fetchCampaignData()
    }
  }, [campaignId, contract, address, isConnected])

  // Add a separate effect to monitor contract changes
  useEffect(() => {
    if (
      contract &&
      campaignInfo?.votingType === 0 &&
      candidates.length > 0 &&
      candidates.some((c) => c.statement === "Loading statement from blockchain...")
    ) {
      console.log("Contract available, refreshing candidate data from blockchain")
      const updateCandidateData = async () => {
        try {
          const enhancedCandidates = await fetchCandidateDataFromContract(campaignId, candidates)
          setCandidates(enhancedCandidates)
        } catch (err) {
          console.error("Failed to update candidate data:", err)
        }
      }
      updateCandidateData()
    }
  }, [contract, campaignInfo?.votingType])

  // Handle registration success
  const handleRegistrationSuccess = async () => {
    // Optimistically update count
    setCampaignInfo((prev) => ({
      ...prev,
      registeredVoterCount: (prev?.registeredVoterCount ?? 0) + 1,
    }))

    // Trigger subgraph refresh
    if (refetchEvents) refetchEvents()

    // Fully refetch data after a delay
    setTimeout(fetchCampaignData, 2000)

    setActiveTab("overview")
  }

  // Handle vote success
  const handleVoteSuccess = async (votedItemId) => {
    // Optimistically update counts
    setCampaignInfo((prev) => ({
      ...prev,
      totalVotes: (prev?.totalVotes ?? 0) + 1,
    }))

    // Optimistically update item vote count
    if (campaignInfo?.votingType === 1) {
      // Proposal
      setProposals((prevProposals) =>
        prevProposals.map((p) => (String(p.id) === String(votedItemId) ? { ...p, voteCount: p.voteCount + 1 } : p)),
      )
    } else {
      // Candidate
      setCandidates((prevCandidates) =>
        prevCandidates.map((c) => (String(c.id) === String(votedItemId) ? { ...c, voteCount: c.voteCount + 1 } : c)),
      )
    }

    // Trigger subgraph refresh
    if (refetchEvents) refetchEvents()

    // Fully refetch data after a delay
    setTimeout(fetchCampaignData, 2000)

    setActiveTab("results")
  }

  // Get status message based on campaign state and user status
  const getStatusMessage = () => {
    // Add this condition at the beginning of the getStatusMessage function
    if (voterStatusLoading && isConnected) {
      return (
        <Alert className={`border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50`}>
          <AlertDescription className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Checking your registration status...
          </AlertDescription>
        </Alert>
      )
    }

    if (!campaignInfo) return null

    const alertBaseClasses = "border"
    const alertTextClasses = "flex items-center"

    if (isAfterEnd) {
      return (
        <Alert
          className={`${alertBaseClasses} bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50`}
        >
          <AlertDescription className={alertTextClasses}>
            📊 This campaign has ended. Final results are available below.
          </AlertDescription>
        </Alert>
      )
    }

    if (isBeforeStart) {
      if (isCandidate) {
        return (
          <Alert
            className={`${alertBaseClasses} bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50`}
          >
            <AlertDescription className={alertTextClasses}>
              🎭 You are registered as a candidate for this campaign. Good luck!
            </AlertDescription>
          </Alert>
        )
      }

      if (campaignInfo.restriction === 0) {
        // Open
        return (
          <Alert
            className={`${alertBaseClasses} bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50`}
          >
            <AlertDescription className={alertTextClasses}>
              🗳️ This campaign is open to all. Voting starts soon!
            </AlertDescription>
          </Alert>
        )
      } else if (!isConnected) {
        // Registration required, but wallet not connected
        return (
          <Alert
            className={`${alertBaseClasses} bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50`}
          >
            <AlertDescription className={alertTextClasses}>
              🔐 This campaign requires registration.{" "}
              <Button variant="link" className="p-0 h-auto ml-1" onClick={connectWallet}>
                Connect wallet
              </Button>{" "}
              to check status or register.
            </AlertDescription>
          </Alert>
        )
      } else if (campaignInfo.restriction === 2 && !userRegistered) {
        // Registration required, not registered
        return (
          <Alert
            className={`${alertBaseClasses} bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50`}
          >
            <AlertDescription className={alertTextClasses}>
              🔐 This campaign requires registration. Go to the 'Register' tab to participate.
            </AlertDescription>
          </Alert>
        )
      } else {
        // Registered (or Limited access assumed ok)
        return (
          <Alert
            className={`${alertBaseClasses} bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50`}
          >
            <AlertDescription className={alertTextClasses}>
              🎉 You are eligible for this campaign! Voting will start soon.
            </AlertDescription>
          </Alert>
        )
      }
    }

    if (isDuringVoting) {
      if (isCandidate) {
        return (
          <Alert
            className={`${alertBaseClasses} bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50`}
          >
            <AlertDescription className={alertTextClasses}>
              🎭 You are a candidate in this campaign.{" "}
              {userVoted ? "You have already voted." : "You can also vote for other candidates."}
            </AlertDescription>
          </Alert>
        )
      }

      if (!isConnected) {
        // Voting active, but wallet not connected
        return (
          <Alert
            className={`${alertBaseClasses} bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50`}
          >
            <AlertDescription className={alertTextClasses}>
              🗳️ Voting is active!{" "}
              <Button variant="link" className="p-0 h-auto ml-1" onClick={connectWallet}>
                Connect wallet
              </Button>{" "}
              to check eligibility and vote.
            </AlertDescription>
          </Alert>
        )
      } else if (userVoted) {
        // Already voted
        return (
          <Alert
            className={`${alertBaseClasses} bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50`}
          >
            <AlertDescription className={alertTextClasses}>
              🙌 Thanks for voting! Your vote has been securely recorded.
            </AlertDescription>
          </Alert>
        )
      } else if (campaignInfo.restriction === 2 && !userRegistered) {
        // Registration required, but not registered
        return (
          <Alert
            className={`${alertBaseClasses} bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50`}
          >
            <AlertDescription className={alertTextClasses}>
              🍿 Registration was required for this campaign, but you did not register. You can view live results.
            </AlertDescription>
          </Alert>
        )
      } else {
        // Eligible to vote (Open, or Registered)
        return (
          <Alert
            className={`${alertBaseClasses} bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50`}
          >
            <AlertDescription className={alertTextClasses}>
              🗳️ Voting is now open! Go to the 'Vote' tab to cast your vote.
            </AlertDescription>
          </Alert>
        )
      }
    }

    return null
  }

  // Render Logic
  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-10 mt-20">
        <div className="space-y-6 animate-pulse">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <div className="flex justify-center gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-3xl mx-auto py-10 mt-20 text-center">
        <Alert variant="destructive" className="text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push("/campaigns")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          <Button onClick={fetchCampaignData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!campaignInfo) {
    return (
      <div className="container max-w-3xl mx-auto py-10 mt-20 text-center">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Campaign data could not be loaded.</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/campaigns")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>
    )
  }

  // Main Render
  return (
    <div className="container max-w-5xl mx-auto py-10 mt-20">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/campaigns"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Link>
      </div>

      {/* Campaign Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight break-words">{campaignInfo.description}</h1>
        <div className="flex justify-center items-center flex-wrap gap-2 mt-3">
          <Badge
            variant={isDuringVoting ? "default" : isAfterEnd ? "secondary" : "outline"}
            className={
              isDuringVoting ? "bg-green-600 hover:bg-green-700" : isAfterEnd ? "" : "text-blue-600 border-blue-300"
            }
          >
            {isBeforeStart ? "Upcoming" : isDuringVoting ? "Active" : "Ended"}
          </Badge>
          <Badge variant="outline">{campaignInfo.votingType === 0 ? "Candidate-Based" : "Proposal-Based"}</Badge>
          <Badge variant="outline">
            {campaignInfo.restriction === 0
              ? "Open To All"
              : campaignInfo.restriction === 1
                ? "Limited (Token Gated)"
                : "Registration Required"}
          </Badge>
          {isCandidate && (
            <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
              <Award className="h-3 w-3 mr-1" /> You are a Candidate
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-3">Created by: {formatAddress(campaignInfo.creator)}</p>
      </div>

      {/* Countdown Timer Card */}
      <Card className="mb-6 border-border/50 bg-background/50 backdrop-blur-sm">
        <CardContent className="pt-6 text-center">
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
            {isBeforeStart ? "Voting Starts In" : isDuringVoting ? "Voting Ends In" : "Campaign Ended"}
          </h2>
          {!isAfterEnd ? (
            <CampaignCountdown
              endTime={isBeforeStart ? campaignInfo.startTime : campaignInfo.endTime}
              className="max-w-md mx-auto text-2xl md:text-3xl font-semibold"
            />
          ) : (
            <div className="text-lg font-medium text-muted-foreground">The voting period is over.</div>
          )}
        </CardContent>
      </Card>

      {/* Status Message */}
      <div className="mb-6">{getStatusMessage()}</div>

      {/* Campaign Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-base">Your Status</h3>
                <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                  <div>Campaign: {isBeforeStart ? "Upcoming" : isDuringVoting ? "Active" : "Ended"}</div>
                  {isConnected ? (
                    <>
                      {campaignInfo.restriction !== 0 && (
                        <div>
                          Eligibility:{" "}
                          {userRegistered || isCandidate ? (
                            <span className="text-green-600">Eligible</span>
                          ) : (
                            <span className="text-red-600">Not Eligible/Registered</span>
                          )}
                        </div>
                      )}
                      {isCandidate && (
                        <div>
                          Role: <span className="text-purple-600">Candidate</span>
                        </div>
                      )}
                      <div>
                        Vote Status:{" "}
                        {userVoted ? <span className="text-green-600">Voted</span> : <span>Not Voted Yet</span>}
                      </div>
                    </>
                  ) : (
                    <div>
                      <Button variant="link" size="sm" className="p-0 h-auto" onClick={connectWallet}>
                        Connect wallet
                      </Button>{" "}
                      to check
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {campaignInfo?.votingType === 0 &&
        candidates.some((c) => c.statement === "Loading statement from blockchain...") && (
          <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
            <AlertDescription className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading candidate details from blockchain...
            </AlertDescription>
          </Alert>
        )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>

          {/* Only show Register tab if not already registered as voter or candidate */}
          {isBeforeStart && campaignInfo.restriction === 2 && !userRegistered && !isCandidate && isConnected && (
            <TabsTrigger value="register">Register</TabsTrigger>
          )}

          {isDuringVoting && (userRegistered || isCandidate) && !userVoted && isConnected && (
            <TabsTrigger value="vote">Vote</TabsTrigger>
          )}

          {(isDuringVoting || isAfterEnd || (isOwner && isConnected)) && (
            <TabsTrigger value="results">Results</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            campaignInfo={campaignInfo}
            proposals={proposals}
            candidates={candidates}
            isOwner={isOwner}
            isCandidate={isCandidate}
            isBeforeStart={isBeforeStart}
            isDuringVoting={isDuringVoting}
            isAfterEnd={isAfterEnd}
            contract={contract}
            campaignId={campaignId}
          />
        </TabsContent>

        {isBeforeStart && campaignInfo.restriction === 2 && !userRegistered && !isCandidate && isConnected && (
          <TabsContent value="register">
            <RegisterTab
              campaignInfo={campaignInfo}
              contract={contract}
              campaignId={campaignId}
              isConnected={isConnected}
              connectWallet={connectWallet}
              onRegistrationSuccess={handleRegistrationSuccess}
            />
          </TabsContent>
        )}

        {isDuringVoting && (userRegistered || isCandidate) && !userVoted && isConnected && (
          <TabsContent value="vote">
            <VoteTab
              campaignInfo={campaignInfo}
              proposals={proposals}
              candidates={candidates}
              contract={contract}
              campaignId={campaignId}
              isConnected={isConnected}
              connectWallet={connectWallet}
              onVoteSuccess={handleVoteSuccess}
            />
          </TabsContent>
        )}

        {(isDuringVoting || isAfterEnd || (isOwner && isConnected)) && (
          <TabsContent value="results">
            <ResultsTab
              campaignInfo={campaignInfo}
              proposals={proposals}
              candidates={candidates}
              isOwner={isOwner}
              isDuringVoting={isDuringVoting}
              isAfterEnd={isAfterEnd}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
