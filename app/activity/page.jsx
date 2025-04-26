"use client"

import { useState, useEffect } from "react"
import { useSubgraph } from "@/context/graphql/queries" 
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Bell, Filter, RefreshCw, AlertCircle, Search, ChevronUp, ChevronDown, CalendarClock, AlertTriangle, Clock, User, Calendar, Vote, UserPlus, Flag, Trophy, ArrowUpDown, Loader2, Database } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatAddress } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import EmptyState from "./_components/empty-state"
import ActivityItem from "./_components/activity-item"

export default function ActivityPage() {
  const { events, getAllEvents, loading, refetchEvents } = useSubgraph()
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState("all") // "all" or "myActivity"
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("desc") // desc = newest first, asc = oldest first
  const [selectedTypes, setSelectedTypes] = useState([
    "campaignCreated",
    "campaignStatusChanged",
    "voteCast",
    "candidateAdded",
    "candidateRegistered",
    "voterRegistered",
    "transfer"
  ])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [limit, setLimit] = useState(50)

  // Define event type labels for UI
  const eventTypeLabels = {
    campaignCreated: "Campaign Created",
    campaignStatusChanged: "Campaign Status Changed",
    voteCast: "Vote Cast",
    candidateAdded: "Candidate Added",
    candidateRegistered: "Candidate Registered",
    voterRegistered: "Voter Registered",
    transfer: "NFT Transfer"
  }

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetchEvents()
    setIsRefreshing(false)
  }

  // Handle sort order change
  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
  }

  // Handle event type toggle
  const handleTypeToggle = (type) => {
    setSelectedTypes((current) => 
      current.includes(type) 
        ? current.filter(t => t !== type)
        : [...current, type]
    )
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedTypes([
      "campaignCreated",
      "campaignStatusChanged",
      "voteCast",
      "candidateAdded",
      "candidateRegistered",
      "voterRegistered",
      "transfer"
    ])
    setSearchQuery("")
  }

  // Load more events
  const loadMore = () => {
    setLimit(prev => prev + 50)
  }

  // Filter events based on active tab, search query, and selected types
  useEffect(() => {
    const allEvents = getAllEvents()
    
    // First filter by selected types
    let filtered = allEvents.filter(event => selectedTypes.includes(event.type))
    
    // Then filter by search query if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(event => {
        // Search in different fields based on event type
        if (event.campaignId && event.campaignId.toString().includes(query)) return true
        if (event.creator && event.creator.toLowerCase().includes(query)) return true
        if (event.voter && event.voter.toLowerCase().includes(query)) return true
        if (event.candidate && event.candidate.toLowerCase().includes(query)) return true
        if (event.candidateAddress && event.candidateAddress.toLowerCase().includes(query)) return true
        if (event.from && event.from.toLowerCase().includes(query)) return true
        if (event.to && event.to.toLowerCase().includes(query)) return true
        if (event.name && event.name.toLowerCase().includes(query)) return true
        return false
      })
    }
    
    // Then filter by tab category
    if (activeTab !== "all") {
      filtered = filtered.filter(event => {
        switch (activeTab) {
          case "campaigns":
            return ["campaignCreated", "campaignStatusChanged"].includes(event.type)
          case "votes":
            return event.type === "voteCast"
          case "registrations":
            return ["candidateRegistered", "voterRegistered"].includes(event.type)
          case "transfers":
            return event.type === "transfer"
          default:
            return true
        }
      })
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const timestampA = parseInt(a.blockTimestamp)
      const timestampB = parseInt(b.blockTimestamp)
      return sortOrder === "desc" ? timestampB - timestampA : timestampA - timestampB
    })
    
    // Limit the number of events to display
    setFilteredEvents(filtered.slice(0, limit))
  }, [getAllEvents, activeTab, searchQuery, selectedTypes, sortOrder, limit])

  const getActiveFiltersCount = () => {
    let count = 0
    if (searchQuery) count++
    if (selectedTypes.length < 7) count++
    if (sortOrder === "asc") count++
    return count
  }

  return (
    <div className="flex justify-center mt-20 py-10 px-4 sm:px-6 md:px-8 w-full">
      <div className="w-full max-w-8xl">
        <Card className="overflow-hidden border-0 shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between bg-background/50 backdrop-blur-sm sticky top-0 z-10 border-b">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalendarClock className="h-6 w-6 text-primary" />
                Activity Log <Badge variant="secondary" className="text-xs gap-1 flex items-center">
                  <Database className="h-3 w-3" />
                  Powered by The Graph
                </Badge>
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1 flex items-center gap-2">
                Track all blockchain transactions and activity in the platform
                
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={loading || isRefreshing}
                className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${(loading || isRefreshing) ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by campaign ID, address, or name..."
                  className="pl-10 h-10 transition-all duration-300 hover:border-primary focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleSortOrderChange} 
                  className={`h-10 w-10 transition-all duration-300 hover:bg-primary hover:text-primary-foreground ${sortOrder === "asc" ? "bg-muted/50" : ""}`}
                  aria-label="Toggle sort order"
                >
                  {sortOrder === "desc" ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`h-10 w-10 transition-all duration-300 hover:bg-primary hover:text-primary-foreground ${getActiveFiltersCount() > 0 ? "bg-muted/50" : ""}`}
                    >
                      <Filter className="h-4 w-4" />
                      {getActiveFiltersCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-4 h-4 flex items-center justify-center animate-in fade-in zoom-in duration-300">
                          {getActiveFiltersCount()}
                        </span>
                      )}
                      <span className="sr-only">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 text-sm font-medium">Filter Activity Types</div>
                    {Object.entries(eventTypeLabels).map(([key, label]) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        checked={selectedTypes.includes(key)}
                        onCheckedChange={() => handleTypeToggle(key)}
                        className="transition-colors duration-150"
                      >
                        {label}
                      </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                    <div className="px-3 py-2">
                      <Button variant="ghost" size="sm" className="w-full" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mb-6">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 w-full sm:w-auto mb-2">
                  <TabsTrigger value="all" className="rounded-md">All</TabsTrigger>
                  <TabsTrigger value="campaigns" className="rounded-md">Campaigns</TabsTrigger>
                  <TabsTrigger value="votes" className="rounded-md">Votes</TabsTrigger>
                  <TabsTrigger value="registrations" className="rounded-md">Registrations</TabsTrigger>
                  <TabsTrigger value="transfers" className="rounded-md">Transfers</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="flex items-center gap-1 bg-background animate-in fade-in duration-300">
                  <Clock className="h-3 w-3" />
                  <span>{sortOrder === "desc" ? "Newest first" : "Oldest first"}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 bg-background animate-in fade-in duration-300">
                  <CalendarClock className="h-3 w-3" />
                  <span>Showing {filteredEvents.length} events</span>
                </Badge>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-muted animate-in fade-in duration-300">
                    <Filter className="h-3 w-3" />
                    <span>{getActiveFiltersCount()} active {getActiveFiltersCount() === 1 ? 'filter' : 'filters'}</span>
                  </Badge>
                )}
              </div>
              {(searchQuery || selectedTypes.length < 7 || sortOrder === "asc") && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs h-7 self-end sm:self-auto">
                  Reset all filters
                </Button>
              )}
            </div>

            {/* Activity List */}
            {loading && filteredEvents.length === 0 ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="overflow-hidden border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-1">
                        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-3/4" />
                          <div className="flex justify-between mt-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-16" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="animate-in fade-in duration-300">
                <EmptyState type={activeTab} />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event, index) => (
                  <div 
                    key={event.id} 
                    className="animate-in fade-in slide-in-from-bottom-3 duration-300 " 
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <ActivityItem event={event} />
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredEvents.length > 0 && filteredEvents.length % 50 === 0 && (
              <div className="flex justify-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={loadMore} 
                  className="w-full sm:w-auto border-dashed hover:border-solid transition-all duration-300"
                  disabled={loading || isRefreshing}
                >
                  {loading || isRefreshing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>Load More</>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}