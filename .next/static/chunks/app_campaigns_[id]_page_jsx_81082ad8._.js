(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/app_campaigns_[id]_page_jsx_81082ad8._.js", {

"[project]/app/campaigns/[id]/page.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$contract$2d$context$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/contract-context.jsx [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './DetailsStep'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module './ConfigurationStep'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module './TimeFrameStep'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module './ProposalsStep'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module './StepNavigation'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module './CampaignTypeStep'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
const CampaignDetailPage = ()=>{
    _s();
    const { contract, address, isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$contract$2d$context$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContract"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const campaignIdParam = params?.id;
    const [campaignId, setCampaignId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [campaignInfo, setCampaignInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [proposals, setProposals] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [candidates, setCandidates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userHasVoted, setUserHasVoted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userIsRegistered, setUserIsRegistered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isOwner, setIsOwner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [actionLoading, setActionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [actionError, setActionError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [timeRemaining, setTimeRemaining] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [countdownTarget, setCountdownTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // --- Data Fetching ---
    const fetchCampaignData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CampaignDetailPage.useCallback[fetchCampaignData]": async ()=>{
            if (!contract || !campaignId) {
                setLoading(false);
                if (campaignIdParam && !campaignId) setError("Invalid Campaign ID format.");
                return;
            }
            setLoading(true);
            setError(null);
            setActionError("");
            console.log(`Fetching data for campaign ID: ${campaignId}`);
            try {
                // Fetch campaign basic info
                const [votingType, restriction, resultType, creator, description] = await contract.getCampaignBasicInfo(campaignId);
                // Fetch campaign time info
                const [status, startTime, endTime] = await contract.getCampaignTimeInfo(campaignId);
                // Fetch campaign stats
                const [totalVotes, itemCount, registeredVoterCount] = await contract.getCampaignStats(campaignId);
                // Combine fetched data into a single state object
                const combinedInfo = {
                    votingType: Number(votingType),
                    restriction: Number(restriction),
                    resultType: Number(resultType),
                    creator: creator,
                    description: description,
                    status: Number(status),
                    startTime: Number(startTime),
                    endTime: Number(endTime),
                    totalVotes: Number(totalVotes),
                    itemCount: Number(itemCount),
                    registeredVoterCount: Number(registeredVoterCount)
                };
                setCampaignInfo(combinedInfo);
                // Check if current user is the owner
                setIsOwner(address && address.toLowerCase() === creator.toLowerCase());
                // Set countdown target based on campaign phase
                const now = Math.floor(Date.now() / 1000);
                if (now < combinedInfo.startTime) {
                    setCountdownTarget(combinedInfo.startTime);
                } else if (now < combinedInfo.endTime) {
                    setCountdownTarget(combinedInfo.endTime);
                }
                console.log("Fetched Campaign Info:", combinedInfo);
                // Fetch proposals or candidates based on type
                if (combinedInfo.votingType === 1 /* ProposalBased */ ) {
                    // Get all proposals
                    const proposalContents = [];
                    const proposalVotes = [];
                    for(let i = 0; i < combinedInfo.itemCount; i++){
                        try {
                            const content = await contract.getProposalContent(campaignId, i);
                            const votes = await contract.getProposalVoteCount(campaignId, i);
                            proposalContents.push(content);
                            proposalVotes.push(Number(votes));
                        } catch (err) {
                            console.error(`Error fetching proposal ${i}:`, err);
                        }
                    }
                    const fetchedProposals = proposalContents.map({
                        "CampaignDetailPage.useCallback[fetchCampaignData].fetchedProposals": (content, index)=>({
                                id: index,
                                content: content,
                                voteCount: proposalVotes[index]
                            })
                    }["CampaignDetailPage.useCallback[fetchCampaignData].fetchedProposals"]);
                    setProposals(fetchedProposals);
                    setCandidates([]);
                    console.log("Fetched Proposals:", fetchedProposals);
                } else if (combinedInfo.votingType === 0 /* CandidateBased */ ) {
                    // Get all candidates
                    const fetchedCandidates = [];
                    for(let i = 0; i < combinedInfo.itemCount; i++){
                        try {
                            const [address, name, statement, imageHash, voteCount] = await contract.getCandidateInfo(campaignId, i);
                            fetchedCandidates.push({
                                id: i,
                                address: address,
                                name: name,
                                statement: statement,
                                imageHash: imageHash,
                                voteCount: Number(voteCount)
                            });
                        } catch (err) {
                            console.error(`Error fetching candidate ${i}:`, err);
                        }
                    }
                    setCandidates(fetchedCandidates);
                    setProposals([]);
                    console.log("Fetched Candidates:", fetchedCandidates);
                }
                // Fetch user-specific status if connected and not the owner
                if (address && !isOwner) {
                    const hasVoted = await contract.hasUserVoted(campaignId, address);
                    const isRegistered = await contract.isUserRegistered(campaignId, address);
                    setUserHasVoted(hasVoted);
                    setUserIsRegistered(isRegistered);
                    console.log(`User Status: Voted=${hasVoted}, Registered=${isRegistered}`);
                } else {
                    setUserHasVoted(false);
                    setUserIsRegistered(false);
                }
            } catch (err) {
                console.error("Error fetching campaign data:", err);
                // Attempt to decode Solidity revert reason
                let reason = "Failed to load campaign details.";
                if (err.reason) {
                    reason = err.reason;
                } else if (err.data?.message) {
                    reason = err.data.message;
                } else if (err.message) {
                    reason = err.message;
                }
                setError(reason.includes("Invalid campaign") ? "Campaign not found or ID is invalid." : reason);
                setCampaignInfo(null);
            } finally{
                setLoading(false);
            }
        }
    }["CampaignDetailPage.useCallback[fetchCampaignData]"], [
        contract,
        campaignId,
        address,
        campaignIdParam,
        isOwner
    ]);
    // --- Effect to parse ID and trigger fetch ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CampaignDetailPage.useEffect": ()=>{
            if (campaignIdParam) {
                try {
                    const idNumber = Number(campaignIdParam);
                    setCampaignId(idNumber);
                } catch (e) {
                    setError("Invalid Campaign ID in URL.");
                    setLoading(false);
                    setCampaignId(null);
                }
            } else {
                setLoading(false);
            }
        }
    }["CampaignDetailPage.useEffect"], [
        campaignIdParam
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CampaignDetailPage.useEffect": ()=>{
            // Fetch data when contract is ready and campaignId is set
            if (contract && campaignId) {
                fetchCampaignData();
            }
        }
    }["CampaignDetailPage.useEffect"], [
        contract,
        campaignId,
        fetchCampaignData
    ]);
    // Countdown timer effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CampaignDetailPage.useEffect": ()=>{
            if (!countdownTarget) return;
            const updateCountdown = {
                "CampaignDetailPage.useEffect.updateCountdown": ()=>{
                    const remaining = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTimeRemaining"])(countdownTarget);
                    setTimeRemaining(remaining);
                    // If countdown finished, refresh data
                    const now = Math.floor(Date.now() / 1000);
                    if (now >= countdownTarget) {
                        fetchCampaignData();
                    }
                }
            }["CampaignDetailPage.useEffect.updateCountdown"];
            updateCountdown();
            const interval = setInterval(updateCountdown, 1000);
            return ({
                "CampaignDetailPage.useEffect": ()=>clearInterval(interval)
            })["CampaignDetailPage.useEffect"];
        }
    }["CampaignDetailPage.useEffect"], [
        countdownTarget,
        fetchCampaignData
    ]);
    // --- Render Logic ---
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingState, {}, void 0, false, {
            fileName: "[project]/app/campaigns/[id]/page.jsx",
            lineNumber: 212,
            columnNumber: 12
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorState, {
            error: error
        }, void 0, false, {
            fileName: "[project]/app/campaigns/[id]/page.jsx",
            lineNumber: 216,
            columnNumber: 12
        }, this);
    }
    if (!campaignInfo) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NotFoundState, {}, void 0, false, {
            fileName: "[project]/app/campaigns/[id]/page.jsx",
            lineNumber: 220,
            columnNumber: 12
        }, this);
    }
    // Derived state for easier conditional rendering
    const now = Math.floor(Date.now() / 1000);
    const isBeforeStart = now < campaignInfo.startTime;
    const isDuringVoting = now >= campaignInfo.startTime && now <= campaignInfo.endTime;
    const isAfterEnd = now > campaignInfo.endTime;
    const needsRegistration = campaignInfo.restriction === 1 /* Limited */  || campaignInfo.restriction === 2 /* RequiredRegistration */ ;
    const canRegister = isBeforeStart && campaignInfo.status === 0 /* Created */ ;
    const canVote = isDuringVoting && campaignInfo.status === 1 /* Active */ ;
    const needsStatusUpdate = isDuringVoting && campaignInfo.status === 0 || isAfterEnd && campaignInfo.status === 1;
    /* Active */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container max-w-4xl mx-auto py-8 space-y-6 min-h-screen px-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CampaignHeader, {
                campaignInfo: campaignInfo,
                timeRemaining: timeRemaining,
                isBeforeStart: isBeforeStart,
                isDuringVoting: isDuringVoting,
                needsStatusUpdate: needsStatusUpdate,
                actionLoading: actionLoading,
                actionError: actionError,
                onUpdateStatus: fetchCampaignData,
                campaignId: campaignId,
                isOwner: isOwner
            }, void 0, false, {
                fileName: "[project]/app/campaigns/[id]/page.jsx",
                lineNumber: 238,
                columnNumber: 7
            }, this),
            isOwner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OwnerDashboard, {
                campaignInfo: campaignInfo,
                proposals: proposals,
                candidates: candidates,
                isBeforeStart: isBeforeStart,
                isDuringVoting: isDuringVoting,
                isAfterEnd: isAfterEnd,
                campaignId: campaignId,
                onUpdate: fetchCampaignData
            }, void 0, false, {
                fileName: "[project]/app/campaigns/[id]/page.jsx",
                lineNumber: 253,
                columnNumber: 9
            }, this),
            !isOwner && canRegister && needsRegistration && !userIsRegistered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RegistrationSection, {
                campaignInfo: campaignInfo,
                actionLoading: actionLoading,
                onRegister: fetchCampaignData,
                campaignId: campaignId
            }, void 0, false, {
                fileName: "[project]/app/campaigns/[id]/page.jsx",
                lineNumber: 267,
                columnNumber: 9
            }, this),
            !isOwner && canRegister && campaignInfo.votingType === 0 /* CandidateBased */  && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CandidateRegistration, {
                campaignInfo: campaignInfo,
                userIsRegistered: userIsRegistered,
                actionLoading: actionLoading,
                onRegister: fetchCampaignData,
                campaignId: campaignId
            }, void 0, false, {
                fileName: "[project]/app/campaigns/[id]/page.jsx",
                lineNumber: 277,
                columnNumber: 9
            }, this),
            !isOwner && canVote && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VotingSection, {
                campaignInfo: campaignInfo,
                proposals: proposals,
                candidates: candidates,
                isConnected: isConnected,
                userIsRegistered: userIsRegistered,
                userHasVoted: userHasVoted,
                needsRegistration: needsRegistration,
                actionLoading: actionLoading,
                address: address,
                onVote: fetchCampaignData,
                campaignId: campaignId
            }, void 0, false, {
                fileName: "[project]/app/campaigns/[id]/page.jsx",
                lineNumber: 288,
                columnNumber: 9
            }, this),
            (isAfterEnd || campaignInfo.status === 2) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultsSection, {
                campaignInfo: campaignInfo,
                proposals: proposals,
                candidates: candidates,
                isOwner: isOwner
            }, void 0, false, {
                fileName: "[project]/app/campaigns/[id]/page.jsx",
                lineNumber: 305,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/campaigns/[id]/page.jsx",
        lineNumber: 237,
        columnNumber: 5
    }, this);
};
_s(CampaignDetailPage, "uC5bSMiEaDcvVPKov7efBXDZviU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$contract$2d$context$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = CampaignDetailPage;
const __TURBOPACK__default__export__ = CampaignDetailPage;
var _c;
__turbopack_context__.k.register(_c, "CampaignDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_campaigns_%5Bid%5D_page_jsx_81082ad8._.js.map