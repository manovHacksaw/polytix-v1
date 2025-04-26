"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Bell, Calendar, Check, ChevronDown, ChevronRight, Clock, Flag, Trophy, User, UserPlus, Vote, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatAddress } from "@/lib/utils"

// Define NotificationType enum
const NotificationType = {
  CAMPAIGN_CREATED: 0,
  CAMPAIGN_STARTED: 1,
  CAMPAIGN_ENDED: 2,
  VOTE_CAST: 3,
  VOTE_RECEIVED: 4,
  USER_REGISTERED: 5,
  CANDIDATE_REGISTERED: 6
}

export default function NotificationItem({ notification, isRead = false, onMarkAsRead }) {
  const [expanded, setExpanded] = useState(false)

  const getNotificationIcon = () => {
    switch (notification.notificationType) {
      case NotificationType.CAMPAIGN_CREATED:
        return <Calendar className="h-5 w-5 text-blue-500" />
      case NotificationType.CAMPAIGN_STARTED:
        return <Flag className="h-5 w-5 text-green-500" />
      case NotificationType.CAMPAIGN_ENDED:
        return <Trophy className="h-5 w-5 text-purple-500" />
      case NotificationType.VOTE_CAST:
        return <Vote className="h-5 w-5 text-indigo-500" />
      case NotificationType.VOTE_RECEIVED:
        return <Check className="h-5 w-5 text-green-500" />
      case NotificationType.USER_REGISTERED:
        return <User className="h-5 w-5 text-blue-500" />
      case NotificationType.CANDIDATE_REGISTERED:
        return <UserPlus className="h-5 w-5 text-orange-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationTitle = () => {
    switch (notification.notificationType) {
      case NotificationType.CAMPAIGN_CREATED:
        return "Campaign Created"
      case NotificationType.CAMPAIGN_STARTED:
        return "Campaign Started"
      case NotificationType.CAMPAIGN_ENDED:
        return "Campaign Ended"
      case NotificationType.VOTE_CAST:
        return "Vote Cast"
      case NotificationType.VOTE_RECEIVED:
        return "Vote Received"
      case NotificationType.USER_REGISTERED:
        return "Registered as Voter"
      case NotificationType.CANDIDATE_REGISTERED:
        return "Registered as Candidate"
      default:
        return "Notification"
    }
  }

  const getNotificationDescription = () => {
    switch (notification.notificationType) {
      case NotificationType.CAMPAIGN_CREATED:
        return `Campaign #${notification.campaignId} was created`
      case NotificationType.CAMPAIGN_STARTED:
        return `Campaign #${notification.campaignId} has started`
      case NotificationType.CAMPAIGN_ENDED:
        return `Campaign #${notification.campaignId} has ended`
      case NotificationType.VOTE_CAST:
        return `A vote was cast in campaign #${notification.campaignId}`
      case NotificationType.VOTE_RECEIVED:
        return `A vote was received in campaign #${notification.campaignId}`
      case NotificationType.USER_REGISTERED:
        return `A voter registered in campaign #${notification.campaignId}`
      case NotificationType.CANDIDATE_REGISTERED:
        return `A candidate registered in campaign #${notification.campaignId}`
      default:
        return notification.data || "No additional information"
    }
  }

  const getRelatedEntityText = () => {
    switch (notification.notificationType) {
      case NotificationType.VOTE_CAST:
        return `Voted for option #${notification.relatedEntityId}`
      case NotificationType.VOTE_RECEIVED:
        return `Received vote as candidate #${notification.relatedEntityId}`
      default:
        return notification.relatedEntityId ? `Related ID: ${notification.relatedEntityId}` : null
    }
  }

  const getNotificationBadge = () => {
    switch (notification.notificationType) {
      case NotificationType.CAMPAIGN_CREATED:
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Created</Badge>
      case NotificationType.CAMPAIGN_STARTED:
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Started</Badge>
      case NotificationType.CAMPAIGN_ENDED:
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Ended</Badge>
      case NotificationType.VOTE_CAST:
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">Voted</Badge>
      case NotificationType.VOTE_RECEIVED:
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Received</Badge>
      case NotificationType.USER_REGISTERED:
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Registered</Badge>
      case NotificationType.CANDIDATE_REGISTERED:
        return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Candidate</Badge>
      default:
        return null
    }
  }

  const getActionButton = () => {
    switch (notification.notificationType) {
      case NotificationType.CAMPAIGN_CREATED:
      case NotificationType.CAMPAIGN_STARTED:
      case NotificationType.CAMPAIGN_ENDED:
        return (
          <Link href={`/campaigns/${notification.campaignId}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <span>View Campaign</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        )
      case NotificationType.VOTE_CAST:
        return (
          <Link href={`/campaigns/${notification.campaignId}/results`}>
            <Button variant="outline" size="sm" className="gap-1">
              <span>View Results</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        )
      case NotificationType.USER_REGISTERED:
      case NotificationType.CANDIDATE_REGISTERED:
        return (
          <Link href={`/campaigns/${notification.campaignId}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <span>Go to Campaign</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        )
      default:
        return null
    }
  }

  const handleExpand = () => {
    setExpanded(!expanded)
    if (!isRead && onMarkAsRead) {
      onMarkAsRead()
    }
  }

  const formattedTime = formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })

  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md ${expanded ? 'border-primary/20' : ''} ${!isRead ? 'border-l-4 border-l-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`mt-1 rounded-full p-2 ${!isRead ? 'bg-primary/10' : 'bg-muted'}`}>
            {getNotificationIcon()}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{getNotificationTitle()}</h4>
                {getNotificationBadge() && <div className="hidden sm:block">{getNotificationBadge()}</div>}
                {!isRead && (
                  <Badge variant="default" className="h-5 px-1">New</Badge>
                )}
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
                    {new Date(notification.timestamp).toLocaleString()}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <p className="text-sm text-muted-foreground">{getNotificationDescription()}</p>

            {expanded && (
              <div className="mt-3 pt-3 border-t text-sm space-y-2 bg-muted/5 p-3 rounded-md">
                {notification.data && (
                  <div>
                    <span className="font-medium">Details:</span> {notification.data}
                  </div>
                )}

                {getRelatedEntityText() && (
                  <div>
                    <span className="font-medium">Entity:</span> {getRelatedEntityText()}
                  </div>
                )}

                <div>
                  <span className="font-medium">Campaign:</span>{" "}
                  <Link href={`/campaigns/${notification.campaignId}`} className="text-primary hover:underline">
                    #{notification.campaignId}
                  </Link>
                </div>

                <div>
                  <span className="font-medium">Time:</span> {new Date(notification.timestamp).toLocaleString()}
                </div>

                <div>
                  <span className="font-medium">User:</span>{" "}
                  <span className="font-mono text-xs bg-muted p-1 rounded">
                    {formatAddress(notification.userAddress)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-2 pt-1">
              <div className="flex gap-2">
                {getActionButton()}
                
                {!isRead && onMarkAsRead && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onMarkAsRead}
                    className="gap-1"
                  >
                    <BookmarkCheck className="h-4 w-4" />
                    <span className="text-xs">Mark read</span>
                  </Button>
                )}
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleExpand} 
                className={`ml-auto ${expanded ? 'text-primary' : ''}`}
              >
                {expanded ? (
                  <>
                    <span className="text-xs">Less details</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    <span className="text-xs">More details</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
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
