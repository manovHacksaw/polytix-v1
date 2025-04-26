import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const NotificationType = {
  CAMPAIGN_CREATED: 0,
  CAMPAIGN_STARTED: 1,
  CAMPAIGN_ENDED: 2,
  VOTE_CAST: 3,
  VOTE_RECEIVED: 4,
  USER_REGISTERED: 5,
  CANDIDATE_REGISTERED: 6,
} 
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}

export const formatTimestamp = (timestamp) => {
  if (!timestamp || timestamp === 0n) return "N/A"
  try {
    // Convert BigInt to Number for Date constructor (safe for typical timestamps)
    return new Date(Number(timestamp) * 1000).toLocaleString()
  } catch (e) {
    console.error("Error formatting timestamp:", e)
    return "Invalid Date"
  }
}


export const resolveIpfsUrl = (hash) => {
  if (!hash) return null
  // Example using Pinata public gateway - use your own or a dedicated one
  return `https://gateway.pinata.cloud/ipfs/${hash}`
}

// Format address to shorter version
export const formatAddress = (address) => {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

// Calculate time remaining in readable format
export const getTimeRemaining = (targetTime) => {
  if (!targetTime) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  const now = BigInt(Math.floor(Date.now() / 1000))
  const target = BigInt(targetTime) // Convert targetTime to BigInt

  if (now >= target) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  const diff = target - now // Keep it as BigInt

  const days = diff / BigInt(60 * 60 * 24)
  const hours = (diff % BigInt(60 * 60 * 24)) / BigInt(60 * 60)
  const minutes = (diff % BigInt(60 * 60)) / BigInt(60)
  const seconds = diff % BigInt(60)

  return {
    days: Number(days),
    hours: Number(hours),
    minutes: Number(minutes),
    seconds: Number(seconds),
  }
}


export function getChartColor(index, mode = 'dark') {
  // Define color sets for light and dark mode
  const lightColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];
  
  const darkColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];
  
  const colors = mode === 'dark' ? darkColors : lightColors;
  return colors[index % colors.length];
}



export function getStatusText(status){
  switch (status) {
    case 0:
      return "Created"
    case 1:
      return "Active"
    case 2:
      return "Ended"
    default:
      return "Unknown"
  }
}

export function getRestrictionText(restriction) {
  switch (restriction) {
    case 0:
      return "Open"
    case 1:
      return "Limited"
    case 2:
      return "Registration Required"
    default:
      return "Unknown"
  }
}

export function getResultTypeText(resultType) {
  switch (resultType) {
    case 0:
      return "Ranked"
    case 1:
      return "One Winner"
    default:
      return "Unknown"
  }
}

export function getVotingTypeText(votingType) {
  switch (votingType) {
    case 0:
      return "Candidate-based"
    case 1:
      return "Proposal-based"
    default:
      return "Unknown"
  }
}


// New function to filter campaigns by search term
export function filterCampaigns(campaigns, searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") return campaigns

  const term = searchTerm.toLowerCase().trim()

  return campaigns.filter((campaign) => {
    // Search in description
    if (campaign.description && campaign.description.toLowerCase().includes(term)) return true

    // Search in creator address
    if (campaign.creator && campaign.creator.toLowerCase().includes(term)) return true

    return false
  })
}


// New function to calculate actual voter count (excluding candidates in candidate-based voting)
export function getActualVoterCount(campaignInfo) {
  if (!campaignInfo) return 0

  // For candidate-based voting, subtract candidate count from registered voters
  if (campaignInfo.votingType === 0 && campaignInfo.itemCount > 0) {
    return Math.max(0, campaignInfo.registeredVoterCount - campaignInfo.itemCount)
  }

  return campaignInfo.registeredVoterCount
}

// New function to calculate actual participation rate
export function getParticipationRate(campaignInfo) {
  if (!campaignInfo) return 0

  const actualVoterCount = getActualVoterCount(campaignInfo)

  if (actualVoterCount === 0) return 0
  return Math.round((campaignInfo.totalVotes / actualVoterCount) * 100)
}


export function isUserCandidate(address, candidates) {
  if (!address || !candidates || candidates.length === 0) return false

  return candidates.some((candidate) => candidate.address && candidate.address.toLowerCase() === address.toLowerCase())
}
