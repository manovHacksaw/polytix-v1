"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/101223/polytix/0.0.5',
  cache: new InMemoryCache(),
});

const SubgraphContext = createContext(null);

export const SubgraphProvider = ({ children }) => {
  const [events, setEvents] = useState({
    campaignsCreated: [],
    voteCast: [],
    candidateAdded: [],
    candidateRegistered: [],
    voterRegistered: [],
    transfers: [],
    campaignStatusChanged: [],
    // Add other event types as needed
  });
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: gql`
          {
            notificationCreateds(first: 10) {
    notificationType
    blockNumber
    blockTimestamp
    id
    campaignId
  }
        `
      });

      console.log("NOTIFIFICATIONS", data.notificationCreateds);
      
      setEvents({
        campaignsCreated: data.campaignCreateds || [],
        voteCast: data.voteCasts || [],
        candidateAdded: data.candidateAddeds || [],
        candidateRegistered: data.candidateRegistereds || [],
        voterRegistered: data.voterRegistereds || [],
        transfers: data.transfers || [],
        campaignStatusChanged: data.campaignStatusChangeds || [],
      });
    } catch (error) {
      console.error("Error fetching events from subgraph:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper method to get all events combined and sorted by timestamp
  const getAllEvents = () => {
    const allEvents = [
      ...events.campaignsCreated.map(event => ({ ...event, type: 'campaignCreated' })),
      ...events.voteCast.map(event => ({ ...event, type: 'voteCast' })),
      ...events.candidateRegistered.map(event => ({ ...event, type: 'candidateRegistered' })), 
      ...events.candidateAdded.map(event => ({ ...event, type: 'candidateAdded' })),
      ...events.voterRegistered.map(event => ({ ...event, type: 'voterRegistered' })),
      ...events.transfers.map(event => ({ ...event, type: 'transfer' })),
      ...events.campaignStatusChanged.map(event => ({ ...event, type: 'campaignStatusChanged' })),
    ];

    // Sort by blockTimestamp (newest first)
    return allEvents.sort((a, b) => b.blockTimestamp - a.blockTimestamp);
  };

  // Function to refetch events data
  const refetchEvents = () => {
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <SubgraphContext.Provider value={{ 
      events, 
      getAllEvents, 
      loading, 
      refetchEvents 
    }}>
      {children}
    </SubgraphContext.Provider>
  );
};

export const useSubgraph = () => useContext(SubgraphContext);