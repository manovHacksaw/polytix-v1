"use client"

import { useState, useEffect } from "react"
import { ActiveCampaigns } from "@/components/active-campaigns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, CalendarClock, Filter, BarChart, Users, Bookmark, Clock, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useContract } from "@/context/contract-context"
import { useSubgraph } from "@/context/graphql/queries"

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("latest")
  const [filterType, setFilterType] = useState("all")
  const [view, setView] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isConnected } = useContract()
  const { events, refetchEvents, loading } = useSubgraph()
  
  // Campaign stats from subgraph data
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    ended: 0,
    total: 0
  })
  
  useEffect(() => {
    if (events?.campaignsCreated) {
      calculateStats();
    }
  }, [events]);

  const calculateStats = () => {
    if (!events?.campaignsCreated) return;

    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    
    // Get all unique campaign IDs
    const campaignIds = new Set(events.campaignsCreated.map(campaign => campaign.campaignId));
    const total = campaignIds.size;
    
    // Filter campaigns by status
    let active = 0;
    let upcoming = 0;
    let ended = 0;

    events.campaignsCreated.forEach(campaign => {
      const startTime = parseInt(campaign.startTime);
      const endTime = parseInt(campaign.endTime);
      
      if (now < startTime) {
        upcoming++;
      } else if (now > endTime) {
        ended++;
      } else {
        active++;
      }
    });

    // Also check for campaigns with changed status
    if (events.campaignStatusChanstatsged) {
      events.campaignStatusChanged.forEach(statusChange => {
        // Status 2 typically means ended or cancelled
        if (parseInt(statusChange.status) === 2) {
          // Decrease active count and increase ended count if this was an active campaign
          const campaign = events.campaignsCreated.find(c => c.campaignId === statusChange.campaignId);
          if (campaign) {
            const startTime = parseInt(campaign.startTime);
            const endTime = parseInt(campaign.endTime);
            if (now >= startTime && now <= endTime) {
              active--;
              ended++;
            }
          }
        }
      });
    }

    setStats({
      active,
      upcoming,
      ended,
      total
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetchEvents();
    // Set timeout to ensure spinner shows for a moment even if data loads quickly
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="flex justify-center mt-20 py-10 px-4 sm:px-6 md:px-8 w-full">
      <div className="w-full max-w-full px-12 ">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Voting Campaigns</h1>
          <p className="text-muted-foreground mt-2">Browse, create and participate in decentralized voting campaigns</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="flex items-center p-4">
              <div className="rounded-full p-2 bg-primary/10 mr-4">
                <BarChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="flex items-center p-4">
              <div className="rounded-full p-2 bg-green-500/10 mr-4">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="flex items-center p-4">
              <div className="rounded-full p-2 bg-blue-500/10 mr-4">
                <Bookmark className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.upcoming}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="flex items-center p-4">
              <div className="rounded-full p-2 bg-gray-500/10 mr-4">
                <Users className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ended</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.ended}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between bg-background/50 backdrop-blur-sm sticky top-0 z-10 border-b">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalendarClock className="h-6 w-6 text-primary" />
                Browse Campaigns
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Find campaigns to participate in or view past results
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    className={`${isRefreshing ? 'animate-spin' : ''}`}
                    disabled={loading && !isRefreshing}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh campaigns</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          
          <Tabs defaultValue="all" className="w-full" onValueChange={setView}>
            <div className="px-6 pt-4">
              <TabsList className="grid grid-cols-4 w-full mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="ended">Ended</TabsTrigger>
              </TabsList>
            </div>
          
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by creator, name, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 transition-all duration-300 hover:border-primary focus:border-primary focus-visible:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="h-10 transition-all duration-300 hover:bg-primary/10"
                      >
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        {sortOrder === "latest" ? "Latest First" : "Oldest First"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                        <DropdownMenuRadioItem value="latest">Latest First</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Advanced Filters</DropdownMenuLabel>
                      <DropdownMenuRadioGroup value={filterType} onValueChange={setFilterType}>
                        <DropdownMenuRadioItem value="all">All Types</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="candidate">Candidate-based</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="proposal">Proposal-based</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <TabsContent value="all">
                <ActiveCampaigns 
                  searchTerm={searchTerm} 
                  sortOrder={sortOrder} 
                  filterType={filterType === "all" ? "all" : "type"} 
                  filterValue={filterType}
                />
              </TabsContent>
              
              <TabsContent value="active">
                <ActiveCampaigns 
                  searchTerm={searchTerm} 
                  sortOrder={sortOrder} 
                  filterType="active" 
                  filterValue={filterType === "all" ? null : filterType}
                />
              </TabsContent>
              
              <TabsContent value="upcoming">
                <ActiveCampaigns 
                  searchTerm={searchTerm} 
                  sortOrder={sortOrder} 
                  filterType="upcoming" 
                  filterValue={filterType === "all" ? null : filterType}
                />
              </TabsContent>
              
              <TabsContent value="ended">
                <ActiveCampaigns 
                  searchTerm={searchTerm} 
                  sortOrder={sortOrder} 
                  filterType="ended" 
                  filterValue={filterType === "all" ? null : filterType}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}