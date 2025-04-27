"use client"

import { Check, Vote } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useContract } from "@/context/contract-context"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, CalendarClock, Clock, Users, AlertCircle, RefreshCw, Award } from "lucide-react"
import { formatDate, formatAddress, cn } from "@/lib/utils"
import RegisterTab from "./register-tab"
import ResultsTab from "./results-tab"
import CampaignCountdown from "./countdown-timer"
import { ApolloClient, InMemoryCache, gql } from "@apollo/client"
import OverviewTab from "./overview-tab"
import VoteTab from "./vote-tab"
import { useVoterStatus } from "@/hooks/use-voter-status"
import MandatoryWalletConnectDialog from "./mandatory-wallet-connect"

// GraphQL client setup
const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/101223/polytix-final/version/latest", // Replace with your Subgraph URI
  cache: new InMemoryCache(),
})

// GraphQL query (ensure this matches your subgraph schema)
const CAMPAIGN_DETAILS_QUERY = gql`
  query CampaignDetails($id: String!) {
    campaignCreateds(where: {campaignId: $id}, first: 1) {
      creator
      votingType
      restriction
      startTime
      endTime
      blockTimestamp
      # Add other fields from CampaignCreated event if needed
    }
    # Optional: Fetch other relevant events if needed for initial load or fallback
    voteCasts(where: {campaignId: $id}, first: 1000) { # Adjust 'first' as needed
      voter
      targetId
    }
    voterRegistereds(where: {campaignId: $id}, first: 1000) { # Adjust 'first' as needed
      voter
      tokenId
    }
    candidateAddeds(where: {campaignId: $id}, orderBy: candidateId, orderDirection: asc) {
      candidateId
      candidateAddress
      name
    }
    proposalAddeds(where: {campaignId: $id}, orderBy: proposalId, orderDirection: asc) {
      proposalId
      content
    }
    # Fetch latest status change if your schema supports it
    # campaignStatusChangeds(...) { ... }
  }
`

