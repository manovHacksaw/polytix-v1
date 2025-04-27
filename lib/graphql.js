// graphqlClient.js (or your chosen filename)
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Keep your client setup
const graphQLClient = new ApolloClient({
  uri: ' https://api.studio.thegraph.com/query/101223/polytix-final/0.0.65', // Ensure this is correct
  cache: new InMemoryCache(),
  // Optional: Add default options to disable caching if needed for frequent updates,
  // though usually the cache is beneficial.
  // defaultOptions: {
  //   watchQuery: { fetchPolicy: 'network-only' },
  //   query: { fetchPolicy: 'network-only' },
  // }
});

// Query to fetch all campaigns (Keep your query as is)
// Added blockTimestamp for potential debugging or alternative sorting
export const FETCH_CAMPAIGNS = gql`
  query FetchCampaigns {
    campaignCreateds(orderBy: startTime, orderDirection: desc, first: 100) { # Fetch more?
      id # The Graph entity ID (e.g., transaction hash + log index)
      campaignId # Your contract's campaign ID
      creator
      votingType
      restriction
      startTime
      endTime
      blockTimestamp
      # --- Fields potentially derived/linked in the subgraph ---
      # Assuming 'campaign' is a separate entity linked via campaignId
      # Ensure your subgraph schema and mappings support this structure.
      # If these fields are directly on CampaignCreated event, adjust accordingly.
      campaign {
        id # ID of the Campaign entity
        description
        status # Current status stored in the subgraph
        resultType
        totalVotes
        registeredVoterCount
      }
      # --- End Derived/Linked Fields ---
    }
  }
`;

// Query to fetch a single campaign by ID (Keep your query as is)
export const FETCH_CAMPAIGN_BY_ID = gql`
  query FetchCampaignById($campaignId: BigInt!) { # Use BigInt if campaignId is uint256
    # Query the Campaign entity directly if it holds all needed info
    campaigns(where: { campaignId: $campaignId }) {
       id # Campaign entity ID
       campaignId
       creator # May need to get this from CampaignCreated event if not on Campaign
       description
       votingType # May need to get this from CampaignCreated event
       restriction # May need to get this from CampaignCreated event
       startTime
       endTime
       status
       resultType
       totalVotes
       registeredVoterCount
       # Add other fields directly accessible on the Campaign entity
     }

    # --- OR --- Query via CampaignCreated if 'campaign' field links aren't set up
    # campaignCreateds(where: { campaignId: $campaignId }, first: 1) {
    #   id
    #   campaignId
    #   creator
    #   votingType
    #   restriction
    #   startTime
    #   endTime
    #   campaign { # If using the linked entity approach
    #     description
    #     status
    #     resultType
    #     totalVotes
    #     registeredVoterCount
    #   }
    # }
  }
`;

// Helper function to format campaign data (Keep as is, but ensure field names match query)
// Note: Parses strings to numbers. Ensure subgraph returns compatible types.
function formatCampaignData(graphData) {
  // Adjust access based on which query structure you use (direct Campaign vs CampaignCreated)
  // This example assumes querying CampaignCreated with a nested 'campaign' field
  const campaignDetails = graphData.campaign || {}; // Handle cases where campaign might be null

  return {
    // Use the contract's campaignId as the primary ID for routing/keys
    id: graphData.campaignId ? Number(graphData.campaignId) : null,
    graphId: graphData.id, // Keep the graph entity ID if needed
    description: campaignDetails.description || "No description available", // Fallback
    creator: graphData.creator, // Assuming creator is on CampaignCreated
    startTime: graphData.startTime ? Number(graphData.startTime) : 0,
    endTime: graphData.endTime ? Number(graphData.endTime) : 0,
    // Use status from subgraph if available and reliable, otherwise calculate in component
    status: campaignDetails.status !== undefined ? Number(campaignDetails.status) : null,
    restriction: graphData.restriction !== undefined ? Number(graphData.restriction) : null,
    resultType: campaignDetails.resultType !== undefined ? Number(campaignDetails.resultType) : null,
    votingType: graphData.votingType !== undefined ? Number(graphData.votingType) : null,
    totalVotes: campaignDetails.totalVotes ? Number(campaignDetails.totalVotes) : 0,
    registeredVoterCount: campaignDetails.registeredVoterCount ? Number(campaignDetails.registeredVoterCount) : 0,
    blockTimestamp: graphData.blockTimestamp ? Number(graphData.blockTimestamp) : 0,
  };
}


// Function to fetch all campaigns using Apollo Client
export async function fetchAllCampaigns() {
  try {
    // Use graphQLClient.query
    const result = await graphQLClient.query({
      query: FETCH_CAMPAIGNS,
      fetchPolicy: "network-only", // Or 'cache-first', 'no-cache' depending on needs
    });

    if (result.error) {
      throw result.error;
    }

    // Access data via result.data
    const campaigns = result.data?.campaignCreateds || [];
    return campaigns.map(formatCampaignData).filter(c => c.id !== null); // Ensure ID is valid
  } catch (error) {
    console.error("Error fetching campaigns from subgraph:", error);
    // Consider throwing the error or returning a specific error object
    // instead of just an empty array to allow better error handling upstream.
    // throw error;
    return []; // Keep returning empty array for simplicity here
  }
}

// Function to fetch a campaign by ID using Apollo Client
export async function fetchCampaignDetailsById(id) {
  // Ensure id is in the correct format (string or number based on BigInt usage)
  const campaignId = String(id); // TheGraph often expects BigInts as strings in variables

  try {
    const result = await graphQLClient.query({
      query: FETCH_CAMPAIGN_BY_ID,
      variables: { campaignId }, // Pass variable correctly
      fetchPolicy: "network-only", // Fetch fresh data for single item view
    });

    if (result.error) {
        throw result.error;
    }

    // Adjust based on which query you ended up using (campaigns or campaignCreateds)
    const campaignData = result.data?.campaigns?.[0] || result.data?.campaignCreateds?.[0]; // Check both possibilities

    if (campaignData) {
      // You might need a different formatter if querying 'campaigns' directly
      return formatCampaignData(campaignData); // Reuse formatter if structure is similar enough
    }
    return null; // Not found
  } catch (error) {
    console.error(`Error fetching campaign ${id} from subgraph:`, error);
    // throw error;
    return null;
  }
}