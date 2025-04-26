"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, AlertCircle, Medal, List } from "lucide-react"
import { formatAddress } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts"

export default function ResultsTab({ campaignInfo, proposals, candidates, isOwner = false }) {
  // Sort items by vote count (descending)
  const sortedProposals = [...proposals].sort((a, b) => b.voteCount - a.voteCount)
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount)

  // Determine if there's a winner or tie
  const getWinnerStatus = () => {
    if (campaignInfo.votingType === 1 /* ProposalBased */) {
      if (proposals.length === 0) return { hasTie: false, hasWinner: false }

      const highestVotes = sortedProposals[0]?.voteCount || 0
      const tiedWinners = sortedProposals.filter((p) => p.voteCount === highestVotes)

      return {
        hasTie: tiedWinners.length > 1,
        hasWinner: highestVotes > 0,
        tiedWinners,
      }
    } else {
      if (candidates.length === 0) return { hasTie: false, hasWinner: false }

      const highestVotes = sortedCandidates[0]?.voteCount || 0
      const tiedWinners = sortedCandidates.filter((c) => c.voteCount === highestVotes)

      return {
        hasTie: tiedWinners.length > 1,
        hasWinner: highestVotes > 0,
        tiedWinners,
      }
    }
  }

  const winnerStatus = getWinnerStatus()

  // Prepare data for charts
  const prepareBarChartData = () => {
    if (campaignInfo.votingType === 1) {
      return proposals.map((p) => ({
        name: `Proposal ${p.id + 1}`,
        votes: p.voteCount,
      }))
    } else {
      return candidates.map((c) => ({
        name: c.name,
        votes: c.voteCount,
      }))
    }
  }

  const preparePieChartData = () => {
    if (campaignInfo.votingType === 1) {
      return proposals.map((p) => ({
        name: `Proposal ${p.id + 1}`,
        value: p.voteCount,
      }))
    } else {
      return candidates.map((c) => ({
        name: c.name,
        value: c.voteCount,
      }))
    }
  }

  // Prepare data for rank-based visualization
  const prepareRankData = () => {
    if (campaignInfo.votingType === 1) {
      return sortedProposals.map((p, index) => ({
        name: `Proposal ${p.id + 1}`,
        votes: p.voteCount,
        rank: index + 1,
      }))
    } else {
      return sortedCandidates.map((c, index) => ({
        name: c.name,
        votes: c.voteCount,
        rank: index + 1,
      }))
    }
  }

  const barChartData = prepareBarChartData()
  const pieChartData = preparePieChartData()
  const rankData = prepareRankData()

  // Colors for pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ]

  // If no votes have been cast yet
  if (campaignInfo.totalVotes === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>No votes have been cast in this campaign yet.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Once votes are cast, results will be displayed here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {campaignInfo.resultType === 0 ? (
              <>
                <List className="h-5 w-5 text-primary" />
                Rank-Based Results
              </>
            ) : (
              <>
                <Trophy className="h-5 w-5 text-yellow-500" />
                One Winner Results
              </>
            )}
          </CardTitle>
          <CardDescription>
            {campaignInfo.resultType === 0
              ? "Showing all options ranked by number of votes"
              : "Showing the winning option with the highest number of votes"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaignInfo.resultType === 0 ? (
            // Rank-Based Results
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-medium mb-4 flex items-center">
                  <Medal className="h-5 w-5 mr-2 text-primary" />
                  Ranked Results
                </h3>
                <div className="space-y-3">
                  {rankData.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold">{item.rank}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="outline">{item.votes} votes</Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${
                                campaignInfo.totalVotes > 0 ? (item.votes / campaignInfo.totalVotes) * 100 : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // One Winner Results
            <div>
              {winnerStatus.hasWinner ? (
                winnerStatus.hasTie ? (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                    <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
                      Tie Between {winnerStatus.tiedWinners.length} Options
                    </h3>
                    <div className="mt-4 space-y-3">
                      {campaignInfo.votingType === 1 /* ProposalBased */
                        ? winnerStatus.tiedWinners.map((proposal) => (
                            <div key={proposal.id} className="bg-white dark:bg-gray-800 p-3 rounded-md">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">Proposal {proposal.id + 1}</h4>
                                <Badge>{proposal.voteCount} votes</Badge>
                              </div>
                              <p className="text-sm mt-1 text-muted-foreground">{proposal.content}</p>
                            </div>
                          ))
                        : winnerStatus.tiedWinners.map((candidate) => (
                            <div key={candidate.id} className="bg-white dark:bg-gray-800 p-3 rounded-md">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">{candidate.name}</h4>
                                <Badge>{candidate.voteCount} votes</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{formatAddress(candidate.address)}</p>
                              <p className="text-sm mt-1 text-muted-foreground">{candidate.statement}</p>
                            </div>
                          ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                    {campaignInfo.votingType === 1 /* ProposalBased */ ? (
                      <div>
                        <h3 className="font-medium text-green-800 dark:text-green-300 flex items-center">
                          <Trophy className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                          Proposal {sortedProposals[0].id + 1} Won
                        </h3>
                        <Badge className="mt-2">{sortedProposals[0].voteCount} votes</Badge>
                        <p className="mt-3 text-green-700 dark:text-green-300">{sortedProposals[0].content}</p>
                        <p className="text-sm mt-2 text-green-600 dark:text-green-400">
                          This proposal received{" "}
                          {Math.round((sortedProposals[0].voteCount / campaignInfo.totalVotes) * 100)}% of all votes.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-medium text-green-800 dark:text-green-300 flex items-center">
                          <Trophy className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                          {sortedCandidates[0].name} Won
                        </h3>
                        <Badge className="mt-2">{sortedCandidates[0].voteCount} votes</Badge>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          {formatAddress(sortedCandidates[0].address)}
                        </p>
                        <p className="mt-2 text-green-700 dark:text-green-300">{sortedCandidates[0].statement}</p>
                        <p className="text-sm mt-2 text-green-600 dark:text-green-400">
                          This candidate received{" "}
                          {Math.round((sortedCandidates[0].voteCount / campaignInfo.totalVotes) * 100)}% of all votes.
                        </p>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p>No clear winner yet. Votes are still being tallied.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
            <CardDescription>Bar chart showing vote distribution across all options</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} interval={0} />
                <YAxis />
                <RechartsTooltip
                  formatter={(value, name) => [`${value} votes`, "Votes"]}
                  labelFormatter={(label) => `Option: ${label}`}
                />
                <Bar dataKey="votes" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Percentage Breakdown</CardTitle>
            <CardDescription>Pie chart showing percentage of votes for each option</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => [`${value} votes`, "Votes"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rank Visualization (only for Rank-Based results) */}
      {campaignInfo.resultType === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rank Visualization</CardTitle>
            <CardDescription>Line chart showing the ranking of each option</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={rankData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} interval={0} />
                <YAxis
                  reversed
                  domain={[1, rankData.length]}
                  label={{ value: "Rank", angle: -90, position: "insideLeft" }}
                />
                <RechartsTooltip
                  formatter={(value, name) => [`Rank ${value}`, "Position"]}
                  labelFormatter={(label) => `Option: ${label}`}
                />
                <Line type="monotone" dataKey="rank" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
          <CardDescription>Complete breakdown of all voting options and their results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaignInfo.votingType === 1 /* ProposalBased */
              ? // Proposal results
                sortedProposals.map((proposal, index) => (
                  <div key={proposal.id} className="bg-background/60 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        {campaignInfo.resultType === 1 &&
                          index === 0 &&
                          !winnerStatus.hasTie &&
                          proposal.voteCount > 0 && <Trophy className="h-4 w-4 text-yellow-500 mr-2" />}
                        {campaignInfo.resultType === 0 && (
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold">{index + 1}</span>
                          </div>
                        )}
                        <h3 className="font-medium">Proposal {proposal.id + 1}</h3>
                      </div>
                      <Badge variant="secondary">{proposal.voteCount} votes</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{proposal.content}</p>
                    <div className="mt-2 w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{
                          width: `${
                            campaignInfo.totalVotes > 0 ? (proposal.voteCount / campaignInfo.totalVotes) * 100 : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-muted-foreground">
                      {campaignInfo.totalVotes > 0
                        ? Math.round((proposal.voteCount / campaignInfo.totalVotes) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                ))
              : // Candidate results
                sortedCandidates.map((candidate, index) => (
                  <div key={candidate.id} className="bg-background/60 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        {campaignInfo.resultType === 1 &&
                          index === 0 &&
                          !winnerStatus.hasTie &&
                          candidate.voteCount > 0 && <Trophy className="h-4 w-4 text-yellow-500 mr-2" />}
                        {campaignInfo.resultType === 0 && (
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold">{index + 1}</span>
                          </div>
                        )}
                        <h3 className="font-medium">{candidate.name}</h3>
                      </div>
                      <Badge variant="secondary">{candidate.voteCount} votes</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatAddress(candidate.address)}</p>
                    <div className="mt-2 w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{
                          width: `${
                            campaignInfo.totalVotes > 0 ? (candidate.voteCount / campaignInfo.totalVotes) * 100 : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-muted-foreground">
                      {campaignInfo.totalVotes > 0
                        ? Math.round((candidate.voteCount / campaignInfo.totalVotes) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Votes:</span>
              <span className="font-medium">{campaignInfo.totalVotes}</span>
            </div>
            {campaignInfo.restriction !== 0 && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Registered Voters:</span>
                <span className="font-medium">{campaignInfo.registeredVoterCount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Participation Rate:</span>
              <span className="font-medium">
                {campaignInfo.registeredVoterCount > 0
                  ? Math.round((campaignInfo.totalVotes / campaignInfo.registeredVoterCount) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
