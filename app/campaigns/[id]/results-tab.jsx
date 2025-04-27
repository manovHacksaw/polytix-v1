"use client";

import React, { useState } from 'react';
// Added Image and Users icons
import { List, Trophy, AlertCircle, Clock, Users } from 'lucide-react';
import Image from 'next/image'; // Import Next.js Image component
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
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Assuming resolveIpfsUrl is in your utils
import { formatAddress, resolveIpfsUrl } from '@/lib/utils';

// Helper function for text truncation
const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// --- Enhanced Color Palette with 10 unique colors ---
const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#8b5cf6', // violet-500
  '#6366f1', // indigo-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#14b8a6', // teal-500
  '#ef4444', // red-500
];

const ResultsTab = ({
  campaignInfo,
  proposals = [],
  candidates = [],
  isOwner = false,
  isDuringVoting = false,
  isAfterEnd = false 
}) => {
  const [activeIndex, setActiveIndex] = useState(null); // For Pie chart hover
  const [hoveredBar, setHoveredBar] = useState(null);   // For Bar chart hover

  // --- Data Preparation ---
  const safeProposals = Array.isArray(proposals) ? proposals : [];
  const safeCandidates = Array.isArray(candidates) ? candidates : [];

  // Sort data for ranked display
  const sortedProposals = [...safeProposals].sort((a, b) => (b.voteCount ?? 0) - (a.voteCount ?? 0));
  const sortedCandidates = [...safeCandidates].sort((a, b) => (b.voteCount ?? 0) - (a.voteCount ?? 0));

  // --- Winner Status Calculation ---
  const getWinnerStatus = () => {
    if (!campaignInfo) return { hasTie: false, hasWinner: false, tiedWinners: [] };
    const items = campaignInfo.votingType === 1 ? sortedProposals : sortedCandidates;
    if (items.length === 0) return { hasTie: false, hasWinner: false, tiedWinners: [] };

    const highestVotes = items[0]?.voteCount || 0;
    const validItems = items.filter(item => typeof item.voteCount === 'number');
    const tiedWinners = validItems.filter(item => item.voteCount === highestVotes);

    return {
      hasTie: highestVotes > 0 && tiedWinners.length > 1,
      hasWinner: highestVotes > 0,
      tiedWinners,
    };
  };
  const winnerStatus = getWinnerStatus();

  // --- Chart Data Preparation ---
  const prepareChartData = () => {
    const totalVotes = campaignInfo?.totalVotes || 0;
    const items = campaignInfo?.votingType === 1 ? sortedProposals : sortedCandidates;

    return items.map((item, idx) => {
      const votes = item.voteCount ?? 0;
      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
      const isCandidateType = campaignInfo?.votingType === 0;

      return {
        id: item.id || `${isCandidateType ? 'candidate' : 'proposal'}-${idx}`, // Robust unique ID
        name: isCandidateType ? item.name : truncateText(item.content, 30),
        fullContent: isCandidateType ? item.name : item.content,
        votes: votes,
        percentage: percentage.toFixed(1),
        color: CHART_COLORS[idx % CHART_COLORS.length],
        // Include imageHash ONLY for candidates
        imageHash: isCandidateType ? (item.imageHash || "no-image") : undefined,
      };
    });
  };
  const chartData = prepareChartData();

  // --- Custom Tooltip Components ---
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const content = data.fullContent || data.name;
      return (
        <div className="bg-background shadow-lg rounded-md p-3 border border-border text-sm max-w-xs">
          <p className="font-medium mb-1 break-words">{truncateText(content, 100)}</p>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
            <span className="text-muted-foreground">Votes:</span>
            <span className="font-medium text-primary">{payload[0].value}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Percentage:</span>
            <span className="font-medium">{data.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const content = data.fullContent || data.name;
      return (
        <div className="bg-background shadow-lg rounded-md p-3 border border-border text-sm max-w-xs">
          <p className="font-medium mb-1 break-words">{truncateText(content, 100)}</p>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
            <span className="text-muted-foreground">Votes:</span>
            <span className="font-medium">{data.votes}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Percentage:</span>
            <span className="font-medium">{data.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis tick with white text
  const renderCustomYAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
      <text x={x} y={y} dy={3} textAnchor="end" fill="#ffffff" fontSize={10}>
        {payload.value}
      </text>
    );
  };

  // --- Event Handlers ---
  const handlePieEnter = (_, index) => setActiveIndex(index);
  const handlePieLeave = () => setActiveIndex(null);
  const handleBarEnter = (data, index) => setHoveredBar(index);
  const handleBarLeave = () => setHoveredBar(null);

  // --- Custom Legend Components ---
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs mt-4">
        {payload.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-1.5 transition-opacity duration-200 cursor-default"
            style={{ opacity: activeIndex === null || activeIndex === index ? 1 : 0.6 }}
            onMouseEnter={() => handlePieEnter(null, index)}
            onMouseLeave={handlePieLeave}
          >
            <div style={{ backgroundColor: entry.color }} className="w-3 h-3 rounded-full flex-shrink-0" />
            <span className="text-foreground">{truncateText(entry.value, 20)}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderBarLegend = (props) => {
    const { payload, campaignInfo } = props;
    if (!payload || payload.length === 0 || !campaignInfo) return null;

    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs mt-4">
        {payload.map((entry, index) => (
          <div
            key={`legend-bar-${index}`}
            className="flex items-center gap-1.5 transition-opacity duration-200 cursor-default"
            style={{ opacity: hoveredBar === null || hoveredBar === index ? 1 : 0.6 }}
            onMouseEnter={() => handleBarEnter(null, index)}
            onMouseLeave={handleBarLeave}
          >
            {/* Conditionally render image for candidates */}
            {campaignInfo.votingType === 0 && entry.imageHash && entry.imageHash !== 'no-image' ? (
              <Image
                src={resolveIpfsUrl(entry.imageHash) || "/placeholder.svg"}
                width={16}
                height={16}
                alt={entry.name}
                className="w-4 h-4 rounded-full object-cover mr-0.5 flex-shrink-0"
                unoptimized
              />
            ) : (
              <div style={{ backgroundColor: entry.color }} className="w-3 h-3 rounded-sm flex-shrink-0" />
            )}
            <span className="text-foreground">{truncateText(entry.name, 25)}</span>
            <span className="text-xs font-medium text-muted-foreground ml-1">({entry.percentage}%)</span>
          </div>
        ))}
      </div>
    );
  };
  // ---------------------------------------

  // --- Loading State ---
  if (!campaignInfo) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <div className="animate-spin h-12 w-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full"></div>
        <p>Loading campaign information...</p>
      </div>
    );
  }

  // --- No Votes State ---
  if ((campaignInfo.totalVotes ?? 0) === 0) {
    return (
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>Status of the vote count.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-medium mb-2">No Votes Yet</h3>
          <p className="text-muted-foreground">Results will appear here once votes are cast.</p>
        </CardContent>
      </Card>
    );
  }

  // Determine items for detailed list
  const items = campaignInfo.votingType === 1 ? sortedProposals : sortedCandidates;

  return (
    <div className="space-y-10">

      {/* Conditional "Live Results" Alert */}
      {isDuringVoting && (
        <Alert className="border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
          <Clock className="h-4 w-4 !text-blue-500" />
          <AlertTitle className="font-semibold">Live Results</AlertTitle>
          <AlertDescription>
            These results update periodically and may change. Final results are determined after the campaign ends.
          </AlertDescription>
        </Alert>
      )}

      {/* Header & Summary Section */}
      <Card className="rounded-xl shadow-md overflow-hidden">
        <CardHeader className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            {campaignInfo.resultType === 0 ? (
              <><List className="h-5 w-5 text-primary" /><h2 className="text-xl font-semibold">Rank-Based Results</h2></>
            ) : (
              <><Trophy className="h-5 w-5 text-amber-500" /><h2 className="text-xl font-semibold">Winner-Based Results</h2></>
            )}
          </div>
          <CardDescription>
            {campaignInfo.resultType === 0
              ? "Showing all options ranked by number of votes received."
              : "Highlighting the winning option(s) based on total votes."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Winner/Tie info */}
          {campaignInfo.resultType === 1 && (
            <div className="mb-6">
              {winnerStatus.hasWinner ? (
                winnerStatus.hasTie ? (
                  <Alert variant="warning" className="border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200">
                    <Trophy className="h-4 w-4" />
                    <AlertTitle>Tie Detected!</AlertTitle>
                    <AlertDescription className="text-amber-800 dark:text-amber-300">
                      Tie between {winnerStatus.tiedWinners.length} options ({winnerStatus.tiedWinners[0]?.voteCount ?? 0} votes each).
                      <ul className="list-disc pl-5 mt-2 text-xs">
                        {winnerStatus.tiedWinners.slice(0, 3).map((item, idx) => (
                          <li key={`tied-${item.id || idx}`}>{item.name || truncateText(item.content, 40)}</li>
                        ))}
                        {winnerStatus.tiedWinners.length > 3 && <li>... and more</li>}
                      </ul>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-200">
                    <Trophy className="h-4 w-4" />
                    <AlertTitle>{isDuringVoting ? "Currently Leading!" : "Winner Declared!"}</AlertTitle>
                    <AlertDescription className="text-green-800 dark:text-green-300">
                      {campaignInfo.votingType === 1 ? `"${truncateText(sortedProposals[0].content, 60)}"` : `"${sortedCandidates[0].name}"`}{" "}
                      {isDuringVoting ? "is currently leading" : "won"} with {sortedProposals[0]?.voteCount ?? sortedCandidates[0]?.voteCount ?? 0} votes.
                    </AlertDescription>
                  </Alert>
                )
              ) : (
                 <Alert className="border-border bg-muted/50">
                   <AlertCircle className="h-4 w-4" />
                   <AlertTitle>Results Pending</AlertTitle>
                   <AlertDescription>No clear winner yet based on current votes.</AlertDescription>
                 </Alert>
              )}
            </div>
          )}
           {/* Summary Stats */}
           <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Votes</p>
                <p className="text-2xl font-semibold mt-1">{campaignInfo.totalVotes ?? 0}</p>
              </div>
              {/* Show Registered only if applicable */}
              {campaignInfo.restriction !== 0 && (
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Registered</p>
                  <p className="text-2xl font-semibold mt-1">{campaignInfo.registeredVoterCount ?? 0}</p>
                </div>
              )}
              {/* Optional: Participation Rate (only if registered count > 0) */}
              {campaignInfo.restriction !== 0 && (campaignInfo.registeredVoterCount ?? 0) > 0 && (
                 <div className="p-4 bg-muted/50 rounded-lg border col-span-2 sm:col-span-1">
                     <p className="text-xs text-muted-foreground uppercase tracking-wider">Participation Rate</p>
                     <p className="text-2xl font-semibold mt-1">
                       {Math.round(((campaignInfo.totalVotes ?? 0) / (campaignInfo.registeredVoterCount || 1)) * 100)}%
                     </p>
                 </div>
              )}
            </div>
        </CardContent>
      </Card>


      {/* Detailed Results Section */}
      <Card className="rounded-xl shadow-md overflow-hidden">
        <CardHeader className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Detailed Breakdown</h3>
          <CardDescription>All options ranked by number of votes</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Scrollable list */}
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 -mr-2 custom-scrollbar">
             {items.length > 0 ? items.map((item, index) => {
              // Generate truly unique keys
              const uniqueKey = campaignInfo.votingType === 1
                ? `proposal-${item.id || index}-${item.content?.substring(0, 10)}`
                : `candidate-${item.id || index}-${item.name?.substring(0, 10)}`;
              const itemColor = CHART_COLORS[index % CHART_COLORS.length];
              const votes = item.voteCount ?? 0;
              const percentage = campaignInfo.totalVotes > 0 ? (votes / campaignInfo.totalVotes * 100) : 0;
              const isCandidateType = campaignInfo.votingType === 0;

              return (
                <div key={uniqueKey} className="p-5 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-grow min-w-0">
                      <Badge variant="secondary" className="flex-shrink-0 font-bold text-xs" style={{ backgroundColor: `${itemColor}20`, color: itemColor, borderColor: `${itemColor}40` }}>{index + 1}</Badge>
                      
                      {/* Show Trophy Icon for Winner/Leader */}
                      {campaignInfo.resultType === 1 && index === 0 && winnerStatus.hasWinner && !winnerStatus.hasTie && votes > 0 && (
                        <Trophy className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      )}
                      
                      {/* Show Candidate Image if Available */}
                      {/* {isCandidateType && item.imageHash && item.imageHash !== 'no-image' && (
                        <Image
                          src={resolveIpfsUrl(item.imageHash) || "/placeholder.svg"}
                          width={32}
                          height={32}
                          alt={item.name || `Candidate ${index + 1}`}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-border"
                          unoptimized
                        />
                      )} */}
                      
                      <h4 className="font-medium text-sm text-foreground break-words flex-grow">{campaignInfo.votingType === 1 ? item.content : item.name}</h4>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0 whitespace-nowrap text-xs">{votes} votes</Badge>
                  </div>
                  {campaignInfo.votingType === 0 && item.address && (<p className="text-xs text-muted-foreground font-mono mb-3 ml-10">{formatAddress(item.address)}</p>)}
                  <div className="pl-10">
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-1.5">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: itemColor }}></div>
                    </div>
                    <p className="text-xs text-right text-muted-foreground">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            }) : (
                <p className="text-center text-muted-foreground py-4">No results data available.</p>
            )}
          </div>
        </CardContent>
      </Card>


      {/* Visualizations Section */}
      <Card className="rounded-xl shadow-md overflow-hidden">
        <CardHeader className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Visualizations</h3>
          <CardDescription>Graphical representation of results</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Changed to column layout for charts */}
          <div className="grid grid-cols-1 gap-6">

            {/* Bar Chart */}
            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
              <h4 className="font-medium mb-4 text-center text-sm">Vote Distribution</h4>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData} 
                    margin={{ top: 5, right: 5, left: -15, bottom: 5 }} 
                    barCategoryGap="25%" 
                    onMouseMove={(state) => { if (state.isTooltipActive) setHoveredBar(state.activeTooltipIndex); }} 
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.6} />
                    <XAxis dataKey="name" hide />
                    {/* Custom Y-axis with white text */}
                    <YAxis 
                      fontSize={10} 
                      axisLine={false} 
                      tickLine={false} 
                      width={35} 
                      tick={renderCustomYAxisTick} 
                    />
                    <RechartsTooltip 
                      content={<CustomBarTooltip />} 
                      cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.5 }} 
                      wrapperStyle={{ zIndex: 10 }}
                    />
                    <Bar 
                      dataKey="votes" 
                      radius={[4, 4, 0, 0]} 
                      animationDuration={800} 
                      isAnimationActive={true}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`bar-cell-${index}`} 
                          fill={entry.color} 
                          className="transition-opacity duration-200" 
                          fillOpacity={hoveredBar === null || hoveredBar === index ? 1 : 0.6} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {renderBarLegend({ payload: chartData, campaignInfo })}
            </div>

            {/* Pie Chart */}
            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
              <h4 className="font-medium mb-4 text-center text-sm">Percentage Breakdown</h4>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" paddingAngle={chartData.length > 1 ? 2 : 0} dataKey="votes" nameKey="name" onMouseEnter={handlePieEnter} onMouseLeave={handlePieLeave} animationDuration={1000} isAnimationActive={true}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`pie-cell-${index}`} 
                          fill={entry.color} 
                          stroke={'var(--card)'} 
                          strokeWidth={1} 
                          className="cursor-pointer transition-opacity duration-200 outline-none focus:outline-none" 
                          opacity={activeIndex === null || activeIndex === index ? 1 : 0.7} 
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip />} wrapperStyle={{ zIndex: 10 }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                {renderLegend({ payload: chartData.map((entry) => ({ value: entry.name, color: entry.color })) })}
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsTab;