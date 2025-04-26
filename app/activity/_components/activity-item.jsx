"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Bell, Calendar, Check, ChevronDown, ChevronRight, Clock, Flag, Trophy, User, UserPlus, Vote, ExternalLink, ArrowRight, Repeat, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn, formatAddress } from "@/lib/utils"

export default function ActivityItem({ event }) {
  const [expanded, setExpanded] = useState(false)

  // Convert timestamp to milliseconds and format
  const timestamp = parseInt(event.blockTimestamp) * 1000
  const formattedTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true })

  const getEventIcon = () => {
    switch (event.type) {
      case "campaignCreated":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "campaignStatusChanged":
        return <Flag className="h-5 w-5 text-green-500" />
      case "voteCast":
        return <Vote className="h-5 w-5 text-indigo-500" />
      case "candidateAdded":
        return <UserPlus className="h-5 w-5 text-orange-500" />
      case "candidateRegistered":
        return <User className="h-5 w-5 text-purple-500" />
      case "voterRegistered":
        return <Check className="h-5 w-5 text-green-500" />
      case "transfer":
        return <Repeat className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getEventTitle = () => {
    switch (event.type) {
      case "campaignCreated":
        return "Campaign Created"
      case "campaignStatusChanged":
        return `Campaign Status Changed to ${getStatusLabel(event.status)}`
      case "voteCast":
        return "Vote Cast"
      case "candidateAdded":
        return "Candidate Added"
      case "candidateRegistered":
        return "Candidate Registered"
      case "voterRegistered":
        return "Voter Registered"
      case "transfer":
        return "NFT Transfer"
      default:
        return "Event"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "0":
        return "Pending"
      case "1":
        return "Active"
      case "2":
        return "Ended"
      case "3":
        return "Cancelled"
      default:
        return `Status ${status}`
    }
  }

  const getEventDescription = () => {
    switch (event.type) {
      case "campaignCreated":
        return `Campaign #${event.campaignId} was created by ${formatAddress(event.creator)}`
      case "campaignStatusChanged":
        return `Campaign #${event.campaignId} status changed to ${getStatusLabel(event.status)}`
      case "voteCast":
        return `Vote cast in campaign #${event.campaignId} by ${formatAddress(event.voter)} for option #${event.targetId}`
      case "candidateAdded":
        return `Candidate "${event.name}" (${formatAddress(event.candidateAddress)}) added to campaign #${event.campaignId}`
      case "candidateRegistered":
        return `${formatAddress(event.candidate)} registered as candidate in campaign #${event.campaignId}`
      case "voterRegistered":
        return `${formatAddress(event.voter)} registered as voter in campaign #${event.campaignId}`
      case "transfer":
        return `NFT #${event.tokenId} transferred from ${formatAddress(event.from)} to ${formatAddress(event.to)}`
      default:
        return "No additional information"
    }
  }

  const getEventBadge = () => {
    const badgeStyles = {
      campaignCreated: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
      campaignStatusChanged: "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
      voteCast: "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800",
      candidateAdded: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800",
      candidateRegistered: "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800",
      voterRegistered: "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
      transfer: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800"
    }

    const labels = {
      campaignCreated: "Created",
      campaignStatusChanged: "Status",
      voteCast: "Vote",
      candidateAdded: "Added",
      candidateRegistered: "Registered",
      voterRegistered: "Registered",
      transfer: "Transfer"
    }

    return (
      <Badge 
        variant="outline" 
        className={cn(
          "transition-all duration-300", 
          badgeStyles[event.type] || "bg-gray-50 text-gray-600 border-gray-200"
        )}
      >
        {labels[event.type] || "Event"}
      </Badge>
    )
  }

  const getActionButton = () => {
    if (event.campaignId) {
      return (
        <Link href={`/campaigns/${event.campaignId}`}>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 transition-all duration-300 hover:bg-primary hover:text-primary-foreground group"
          >
            <span>View Campaign</span>
            <ExternalLink className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </Link>
      )
    }
    return null
  }

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md",
      expanded ? "border-primary/30 shadow-lg" : "hover:border-primary/10"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={cn(
            "mt-1 rounded-full p-2 transition-all duration-300", 
            expanded ? "bg-primary/10" : "bg-muted"
          )}>
            {getEventIcon()}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{getEventTitle()}</h4>
                {getEventBadge() && <div className="hidden sm:block">{getEventBadge()}</div>}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formattedTime}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {new Date(timestamp).toLocaleString()}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <p className="text-sm text-muted-foreground">{getEventDescription()}</p>

            {expanded && (
              <div 
                className="mt-3 pt-3 border-t text-sm space-y-2 bg-muted/5 p-3 rounded-md animate-in fade-in slide-in-from-top-2 duration-300" 
              >
                {event.type === "campaignCreated" && (
                  <>
                    <div>
                      <span className="font-medium">Voting Type:</span> {event.votingType === "0" ? "Candidate Based" : "Proposal Based"}
                    </div>
                    <div>
                      <span className="font-medium">Restriction:</span> {event.restriction === "0" ? "Open To All" : event.restriction === "1" ? "Limited" : "Registration Required"}
                    </div>
                    <div>
                      <span className="font-medium">Start Time:</span> {new Date(parseInt(event.startTime) * 1000).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">End Time:</span> {new Date(parseInt(event.endTime) * 1000).toLocaleString()}
                    </div>
                  </>
                )}

                {event.type === "candidateAdded" && (
                  <div>
                    <span className="font-medium">Candidate ID:</span> {event.candidateId}
                  </div>
                )}

                {event.type === "candidateRegistered" && (
                  <div>
                    <span className="font-medium">Token ID:</span> {event.tokenId}
                  </div>
                )}

                {event.type === "voterRegistered" && (
                  <div>
                    <span className="font-medium">Token ID:</span> {event.tokenId}
                  </div>
                )}

                <div>
                  <span className="font-medium">Transaction:</span>{" "}
                  <a 
                    href={`https://polygonscan.com/tx/${event.id.split('-')[0]}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 inline-flex group"
                  >
                    View on Explorer
                    <ExternalLink className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>

                <div>
                  <span className="font-medium">Time:</span> {new Date(timestamp).toLocaleString()}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-2 pt-1">
              {getActionButton()}

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpanded(!expanded)} 
                className={cn(
                  "ml-auto transition-all duration-300", 
                  expanded ? "text-primary" : ""
                )}
              >
                {expanded ? (
                  <>
                    <span className="text-xs">Less details</span>
                    <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300" />
                  </>
                ) : (
                  <>
                    <span className="text-xs">More details</span>
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-300" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}