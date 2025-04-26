"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"
import { Users, Vote, CalendarClock, Award } from "lucide-react"

export default function DashboardStats({ campaignStats, campaignInfo, campaignTimeInfo }) {
  if (!campaignStats || !campaignInfo) return null

  const totalVotes = campaignStats.totalVotes || 0
  const registeredVoters = campaignStats.registeredVoterCount || 0
  const itemCount = campaignStats.itemCount || 0

  const now = Math.floor(Date.now() / 1000)
  const startTime = Number(campaignTimeInfo?.startTime || 0)
  const endTime = Number(campaignTimeInfo?.endTime || 0)

  // Calculate participation rate
  const participationRate = registeredVoters > 0 ? Math.round((totalVotes / registeredVoters) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
          <Vote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalVotes)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {now >= startTime && now < endTime
              ? "Voting in progress"
              : now < startTime
                ? "Voting not started"
                : "Voting completed"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registered Voters</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(registeredVoters)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {campaignInfo.restriction === 0 ? "Open voting" : `${participationRate}% participation rate`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {campaignInfo.votingType === 0 ? "Candidates" : "Proposals"}
          </CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(itemCount)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {campaignInfo.votingType === 0 ? "Candidate-based voting" : "Proposal-based voting"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Campaign Status</CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {now < startTime ? "Not Started" : now < endTime ? "In Progress" : "Ended"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {now < startTime ? "Registration phase" : now < endTime ? "Voting phase" : "Results available"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
