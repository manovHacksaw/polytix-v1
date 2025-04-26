"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAddress, formatNumber, getChartColor } from "@/lib/utils"
import { ChartTabs, ChartTabsList, ChartTabsTrigger, ChartTabsContent } from "@/components/ui/chart-tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"


export default function CampaignResults({ campaignId, contract, votingType, status }) {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [historicalData, setHistoricalData] = useState([])
  const [activeChartType, setActiveChartType] = useState("bar")

  useEffect(() => {
    if (!contract || !campaignId) return

    const fetchResults = async () => {
      try {
        setLoading(true)

        let items = []
        let total = 0
        const historicalDataPoints = []

        if (votingType === 0) {
          // Candidate-based
          const candidatesData = await contract.getCandidates(campaignId)

          // Format candidate data
          const candidates = []
          for (let i = 0; i < candidatesData.addresses.length; i++) {
            const lastVoteTimestamp = Number(candidatesData.lastVoteTimestamps[i])
            const votes = Number(candidatesData.voteCounts[i])

            candidates.push({
              id: i,
              name: candidatesData.names[i],
              address: candidatesData.addresses[i],
              votes: votes,
              lastVoteTimestamp: lastVoteTimestamp,
              // Add properties for charts
              label: candidatesData.names[i],
              value: votes,
            })

            total += votes

            // Add to historical data if timestamp exists
            if (lastVoteTimestamp > 0) {
              historicalDataPoints.push({
                name: candidatesData.names[i],
                timestamp: lastVoteTimestamp,
                votes: votes,
              })
            }
          }

          items = candidates
        } else {
          // Proposal-based
          const proposalsData = await contract.getProposals(campaignId)

          // Format proposal data
          const proposals = []
          for (let i = 0; i < proposalsData.contents.length; i++) {
            const content = proposalsData.contents[i]
            const votes = Number(proposalsData.voteCounts[i])

            proposals.push({
              id: i,
              content: content,
              votes: votes,
              // Add properties for charts
              name: `Proposal ${i + 1}`,
              label: `Proposal ${i + 1}`,
              value: votes,
            })

            total += votes
          }

          items = proposals
        }

        // Sort by votes (descending)
        items.sort((a, b) => b.votes - a.votes)

        // Process historical data if available
        if (historicalDataPoints.length > 0) {
          // Sort by timestamp
          historicalDataPoints.sort((a, b) => a.timestamp - b.timestamp)

          // Group by name and create time series
          const candidateGroups = {}

          historicalDataPoints.forEach((point) => {
            if (!candidateGroups[point.name]) {
              candidateGroups[point.name] = []
            }

            const date = new Date(point.timestamp * 1000)
            candidateGroups[point.name].push({
              timestamp: point.timestamp,
              date: date.toLocaleDateString(),
              votes: point.votes,
              name: point.name,
            })
          })

          // Convert to array format for recharts
          const timeSeriesData = []
          Object.keys(candidateGroups).forEach((name) => {
            candidateGroups[name].forEach((point) => {
              const existingPoint = timeSeriesData.find((p) => p.date === point.date)
              if (existingPoint) {
                existingPoint[name] = point.votes
              } else {
                const newPoint = { date: point.date }
                newPoint[name] = point.votes
                timeSeriesData.push(newPoint)
              }
            })
          })

          setHistoricalData(timeSeriesData)
        }

        setResults(items)
        setTotalVotes(total)
      } catch (error) {
        console.error("Error fetching results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [contract, campaignId, votingType])

  // Custom tooltip for recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{payload[0].name || label}</p>
          <p className="text-sm">
            Votes: <span className="font-medium">{formatNumber(payload[0].value)}</span>
          </p>
          {totalVotes > 0 && (
            <p className="text-xs text-muted-foreground">
              {Math.round((payload[0].value / totalVotes) * 100)}% of total
            </p>
          )}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return <p className="text-center py-8 text-muted-foreground">No results available yet.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {status === 2 ? "Final Results" : "Current Standing"}
          <span className="ml-2 text-sm font-normal text-muted-foreground">{formatNumber(totalVotes)} total votes</span>
        </h3>
        <ChartTabs value={activeChartType} onValueChange={setActiveChartType}>
          <ChartTabsList className="grid grid-cols-3 w-auto">
            <ChartTabsTrigger value="bar">Bar</ChartTabsTrigger>
            <ChartTabsTrigger value="pie">Pie</ChartTabsTrigger>
            <ChartTabsTrigger value="line">Trend</ChartTabsTrigger>
          </ChartTabsList>
        </ChartTabs>
      </div>

      <ChartTabs value={activeChartType} onValueChange={setActiveChartType}>
        <ChartTabsContent value="bar" className="mt-4">
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey={votingType === 0 ? "name" : "name"}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="votes" name="Votes">
                  {results.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartTabsContent>

        <ChartTabsContent value="pie" className="mt-4">
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={results}
                  dataKey="votes"
                  nameKey={votingType === 0 ? "name" : "name"}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  innerRadius="40%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {results.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartTabsContent>

        <ChartTabsContent value="line" className="mt-4">
          {historicalData.length > 0 ? (
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip />
                  <Legend />
                  {results.map((result, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={result.name}
                      stroke={getChartColor(index)}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-muted-foreground">Historical data not available</p>
              <p className="text-sm text-muted-foreground">Vote trend will appear as more votes are cast</p>
            </div>
          )}
        </ChartTabsContent>
      </ChartTabs>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold mb-2">Detailed Results</h3>
        {results.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={index === 0 && status === 2 ? "border-primary" : ""}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{votingType === 0 ? item.name : `Proposal ${item.id + 1}`}</h3>
                      {index === 0 && status === 2 && (
                        <Badge variant="default" className="bg-primary">
                          Winner
                        </Badge>
                      )}
                    </div>
                    {votingType === 0 && <p className="text-sm text-muted-foreground">{formatAddress(item.address)}</p>}
                    {votingType === 1 && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.content}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{formatNumber(item.votes)}</span>
                    <p className="text-sm text-muted-foreground">
                      {totalVotes > 0 ? Math.round((item.votes / totalVotes) * 100) : 0}%
                    </p>
                  </div>
                </div>
                <Progress
                  value={totalVotes > 0 ? (item.votes / totalVotes) * 100 : 0}
                  className="h-2"
                  indicatorClassName={`bg-[${getChartColor(index)}]`}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
