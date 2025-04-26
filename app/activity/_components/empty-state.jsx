"use client"

import { Bell, Calendar, User, Vote, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EmptyState({ type }) {
  const getIcon = () => {
    switch (type) {
      case "campaigns":
        return <Calendar className="h-16 w-16 text-muted-foreground/30" />
      case "votes":
        return <Vote className="h-16 w-16 text-muted-foreground/30" />
      case "registrations":
        return <User className="h-16 w-16 text-muted-foreground/30" />
      case "transfers":
        return <Flag className="h-16 w-16 text-muted-foreground/30" />
      default:
        return <Bell className="h-16 w-16 text-muted-foreground/30" />
    }
  }

  const getMessage = () => {
    switch (type) {
      case "campaigns":
        return "No campaign events found"
      case "votes":
        return "No voting events found"
      case "registrations":
        return "No registration events found"
      case "transfers":
        return "No transfer events found"
      default:
        return "No events found"
    }
  }

  const getActionText = () => {
    switch (type) {
      case "campaigns":
        return "Create a Campaign"
      case "votes":
      case "registrations":
        return "Browse Campaigns"
      default:
        return "Explore Campaigns"
    }
  }

  const getActionLink = () => {
    switch (type) {
      case "campaigns":
        return "/campaigns/create"
      default:
        return "/campaigns"
    }
  }

  const getSubtitle = () => {
    switch (type) {
      case "campaigns":
        return "Start your own campaign or join existing ones"
      case "votes":
        return "Participate in active campaigns to see voting activity"
      case "registrations":
        return "Register for campaigns to start participating"
      case "transfers":
        return "NFT transfers will appear here"
      default:
        return "Activity will appear here once blockchain events are recorded"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-muted-foreground/20 bg-muted/5">
      <div className="bg-background/80 rounded-full p-4 shadow-sm">{getIcon()}</div>
      <h3 className="mt-4 text-lg font-medium">{getMessage()}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{getSubtitle()}</p>
      <Link href={getActionLink()}>
        <Button className="mt-6 gap-2">
          {type === "campaigns" && <Flag className="h-4 w-4" />}
          {getActionText()}
        </Button>
      </Link>
    </div>
  )
}