// --- Component ---
export default function CampaignDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id
  const { contract, address, isConnected, connect: connectWallet } = useContract()
  // const { refetchEvents } = useSubgraph() // Keep if used elsewhere or for potential subgraph cache updates

  // --- State ---
  const [loading, setLoading] = useState(true) // Combined loading state
  const [error, setError] = useState(null)
  const [campaignInfo, setCampaignInfo] = useState(null)
  const [proposals, setProposals] = useState([])
  const [candidates, setCandidates] = useState([])
  const [activeTab, setActiveTab] = useState("overview")

  // --- Custom Hook for Voter Status ---
  const {
    isLoading: voterStatusLoading,
    isRegisteredVoter: userRegistered, // True if eligible based on registration rules
    isRegisteredCandidate: isCandidate, // True if specifically a registered candidate
    hasVoted: userVoted,
    error: voterStatusError,
    refetch: refetchVoterStatus,
  } = useVoterStatus(campaignId)

  // --- Derived State ---
  const isOwner = useMemo(() => {
    return (
      isConnected && address && campaignInfo?.creator && campaignInfo.creator.toLowerCase() === address.toLowerCase()
    )
  }, [isConnected, address, campaignInfo?.creator])

  const { isBeforeStart, isDuringVoting, isAfterEnd } = useMemo(() => {
    if (!campaignInfo) return { isBeforeStart: false, isDuringVoting: false, isAfterEnd: false }
    const now = Date.now()
    const startTime = campaignInfo.startTime // Already in ms
    const endTime = campaignInfo.endTime // Already in ms

    return {
      isBeforeStart: now < startTime,
      isDuringVoting: now >= startTime && now < endTime,
      isAfterEnd: now >= endTime,
    }
  }, [campaignInfo])

  // Add debugging for voter status
  useEffect(() => {
    console.log("Voter status updated:", {
      isRegisteredVoter: userRegistered,
      isRegisteredCandidate: isCandidate,
      hasVoted: userVoted,
      isLoading: voterStatusLoading,
      error: voterStatusError,
    })

    // Log the register tab visibility
    console.log("Register tab visibility:", {
      showRegisterTab: !isOwner && !isCandidate && !userRegistered && isBeforeStart && campaignInfo?.restriction === 2,
      isOwner,
      isCandidate,
      userRegistered,
      isBeforeStart,
      restrictionType: campaignInfo?.restriction,
    })
  }, [
    userRegistered,
    isCandidate,
    userVoted,
    voterStatusLoading,
    voterStatusError,
    isOwner,
    isBeforeStart,
    campaignInfo,
  ])

  // --- Candidate Data Fetching Helper ---
  const fetchCandidateDataFromContract = async (campaignId, initialCandidates) => {
    if (!contract || !initialCandidates || initialCandidates.length === 0) {
      console.warn("Contract not available or no candidates to fetch details for.")
      return initialCandidates.map((c) => ({ ...c, statement: "Details unavailable", imageHash: "no-image" }))
    }

    try {
      console.log(`Fetching detailed data for ${initialCandidates.length} candidates from blockchain`)
      const candidatePromises = initialCandidates.map(async (candidate) => {
        try {
          const candidateInfo = await contract.getCandidateInfo(campaignId, candidate.id)
          // Indices: 0:addr, 1:name, 2:statement, 3:imageHash, 4:voteCount
          return {
            ...candidate,
            // Use fetched name & address as primary, fallback to subgraph if needed
            address: candidateInfo[0] || candidate.address,
            name: candidateInfo[1] || candidate.name,
            statement: candidateInfo[2] || "No statement provided.",
            imageHash: candidateInfo[3] || "no-image",
            // Vote count ideally comes from subgraph for efficiency, but can use contract as fallback
            // voteCount: candidate.voteCount ?? Number(candidateInfo[4] ?? 0), // Example fallback
          }
        } catch (candidateErr) {
          console.error(`Error fetching details for candidate ${candidate.id}:`, candidateErr)
          return { ...candidate, statement: "Error loading details", imageHash: "no-image" } // Indicate error
        }
      })
      const resolvedCandidates = await Promise.all(candidatePromises)
      console.log("Completed fetching candidate details from blockchain.")
      return resolvedCandidates
    } catch (err) {
      console.error("Failed to fetch candidate data batch from contract:", err)
      return initialCandidates.map((c) => ({ ...c, statement: "Error loading details", imageHash: "no-image" }))
    }
  }

  // --- Main Data Fetching Function ---
  const fetchCampaignData = async () => {
    if (!isConnected || !campaignId) {
      if (!campaignId) setError("Campaign ID is missing.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    console.log("Fetching campaign data...")

    try {
      // Step 1: Fetch from Subgraph
      console.log("Fetching from Subgraph...")
      const { data, error: queryError } = await client.query({
        query: CAMPAIGN_DETAILS_QUERY,
        variables: { id: String(campaignId) },
        fetchPolicy: "network-only",
      })

      if (queryError) throw queryError
      if (!data?.campaignCreateds?.length) {
        throw new Error("Campaign not found in subgraph.")
      }

      const campaignCreatedEvent = data.campaignCreateds[0]
      const subgraphVotes = data.voteCasts || []
      const subgraphRegistrations = data.voterRegistereds || []
      const subgraphCandidatesAdded = data.candidateAddeds || []
      const subgraphProposalsAdded = data.proposalAddeds || []

      // Step 2: Fetch Base Info & Items from Contract (more reliable source)
      console.log("Fetching base info and items from Contract...")
      if (!contract) throw new Error("Contract instance not available.")

      const basicInfo = await contract.getCampaignBasicInfo(campaignId)
      const [votingType, restriction, resultType, creator, description] = basicInfo

      let items = []
      let itemCount = 0
      if (Number(votingType) === 1) {
        // Proposal-Based
        const proposalCount = await contract.getProposalIds(campaignId)
        itemCount = Number(proposalCount)
        const proposalPromises = []
        for (let i = 0; i < itemCount; i++) {
          proposalPromises.push(contract.getProposalContent(campaignId, i))
        }
        const contents = await Promise.all(proposalPromises)
        items = contents.map((content, i) => {
          const voteCount = subgraphVotes.filter((v) => String(v.targetId) === String(i)).length // Use subgraph for vote counts
          return { id: i, content, voteCount }
        })
        setProposals(items)
        setCandidates([]) // Clear candidates
      } else {
        // Candidate-Based
        const candidateCount = await contract.getCandidateIds(campaignId)
        itemCount = Number(candidateCount)
        // Prepare initial candidate structures using subgraph add events as fallback for name/address
        const initialCandidates = []
        for (let i = 0; i < itemCount; i++) {
          const addedEvent = subgraphCandidatesAdded.find((c) => Number(c.candidateId) === i)
          const voteCount = subgraphVotes.filter((v) => String(v.targetId) === String(i)).length // Use subgraph for vote counts
          initialCandidates.push({
            id: i,
            name: addedEvent?.name || `Candidate ${i}`, // Use subgraph name if available
            address: addedEvent?.candidateAddress || "0x...", // Use subgraph address if available
            statement: "Loading details...",
            imageHash: "loading",
            voteCount: voteCount,
          })
        }
        // Fetch full details from contract (will overwrite name/address too)
        items = await fetchCandidateDataFromContract(campaignId, initialCandidates)
        setCandidates(items)
        setProposals([]) // Clear proposals
      }

      // Step 3: Combine into Campaign Info State
      const combinedInfo = {
        id: campaignId,
        votingType: Number(votingType),
        restriction: Number(restriction),
        resultType: Number(resultType),
        creator: creator,
        description: description || `Campaign #${campaignId}`, // Use contract desc
        startTime: Number(campaignCreatedEvent.startTime) * 1000, // Use subgraph time
        endTime: Number(campaignCreatedEvent.endTime) * 1000, // Use subgraph time
        totalVotes: subgraphVotes.length, // Use subgraph count
        itemCount: itemCount, // Use contract count
        registeredVoterCount: subgraphRegistrations.length, // Use subgraph count (can be inaccurate if NFTs burned)
        // status: ... // Determine status based on time or contract call if available
      }
      setCampaignInfo(combinedInfo)

      // Step 4: Determine Initial Active Tab (using combinedInfo and latest voter status)
      // Refetch voter status *after* setting campaignInfo as it might depend on restriction type
      const updatedVoterStatus = await refetchVoterStatus() // Assuming refetch returns the status

      const now = Date.now()
      const isAfter = now >= combinedInfo.endTime
      const isDuring = now >= combinedInfo.startTime && now < combinedInfo.endTime
      const isBefore = now < combinedInfo.startTime

      const owner = isConnected && address && combinedInfo.creator.toLowerCase() === address.toLowerCase()

      const isEligibleToVote = !owner && !updatedVoterStatus.isCandidate && updatedVoterStatus.isRegisteredVoter
      const canCurrentlyVote = isEligibleToVote && isDuring && !updatedVoterStatus.hasVoted

      const canCurrentlyRegister =
        !owner &&
        !updatedVoterStatus.isCandidate &&
        !updatedVoterStatus.isRegisteredVoter &&
        isBefore &&
        combinedInfo.restriction === 2

      const showResults = owner || isDuring || isAfter

      let idealTab = "overview"
      if (isAfter) {
        idealTab = "results"
      } else if (canCurrentlyVote) {
        idealTab = "vote"
      } else if (canCurrentlyRegister) {
        idealTab = "register"
      }

      // Check if ideal tab is actually visible
      let finalTab = "overview"
      if (idealTab === "results" && showResults) finalTab = "results"
      else if (idealTab === "vote" && canCurrentlyVote)
        finalTab = "vote" // Use direct condition
      else if (idealTab === "register" && canCurrentlyRegister) finalTab = "register" // Use direct condition

      setActiveTab(finalTab)
    } catch (err) {
      console.error("Error fetching campaign details:", err)
      setError(err.message || "Failed to load campaign details. Please check the console and try again.")
      // Clear state on error
      setCampaignInfo(null)
      setProposals([])
      setCandidates([])
    } finally {
      setLoading(false)
      console.log("Finished fetching campaign data.")
    }
  }

  // --- Effects ---
  useEffect(() => {
    // Initial fetch or fetch when dependencies change
    if (campaignId && isConnected && contract) {
      // Ensure contract is available too
      fetchCampaignData()
    } else if (!isConnected) {
      // Clear state if disconnected
      setCampaignInfo(null)
      setProposals([])
      setCandidates([])
      setError(null)
      setLoading(true) // Set back to loading state until connection
    }
    // Intentionally excluding address from deps here to avoid refetch on account switch *unless* needed by voterStatus logic
  }, [campaignId, isConnected, contract]) // Depend on contract instance

  // --- Event Handlers ---
  const handleRegistrationSuccess = async () => {
    console.log("Registration successful, refetching status and data...")
    // Optimistic UI update (optional, handled by refetch mostly)
    setCampaignInfo((prev) => (prev ? { ...prev, registeredVoterCount: (prev.registeredVoterCount ?? 0) + 1 } : null))
    await refetchVoterStatus() // Refetch voter status first
    // No need to fully refetch all campaign data usually, status update is enough
    // fetchCampaignData(); // Optionally refetch all if needed
    setActiveTab("overview") // Navigate away from register tab
    // Consider refetching subgraph events if UI relies heavily on subgraph counts
    // if (refetchEvents) refetchEvents();
  }

  const handleVoteSuccess = async (votedItemId) => {
    console.log("Vote successful, refetching status...")
    // Optimistic UI update (optional, handled by refetch mostly)
    setCampaignInfo((prev) => (prev ? { ...prev, totalVotes: (prev.totalVotes ?? 0) + 1 } : null))
    if (campaignInfo?.votingType === 1) {
      setProposals((prev) => prev.map((p) => (p.id === votedItemId ? { ...p, voteCount: (p.voteCount ?? 0) + 1 } : p)))
    } else {
      setCandidates((prev) => prev.map((c) => (c.id === votedItemId ? { ...c, voteCount: (c.voteCount ?? 0) + 1 } : c)))
    }
    await refetchVoterStatus() // Refetch voter status
    setActiveTab("results") // Navigate to results after voting
    // Consider refetching subgraph events
    // if (refetchEvents) refetchEvents();
  }

  // --- Status Message Component ---
  const StatusMessage = () => {
    if (isOwner) {
      return (
        <Alert className="border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-300">
          <Award className="h-4 w-4 !text-purple-500" />
          <AlertTitle className="font-semibold">Campaign Owner</AlertTitle>
          <AlertDescription>
            You created this campaign. Sit back, relax, and watch the votes come in! 🍿
          </AlertDescription>
        </Alert>
      )
    }

    if (voterStatusLoading && !campaignInfo) {
      // Show status loading only if main data isn't loaded yet
      return (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertTitle>Loading Status</AlertTitle>
          <AlertDescription>Checking your connection and eligibility...</AlertDescription>
        </Alert>
      )
    }
    if (voterStatusError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Status Error</AlertTitle>
          <AlertDescription>{voterStatusError}</AlertDescription>
        </Alert>
      )
    }

    // --- Messages based on Campaign Phase & User Status ---
    const baseClasses = "border"
    const textClasses = "" // Removed flex, rely on Alert structure

    if (isAfterEnd) {
      return (
        <Alert className={cn(baseClasses, "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30")}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Campaign Ended</AlertTitle>
          <AlertDescription className={textClasses}>
            The voting period is over. Check the 'Results' tab for the outcome.
          </AlertDescription>
        </Alert>
      )
    }

    if (isBeforeStart) {
      if (isCandidate) {
        return (
          <Alert
            className={cn(
              baseClasses,
              "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300",
            )}
          >
            <Award className="h-4 w-4 !text-green-500" />
            <AlertTitle>Candidate Registered</AlertTitle>
            <AlertDescription className={textClasses}>
              You're registered as a candidate! Voting starts soon. Good luck!
            </AlertDescription>
          </Alert>
        )
      }
      if (campaignInfo?.restriction === 2 && !userRegistered) {
        return (
          <Alert variant="warning" className={cn(baseClasses)}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Registration Required</AlertTitle>
            <AlertDescription className={textClasses}>
              This campaign requires registration. Head to the 'Register' tab before voting begins.
            </AlertDescription>
          </Alert>
        )
      }
      return (
        <Alert
          className={cn(
            baseClasses,
            "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300",
          )}
        >
          <Clock className="h-4 w-4 !text-blue-500" />
          <AlertTitle>Upcoming Campaign</AlertTitle>
          <AlertDescription className={textClasses}>
            {userRegistered ? "You are eligible!" : "This campaign is open!"} Voting will begin soon.
          </AlertDescription>
        </Alert>
      )
    }

    if (isDuringVoting) {
      if (isCandidate) {
        // Handled case where candidate missed required registration (cannot vote)
        if (campaignInfo?.restriction === 2 && !userRegistered) {
          return (
            <Alert variant="warning" className={cn(baseClasses)}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Registration Missed</AlertTitle>
              <AlertDescription className={textClasses}>
                As a candidate, you were also required to register but didn't. You cannot vote in this campaign.
              </AlertDescription>
            </Alert>
          )
        }
        return (
          <Alert
            className={cn(
              baseClasses,
              "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300",
            )}
          >
            <Award className="h-4 w-4 !text-green-500" />
            <AlertTitle>Candidate Status</AlertTitle>
            <AlertDescription className={textClasses}>
              You are a candidate. Voting is active. {userVoted ? "You have already cast your vote." : ""}
            </AlertDescription>
          </Alert>
        )
      }
      if (userVoted) {
        return (
          <Alert
            className={cn(
              baseClasses,
              "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300",
            )}
          >
            <Check className="h-4 w-4 !text-green-500" />
            <AlertTitle>Vote Cast</AlertTitle>
            <AlertDescription className={textClasses}>
              Thank you for participating! Your vote has been securely recorded.
            </AlertDescription>
          </Alert>
        )
      }
      if (!userRegistered && campaignInfo?.restriction === 2) {
        return (
          <Alert variant="warning" className={cn(baseClasses)}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Registration Required</AlertTitle>
            <AlertDescription className={textClasses}>
              Registration was required for this campaign, but you are not registered. You cannot vote.
            </AlertDescription>
          </Alert>
        )
      }
      // Eligible to vote
      return (
        <Alert
          className={cn(
            baseClasses,
            "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300",
          )}
        >
          <Vote className="h-4 w-4 !text-blue-500" />
          <AlertTitle>Voting Active</AlertTitle>
          <AlertDescription className={textClasses}>
            The polls are open! Proceed to the 'Vote' tab to make your choice.
          </AlertDescription>
        </Alert>
      )
    }

    return null // Fallback
  }

  // --- Tab Visibility Logic ---
  const showOverviewTab = true
  const showRegisterTab =
    !isOwner && !isCandidate && !userRegistered && isBeforeStart && campaignInfo?.restriction === 2

  // Make sure the register tab is not shown if the user is already registered
  const showVoteTab = !isOwner && !isCandidate && userRegistered && isDuringVoting && !userVoted
  const showResultsTab = isOwner || isAfterEnd || isDuringVoting

  // Calculate number of visible tabs for dynamic grid layout
  const visibleTabCount = [showOverviewTab, showRegisterTab, showVoteTab, showResultsTab].filter(Boolean).length
  const tabGridColsClass = `grid-cols-${visibleTabCount > 0 ? visibleTabCount : 1}` // Avoid grid-cols-0

  // ================= RENDER LOGIC =================

  // --- 1. Show Mandatory Connect Dialog ---
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <MandatoryWalletConnectDialog onConnectWallet={connectWallet} onGoBack={() => router.push("/campaigns")} />
      </div>
    )
  }

  // --- 2. Show Loading State ---
  if (loading || (voterStatusLoading && !campaignInfo)) {
    // Show loading if main data OR voter status is loading initially
    return (
      <div className="container max-w-5xl mx-auto py-10 mt-16 md:mt-20">
        {/* Enhanced Skeleton Layout */}
        <div className="mb-6">
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="text-center mb-10 space-y-3">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <div className="flex justify-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
        <Skeleton className="h-28 w-full mb-6 rounded-lg" /> {/* Countdown Card Skeleton */}
        <Skeleton className="h-16 w-full mb-8 rounded-lg" /> {/* Status Alert Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-full mb-6 rounded-lg" /> {/* Tabs List Skeleton */}
        <Skeleton className="h-64 w-full rounded-lg" /> {/* Tab Content Skeleton */}
      </div>
    )
  }

  // --- 3. Show Error State ---
  if (error) {
    return (
      <div className="container max-w-3xl mx-auto py-10 mt-20 text-center">
        <Alert variant="destructive" className="text-left mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Campaign</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center gap-4">
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

  // --- 4. Show "Not Found" State ---
  if (!campaignInfo) {
    return (
      <div className="container max-w-3xl mx-auto py-10 mt-20 text-center">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Campaign Not Found</AlertTitle>
          <AlertDescription>The requested campaign data could not be loaded or does not exist.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push("/campaigns")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>
    )
  }

  // --- 5. Render Main Content ---
  return (
    <div className="container max-w-5xl mx-auto py-10 mt-16 md:mt-20">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2" asChild>
          
        </Button>
      </div>

      {/* Campaign Title Area */}
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight break-words mb-3">{campaignInfo.description}</h1>
        <div className="flex justify-center items-center flex-wrap gap-2 mb-3">
          {/* Status Badge */}
          <Badge
            variant={isDuringVoting ? "default" : isAfterEnd ? "secondary" : "outline"}
            className={cn(
              "text-xs font-medium px-2.5 py-0.5", // Common badge styles
              isDuringVoting &&
                "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-300 dark:border-green-700",
              isBeforeStart &&
                "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-300 dark:border-blue-700",
              isAfterEnd &&
                "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600",
            )}
          >
            {isBeforeStart ? "Upcoming" : isDuringVoting ? "Active" : "Ended"}
          </Badge>
          {/* Type Badge */}
          <Badge variant="outline" className="text-xs font-medium px-2.5 py-0.5">
            {campaignInfo.votingType === 0 ? "Candidate-Based" : "Proposal-Based"}
          </Badge>
          {/* Restriction Badge */}
          <Badge variant="outline" className="text-xs font-medium px-2.5 py-0.5">
            {campaignInfo.restriction === 0
              ? "Open To All"
              : campaignInfo.restriction === 1
                ? "Limited Access"
                : "Registration Required"}
          </Badge>
          {/* Role Badge (if applicable) */}
          {isOwner && (
            <Badge
              variant="outline"
              className="text-xs font-medium px-2.5 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 border-purple-300 dark:border-purple-700"
            >
              <Award className="h-3 w-3 mr-1" /> Owner
            </Badge>
          )}
          {isCandidate &&
            !isOwner && ( // Show only if not owner
              <Badge
                variant="outline"
                className="text-xs font-medium px-2.5 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700"
              >
                <Users className="h-3 w-3 mr-1" /> Candidate
              </Badge>
            )}
        </div>
        <p className="text-sm text-muted-foreground">
          Created by: <span className="font-mono text-xs">{formatAddress(campaignInfo.creator)}</span>
        </p>
      </header>

      {/* Countdown Timer Card */}
      <Card className="mb-6 border-border/40 bg-background/30 dark:bg-gray-800/20 backdrop-blur-sm shadow-sm">
        <CardContent className="pt-6 text-center">
          <h2 className="text-base font-semibold mb-3 text-muted-foreground tracking-wide uppercase">
            {isBeforeStart ? "Voting Starts In" : isDuringVoting ? "Voting Ends In" : ""}
          </h2>
          
            <CampaignCountdown
              endTime={isBeforeStart ? campaignInfo.startTime : campaignInfo.endTime}
              className="text-2xl md:text-3xl font-semibold text-foreground"
            />
          
        </CardContent>
      </Card>

      {/* Status Message Alert */}
      <div className="mb-8">
        <StatusMessage />
      </div>

      {/* Campaign Stats Grid */}
      <section aria-labelledby="stats-heading" className="mb-10">
        <h2 id="stats-heading" className="sr-only">
          Campaign Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Timeline Card */}
          <Card className="border-border/40 bg-background/30 dark:bg-gray-800/20 backdrop-blur-sm shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-md">
                  <CalendarClock className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Timeline</h3>
                  <div className="text-xs text-muted-foreground mt-1">
                    <div>Start: {formatDate(campaignInfo.startTime)}</div>
                    <div>End: {formatDate(campaignInfo.endTime)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Participation Card */}
          <Card className="border-border/40 bg-background/30 dark:bg-gray-800/20 backdrop-blur-sm shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-md">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Participation</h3>
                  <div className="text-xs text-muted-foreground mt-1">
                    <div>Votes Cast: {campaignInfo.totalVotes ?? 0}</div>
                    {campaignInfo.restriction !== 0 && <div>Registered: {campaignInfo.registeredVoterCount ?? 0}</div>}
                    <div>
                      {campaignInfo.votingType === 0 ? "Candidates" : "Proposals"}: {campaignInfo.itemCount ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Your Status Card */}
          <Card className="border-border/40 bg-background/30 dark:bg-gray-800/20 backdrop-blur-sm shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-md">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Your Status</h3>
                  <div className="text-xs text-muted-foreground mt-1">
                    {voterStatusLoading ? (
                      <span className="inline-flex items-center">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Checking...
                      </span>
                    ) : voterStatusError ? (
                      <span className="text-red-600 dark:text-red-400">Error checking status</span>
                    ) : (
                      <div className="space-y-0.5">
                        {/* Eligibility */}
                        <div>
                          <span className="font-medium">Eligibility:</span>{" "}
                          {isOwner ? (
                            <span className="text-purple-700 dark:text-purple-300 font-semibold">Owner</span>
                          ) : isCandidate ? (
                            <span className="text-indigo-700 dark:text-indigo-300 font-semibold">Candidate</span>
                          ) : campaignInfo.restriction === 0 ? (
                            <span className="text-gray-600 dark:text-gray-400">Open Access</span>
                          ) : userRegistered ? (
                            <span className="text-green-700 dark:text-green-300">Eligible</span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400">Not Eligible/Registered</span>
                          )}
                        </div>
                        {/* Vote Status */}
                        {!isOwner && !isCandidate && (
                          <div>
                            <span className="font-medium">Vote:</span>{" "}
                            {userVoted ? (
                              <span className="text-green-700 dark:text-green-300">Voted</span>
                            ) : (
                              <span>Not Voted Yet</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tabs Section */}
      <section aria-labelledby="campaign-details-tabs">
        <h2 id="campaign-details-tabs" className="sr-only">
          Campaign Details and Actions
        </h2>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Dynamically set grid columns based on visible tabs */}
          <TabsList
            className={cn("grid w-full mb-6 bg-muted/40 dark:bg-gray-800/30 p-1 h-auto rounded-lg", tabGridColsClass)}
          >
            {showOverviewTab && (
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
            )}
            {showRegisterTab && (
              <TabsTrigger value="register" className="text-xs sm:text-sm">
                Register
              </TabsTrigger>
            )}
            {showVoteTab && (
              <TabsTrigger value="vote" className="text-xs sm:text-sm">
                Vote
              </TabsTrigger>
            )}
            {showResultsTab && (
              <TabsTrigger value="results" className="text-xs sm:text-sm">
                Results
              </TabsTrigger>
            )}
          </TabsList>

          {/* Tab Content Panes */}
          {showOverviewTab && (
            <TabsContent value="overview" className="mt-0">
              <OverviewTab
                campaignInfo={campaignInfo}
                proposals={proposals}
                candidates={candidates}
                isOwner={isOwner}
                isCandidate={isCandidate}
                isRegisteredVoter={userRegistered}
                isBeforeStart={isBeforeStart}
                isDuringVoting={isDuringVoting}
                isAfterEnd={isAfterEnd}
              />
            </TabsContent>
          )}
          {/* Only render the register tab if showRegisterTab is true */}
          {showRegisterTab && (
            <TabsContent value="register" className="mt-0">
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
          {showVoteTab && (
            <TabsContent value="vote" className="mt-0">
              <VoteTab
                campaignInfo={campaignInfo}
                proposals={proposals}
                candidates={candidates} // Pass fetched candidates
                contract={contract}
                campaignId={campaignId}
                isConnected={isConnected}
                connectWallet={connectWallet}
                onVoteSuccess={handleVoteSuccess}
              />
            </TabsContent>
          )}
          {showResultsTab && (
            <TabsContent value="results" className="mt-0">
              <ResultsTab
                campaignInfo={campaignInfo}
                proposals={proposals}
                candidates={candidates} // Pass fetched candidates
                isOwner={isOwner}
                isDuringVoting={isDuringVoting}
                isAfterEnd={isAfterEnd}
                // Pass other necessary props like contract/campaignId if needed by ResultsTab
              />
            </TabsContent>
          )}
        </Tabs>
      </section>
    </div>
  )
}
