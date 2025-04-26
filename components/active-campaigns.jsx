"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, formatAddress } from "@/lib/utils"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { ArrowUpRight } from "lucide-react"
import { useCampaignsSubgraph } from "@/hooks/use-campaigns-subgraph"

export function ActiveCampaigns({ searchTerm = "", sortOrder = "latest", filterType = "all" }) {
  const { campaigns, loading } = useCampaignsSubgraph(searchTerm, sortOrder, filterType);

  const getStatusBadge = (startTime, endTime) => {
    const now = Math.floor(Date.now() / 1000);
    if (now < startTime) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Upcoming</Badge>;
    } else if (now < endTime) {
      return <Badge className="bg-green-600">Active</Badge>;
    } else {
      return <Badge variant="secondary">Ended</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 bg-background/50 backdrop-blur-sm rounded-lg border">
        <h3 className="text-xl font-medium mb-4">
          {searchTerm ? "No campaigns found matching your search" : "No campaigns found"}
        </h3>
        <p className="text-muted-foreground mb-6">
          {searchTerm ? "Try adjusting your search terms" : "Be the first to create a voting campaign!"}
        </p>
        <Button asChild>
          <Link href="/create">Create Campaign</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <Card
          key={campaign.id}
          className="group relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-md transition-all duration-300"
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="line-clamp-1">{campaign.description}</CardTitle>
              {getStatusBadge(campaign.startTime, campaign.endTime)}
            </div>
            <CardDescription>
              Created by: {formatAddress(campaign.creator)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Start: {formatDate(campaign.startTime * 1000)}</div>
              <div>End: {formatDate(campaign.endTime * 1000)}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">
                  {campaign.votingType === 0 ? "Candidate-based" : "Proposal-based"}
                </Badge>
                <Badge variant="outline">
                  {campaign.restriction === 0 ? "Open" : campaign.restriction === 1 ? "Limited" : "Registration"}
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full group-hover:translate-y-0 transition-transform">
              <Link href={`/campaigns/${campaign.id}`} className="flex items-center justify-center">
                View Campaign
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}