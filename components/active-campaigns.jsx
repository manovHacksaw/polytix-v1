"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { formatDate, formatAddress } from "@/lib/utils";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { ArrowUpRight, RefreshCw, Info } from "lucide-react"; // Added Info icon
import { useCampaignsSubgraph } from "@/hooks/use-campaigns-subgraph";
import { useContract } from "@/context/contract-context";

export function ActiveCampaigns({ searchTerm = "", sortOrder = "latest", filterType = "all" }) {
  // Subgraph data hook
  const { campaigns: subgraphCampaigns, loading: subgraphLoading } = useCampaignsSubgraph(searchTerm, sortOrder, filterType);

  // Contract context hook
  const { isConnected, contract } = useContract();

  // State for fetched descriptions and their loading status
  const [campaignDescriptions, setCampaignDescriptions] = useState({});
  const [descriptionsLoading, setDescriptionsLoading] = useState(false);

  // Effect to fetch descriptions from the contract when connected
  useEffect(() => {
    const fetchDescriptions = async () => {
      if (!isConnected || !contract || subgraphLoading || subgraphCampaigns.length === 0 || descriptionsLoading) {
        if (!isConnected || !contract) {
          setCampaignDescriptions({});
        }
        return;
      }

      // console.log("Wallet connected, fetching descriptions from contract...");
      setDescriptionsLoading(true);
      const descriptionsMap = {};
      try {
        await Promise.all(
          subgraphCampaigns.map(async (campaign) => {
            try {
              const basicInfo = await contract.getCampaignBasicInfo(campaign.id);
              descriptionsMap[campaign.id] = basicInfo[4] || `Campaign #${campaign.id}`;
            } catch (error) {
              console.error(`Failed to fetch description for campaign ${campaign.id}:`, error);
              descriptionsMap[campaign.id] = `Campaign #${campaign.id}`;
            }
          })
        );
        setCampaignDescriptions(descriptionsMap);
        // console.log("Descriptions fetched:", descriptionsMap);
      } catch (globalError) {
        console.error("Error fetching campaign descriptions batch:", globalError);
      } finally {
        setDescriptionsLoading(false);
      }
    };
    fetchDescriptions();
  }, [isConnected, contract, subgraphCampaigns, subgraphLoading]);

  const getStatusBadge = (startTime, endTime) => {
    const now = Math.floor(Date.now() / 1000);
    if (now < startTime) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">Upcoming</Badge>;
    } else if (now < endTime) {
      return <Badge className="bg-green-600 hover:bg-green-700 text-white">Active</Badge>;
    } else {
      return <Badge variant="secondary">Ended</Badge>;
    }
  };

  const isLoading = subgraphLoading || (isConnected && descriptionsLoading && Object.keys(campaignDescriptions).length < subgraphCampaigns.length); // Adjust loading logic slightly

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (subgraphCampaigns.length === 0 && !subgraphLoading) {
    return (
      <>
        {/* Still show the info message if not connected, even if no campaigns */}
        {!isConnected && (
          <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
            <Info className="h-4 w-4 !text-blue-500" /> {/* Use ! to ensure color override */}
            <AlertTitle className="font-semibold">Data Source Information</AlertTitle>
            <AlertDescription>
              We use Subgraph by The Graph Protocol for faster loading. To view full campaign descriptions fetched directly from the blockchain, please connect your wallet. Otherwise, you may see default titles like 'Campaign #ID'.
            </AlertDescription>
          </Alert>
        )}
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
      </>
    );
  }

  // --- Main Render ---
  return (
    <>
      {/* Conditionally render the informational alert */}
      {!isConnected && (
        <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
          <Info className="h-4 w-4 !text-blue-500" /> {/* Use ! to ensure color override */}
          <AlertTitle className="font-semibold">Data Source Information</AlertTitle>
          <AlertDescription>
            We use Subgraph by The Graph Protocol for faster loading. To view full campaign descriptions fetched directly from the blockchain, please connect your wallet. Otherwise, you may see default titles like 'Campaign #ID'.
          </AlertDescription>
        </Alert>
      )}

      {/* Campaign Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subgraphCampaigns.map((campaign) => {
          const displayTitle = isConnected
            ? campaignDescriptions[campaign.id]
              ? campaignDescriptions[campaign.id]
              : descriptionsLoading
                ? <span className="inline-flex items-center"><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Loading...</span>
                : `Campaign #${campaign.id}`
            : `Campaign #${campaign.id}`;

          return (
            <Card
              key={campaign.id}
              className="group relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="line-clamp-2 text-lg flex-1 break-words">
                    {displayTitle}
                  </CardTitle>
                  <div className="flex-shrink-0">
                     {getStatusBadge(campaign.startTime, campaign.endTime)}
                  </div>
                </div>
                <CardDescription>
                  Created by: {formatAddress(campaign.creator)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Start: {formatDate(campaign.startTime * 1000)}</div>
                  <div>End: {formatDate(campaign.endTime * 1000)}</div>
                  <div className="pt-3 flex flex-wrap gap-2">
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
          );
        })}
      </div>
    </>
  );
}