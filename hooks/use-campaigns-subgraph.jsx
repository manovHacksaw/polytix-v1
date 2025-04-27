"use client"
import { useState, useEffect } from 'react';
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

export function useCampaignsSubgraph(searchTerm = "", sortOrder = "latest", filterType = "all") {
  const client = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/101223/polytix-final/version/latest',
    cache: new InMemoryCache(),
  });
  
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if data exists in your subgraph by querying CampaignCreated events first
  const FETCH_CAMPAIGN_DATA = gql`
    query FetchCampaignData {
      campaignCreateds(orderBy: blockTimestamp, orderDirection: desc) {
        id
        campaignId
        creator
        votingType
        restriction
        startTime
        endTime
        blockTimestamp
      }
      campaignStatusChangeds(orderBy: blockTimestamp, orderDirection: desc) {
        campaignId
        status
      }
    }
  `;

  // Fetch campaigns from subgraph
  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true);
      try {
        const { data } = await client.query({
          query: FETCH_CAMPAIGN_DATA,
          fetchPolicy: 'network-only' // Don't use cache for this query
        });
        
        console.log("Subgraph data:", data);
        
        // Process the campaigns from campaignCreateds events
        const campaignCreatedEvents = data.campaignCreateds || [];
        const statusChangedEvents = data.campaignStatusChangeds || [];
        
        // Create a map of campaign IDs to their latest status
        const campaignStatusMap = {};
        statusChangedEvents.forEach(event => {
          const campaignId = event.campaignId.toString();
          // Only store if this is a newer status update or if we don't have one yet
          if (!campaignStatusMap[campaignId]) {
            campaignStatusMap[campaignId] = parseInt(event.status);
          }
        });
        
        // Process campaign data from events
        const processedCampaigns = campaignCreatedEvents.map(campaign => {
          const campaignId = campaign.campaignId.toString();
          return {
            id: parseInt(campaignId),
            // Use a placeholder description since we might not have this field yet
            description: `Campaign #${campaignId}`,
            creator: campaign.creator,
            startTime: parseInt(campaign.startTime),
            endTime: parseInt(campaign.endTime),
            // Use status from map or default to 0
            status: campaignStatusMap[campaignId] || 0,
            restriction: parseInt(campaign.restriction),
            resultType: 0, // Default value as it might not be in your events
            votingType: parseInt(campaign.votingType),
            createdAt: parseInt(campaign.blockTimestamp)
          };
        });
        
        setCampaigns(processedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns from subgraph:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCampaigns();
  }, []);

  // Filter and sort campaigns when dependencies change
  useEffect(() => {
    let filtered = [...campaigns];
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(campaign =>
        campaign.description.toLowerCase().includes(query) ||
        campaign.creator.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    const now = Math.floor(Date.now() / 1000);
    filtered = filtered.filter(campaign => {
      switch (filterType) {
        case "active":
          return now >= campaign.startTime && now <= campaign.endTime;
        case "upcoming":
          return now < campaign.startTime;
        case "ended":
          return now > campaign.endTime;
        default:
          return true;
      }
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
      return sortOrder === "latest"
        ? b.startTime - a.startTime
        : a.startTime - b.startTime;
    });
    
    setFilteredCampaigns(filtered);
  }, [searchTerm, sortOrder, filterType, campaigns]);

  return {
    campaigns: filteredCampaigns,
    loading,
    refetch: async () => {
      setLoading(true);
      try {
        await client.refetchQueries({
          include: [FETCH_CAMPAIGN_DATA],
        });
      } finally {
        setLoading(false);
      }
    }
  };
}