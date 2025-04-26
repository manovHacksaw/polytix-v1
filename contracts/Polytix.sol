// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title Polytix
 * @dev A decentralized voting platform that supports both candidate-based and proposal-based voting campaigns.
 * Features include:
 * - NFT-based voting rights
 * - Multiple voting types (candidate/proposal based)
 * - Configurable voting restrictions
 * - Registration system
 * - Vote tracking and result calculation
 * @author Original Author
 */
contract Polytix is ReentrancyGuard, Pausable, ERC721Enumerable {
    using Strings for uint256;

    // Constants for input validation
    uint256 private constant MAX_DESCRIPTION_LENGTH = 100;
    uint256 private constant MAX_STATEMENT_LENGTH = 500;
    uint256 private constant MAX_NAME_LENGTH = 50;
    uint256 private constant MAX_PROPOSAL_LENGTH = 1000;

    /**
     * @dev Defines the type of voting campaign
     */
    enum VotingType { 
        CandidateBased,  // Voting for specific candidates
        ProposalBased    // Voting for specific proposals
    }

    /**
     * @dev Defines the voting restrictions for a campaign
     */
    enum VotingRestriction { 
        OpenToAll,           // Anyone can vote
        Limited,             // Limited number of voters
        RequiredRegistration // Must register to vote
    }

    /**
     * @dev Defines how results are calculated
     */
    enum ResultType { 
        RankBased,  // Multiple winners ranked by votes
        OneWinner   // Single winner with most votes
    }

    /**
     * @dev Current status of a campaign
     */
    enum CampaignStatus { 
        Created,  // Campaign is created but not started
        Active,   // Voting is active
        Ended     // Voting has ended
    }

    /**
     * @dev Type of registration in a campaign
     */
    enum RegistrationType { 
        Voter,     // Registered as a voter
        Candidate  // Registered as a candidate
    }

    /**
     * @dev Timeframe structure for campaign duration
     */
    struct TimeFrame {
        uint256 startTime;
        uint256 endTime;
    }

    /**
     * @dev Structure for proposal information
     */
    struct Proposal {
        string content;
        uint256 voteCount;
        uint256 lastVoteTimestamp;
    }

    /**
     * @dev Structure for candidate information
     */
    struct Candidate {
        address candidateAddress;
        string name;
        string statement;
        string imageHash;
        uint256 voteCount;
        uint256 lastVoteTimestamp;
    }

    /**
     * @dev Structure for campaign metadata
     */
    struct CampaignMetadata {
        VotingType votingType;
        VotingRestriction restriction;
        ResultType resultType;
        address creator;
        string description;
        TimeFrame timeFrame;
        uint256 maxVoters;
        bytes32 passKeyHash;
    }

    /**
     * @dev Structure for campaign data
     */
    struct CampaignData {
        uint256 totalVotes;
        uint256 proposalCount;
        uint256 candidateCount;
        uint256 registeredVoterCount;
        mapping(uint256 => Proposal) proposals;
        mapping(uint256 => Candidate) candidates;
        mapping(address => bool) hasVoted;
        mapping(address => bool) isRegistered;
        mapping(address => RegistrationType) registrationType;
    }

    /**
     * @dev Structure for notification data
     */
    struct Notification {
        uint256 id;
        address userAddress;
        uint256 campaignId;
        uint8 notificationType;
        uint256 timestamp;
        uint256 relatedEntityId;
        string data;
    }

    // State Variables
    address public owner;
    uint256 private _tokenIdTracker;
    uint256 public campaignCount;
    string public baseImageURI = "https://gateway.pinata.cloud/ipfs/bafybeiabp2v2xz5hzdilrmfb5p7tdoo5gjhpfzifync4iyodtr6n73p6hi";
    string public candidateImageURI = "https://gateway.pinata.cloud/ipfs/bafybeih7kfwf4mh5uaywswelet33kfpva7gw4p3gjmajgmvlewbfnumzgu";

    // Notification system state
    uint256 private _notificationIdTracker;
    mapping(uint256 => Notification) private notifications;
    mapping(address => uint256[]) private userNotifications;
    mapping(uint256 => uint256[]) private campaignNotifications;

    // Mappings
    mapping(uint256 => CampaignMetadata) public campaignMetadata;
    mapping(uint256 => CampaignData) private campaignData;
    mapping(uint256 => uint256) public tokenToCampaign;
    mapping(address => mapping(uint256 => uint256)) public voterTokens;
    
    // New mappings for enhanced functionality
    mapping(address => uint256[]) private userCreatedCampaigns;
    mapping(address => uint256[]) private userVotedCampaigns;

    // Events
   event CampaignCreated(
    uint256 indexed campaignId,
    address indexed creator,
    string description,
    VotingType votingType,
    VotingRestriction restriction,
    uint256 startTime,
    uint256 endTime
);
    event ProposalAdded(uint256 indexed campaignId, uint256 indexed proposalId, string content);
    event CandidateAdded(uint256 indexed campaignId, uint256 indexed candidateId, address indexed candidateAddress, string name);
    event VoterRegistered(uint256 indexed campaignId, address indexed voter, uint256 tokenId);
    event CandidateRegistered(uint256 indexed campaignId, address indexed candidate, uint256 tokenId);
    event VoteCast(uint256 indexed campaignId, address indexed voter, uint256 targetId);
    event CampaignStatusChanged(uint256 indexed campaignId, CampaignStatus status);
    event BaseImageURISet(string newURI);
    event CandidateImageURISet(string newURI);
    event NFTBurned(uint256 indexed campaignId, address indexed voter, uint256 tokenId);
    event ContractPaused(address indexed operator);
    event ContractUnpaused(address indexed operator);
    event NotificationCreated(uint256 indexed id, address indexed userAddress, uint256 indexed campaignId, uint8 notificationType, uint256 timestamp, uint256 relatedEntityId);
    event VoteCapReached(uint256 indexed campaignId, uint256 totalVotes);

    /**
     * @dev Constructor initializes the contract with basic settings
     */
    constructor() ERC721("PolytixVoterNFT", "PVNFT") {
        owner = msg.sender;
    }

    /**
     * @dev Modifier to restrict access to contract owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner is allowed");
        _;
    }

    /**
     * @dev Modifier to validate campaign existence
     * @param _campaignId The ID of the campaign to validate
     */
    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign");
        _;
    }

    /**
     * @dev Modifier to restrict access to campaign creator
     * @param _campaignId The ID of the campaign
     */
    modifier onlyCreator(uint256 _campaignId) {
        require(campaignMetadata[_campaignId].creator == msg.sender, "Not creator");
        _;
    }

    /**
     * @dev Modifier to validate description length
     * @param _description The description to validate
     */
    modifier validateDescription(string memory _description) {
        require(bytes(_description).length > 0 && bytes(_description).length <= MAX_DESCRIPTION_LENGTH, "Description must be 1-100 chars");
        _;
    }

    /**
     * @dev Internal function to create notifications
     */
    function _createNotification(
        address user,
        uint256 campaignId,
        uint8 notificationType,
        uint256 relatedEntityId,
        string memory data
    ) internal returns (uint256) {
        _notificationIdTracker++;
        uint256 newNotificationId = _notificationIdTracker;

        notifications[newNotificationId] = Notification({
            id: newNotificationId,
            userAddress: user,
            campaignId: campaignId,
            notificationType: notificationType,
            timestamp: block.timestamp,
            relatedEntityId: relatedEntityId,
            data: data
        });

        userNotifications[user].push(newNotificationId);
        campaignNotifications[campaignId].push(newNotificationId);

        emit NotificationCreated(
            newNotificationId,
            user,
            campaignId,
            notificationType,
            block.timestamp,
            relatedEntityId
        );

        return newNotificationId;
    }

    /**
     * @dev Sets the base image URI for NFTs
     * @param _newURI The new base URI
     */
    function setBaseImageURI(string memory _newURI) external onlyOwner {
        require(bytes(_newURI).length > 0, "URI cannot be empty");
        baseImageURI = _newURI;
        emit BaseImageURISet(_newURI);
    }

    /**
     * @dev Sets the candidate image URI for NFTs
     * @param _newURI The new candidate URI
     */
    function setCandidateImageURI(string memory _newURI) external onlyOwner {
        require(bytes(_newURI).length > 0, "URI cannot be empty");
        candidateImageURI = _newURI;
        emit CandidateImageURISet(_newURI);
    }

    /**
     * @dev Returns the token URI for a given token ID
     * @param tokenId The ID of the token
     * @return string The token URI
     */
    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        ownerOf(tokenId);
        
        require(bytes(baseImageURI).length > 0, "Base image URI not set");
        require(bytes(candidateImageURI).length > 0, "Candidate image URI not set");
        
        uint256 campaignId = tokenToCampaign[tokenId];
        require(campaignId > 0 && campaignId <= campaignCount, "Token not associated with a valid campaign");
        
        CampaignMetadata storage campaignMeta = campaignMetadata[campaignId];
        address tokenOwner = ownerOf(tokenId);
        
        string memory imageURL;
        string memory nftType;
        
        if (campaignData[campaignId].registrationType[tokenOwner] == RegistrationType.Candidate) {
            imageURL = candidateImageURI;
            nftType = "Candidate";
        } else {
            imageURL = baseImageURI;
            nftType = "Voter";
        }
        
        string memory nftName = string(abi.encodePacked(
            "PVNFT - ",
            nftType, " - ",
            campaignMeta.description,
            " - (ID ",
            tokenId.toString(),
            ")"
        ));
        
        string memory json = Base64.encode(
            bytes(string(abi.encodePacked(
                '{"name": "', nftName,
                '", "description": "Polytix ', nftType, ' NFT for Campaign: ', campaignMeta.description,
                '", "image": "', imageURL, '"}'
            )))
        );
        
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    /**
     * @dev Helper function to check and register a user
     * @param _campaignId The campaign ID
     * @param passKey The registration passkey
     * @param regType The registration type
     * @return uint256 The new token ID
     */
    function _checkAndRegisterUser(
        uint256 _campaignId, 
        string memory passKey,
        RegistrationType regType
    ) internal returns (uint256) {
        CampaignMetadata storage metadata = campaignMetadata[_campaignId];
        CampaignData storage data = campaignData[_campaignId];
        
        require(!data.isRegistered[msg.sender], "Already registered");
        require(block.timestamp < metadata.timeFrame.startTime, "Registration period ended");
        require(metadata.passKeyHash == keccak256(abi.encodePacked(passKey)), "Invalid passkey");
        
        if (metadata.restriction == VotingRestriction.Limited) {
            require(data.registeredVoterCount < metadata.maxVoters, "Max voters reached");
        }
        
        _tokenIdTracker++;
        uint256 newTokenId = _tokenIdTracker;
        _mint(msg.sender, newTokenId);
        
        data.isRegistered[msg.sender] = true;
        data.registeredVoterCount++;
        data.registrationType[msg.sender] = regType;
        
        tokenToCampaign[newTokenId] = _campaignId;
        voterTokens[msg.sender][_campaignId] = newTokenId;
        
        return newTokenId;
    }

    /**
     * @dev Creates a new proposal-based campaign
     * @param description Campaign description
     * @param restriction Voting restriction type
     * @param resultType Result calculation type
     * @param startTime Campaign start time
     * @param endTime Campaign end time
     * @param maxVoters Maximum number of voters (for limited campaigns)
     * @param passKey Registration passkey
     * @param proposals Array of initial proposals
     */
    function createProposalBasedCampaign(
        string memory description,
        VotingRestriction restriction,
        ResultType resultType,
        uint256 startTime,
        uint256 endTime,
        uint256 maxVoters,
        string memory passKey,
        string[] memory proposals
    ) external whenNotPaused nonReentrant validateDescription(description) {
        require(startTime >= block.timestamp + 5 minutes, "Start time must be at least 5 minutes in the future");
        require(endTime >= startTime + 10 minutes, "Voting duration must be at least 10 minutes");
        require(proposals.length >= 2, "Must provide at least 2 proposals");

        for(uint i = 0; i < proposals.length; i++) {
            require(bytes(proposals[i]).length <= MAX_PROPOSAL_LENGTH, "Proposal too long");
        }

        if (restriction == VotingRestriction.RequiredRegistration) {
            require(startTime > block.timestamp, "Start time must be after current time to allow registration");
            require(bytes(passKey).length > 0, "Passkey required for RequiredRegistration campaigns");
        } else if (restriction == VotingRestriction.Limited) {
            require(maxVoters > 0, "Max voters must be greater than 0 for Limited campaigns");
        } else {
            require(maxVoters == 0, "maxVoters should be 0 for OpenToAll campaigns");
            require(bytes(passKey).length == 0, "Passkey should be empty for OpenToAll campaigns");
        }

        campaignCount++;
        uint256 newCampaignId = campaignCount;

        bytes32 passKeyHash;
        if (restriction == VotingRestriction.RequiredRegistration) {
            passKeyHash = keccak256(abi.encodePacked(passKey));
        }

        campaignMetadata[newCampaignId] = CampaignMetadata({
            votingType: VotingType.ProposalBased,
            restriction: restriction,
            resultType: resultType,
            creator: msg.sender,
            description: description,
            timeFrame: TimeFrame(startTime, endTime),
            maxVoters: maxVoters,
            passKeyHash: passKeyHash
        });

        CampaignData storage data = campaignData[newCampaignId];

        for (uint256 i = 0; i < proposals.length; i++) {
            require(bytes(proposals[i]).length > 0, "Proposal content cannot be empty");
            data.proposals[i] = Proposal({ 
                content: proposals[i], 
                voteCount: 0, 
                lastVoteTimestamp: 0 
            });
            emit ProposalAdded(newCampaignId, i, proposals[i]);
        }
        data.proposalCount = proposals.length;

        userCreatedCampaigns[msg.sender].push(newCampaignId);

        _createNotification(
            msg.sender,
            newCampaignId,
            0, // CampaignCreated
            0,
            description
        );

       emit CampaignCreated(campaignId, creator, description, votingType, restriction, startTime, endTime);

    }

    /**
     * @dev Creates a new candidate-based campaign
     * @param description Campaign description
     * @param restriction Voting restriction type
     * @param resultType Result calculation type
     * @param startTime Campaign start time
     * @param endTime Campaign end time
     * @param maxVoters Maximum number of voters (for limited campaigns)
     * @param passKey Registration passkey
     */
    function createCandidateBasedCampaign(
        string memory description,
        VotingRestriction restriction,
        ResultType resultType,
        uint256 startTime,
        uint256 endTime,
        uint256 maxVoters,
        string memory passKey
    ) external whenNotPaused nonReentrant validateDescription(description) {
        require(startTime >= block.timestamp + 10 minutes, "Start must be 10+ min from now");
        require(endTime >= startTime + 30 minutes, "Duration must be 30+ min");

        if (restriction == VotingRestriction.RequiredRegistration) {
            require(startTime >= block.timestamp + 30 minutes, "Start time must allow registrations");
            require(bytes(passKey).length > 0, "Passkey required for registration");
        } else if (restriction == VotingRestriction.Limited) {
            require(maxVoters > 0, "Max voters must be greater than 0 for Limited campaigns");
        } else {
            require(maxVoters == 0, "maxVoters should be 0 for OpenToAll campaigns");
            require(bytes(passKey).length == 0, "Passkey should be empty for OpenToAll campaigns");
        }

        campaignCount++;
        uint256 newCampaignId = campaignCount;

        bytes32 passKeyHash;
        if (restriction == VotingRestriction.RequiredRegistration) {
            passKeyHash = keccak256(abi.encodePacked(passKey));
        }

        campaignMetadata[newCampaignId] = CampaignMetadata({
            votingType: VotingType.CandidateBased,
            restriction: restriction,
            resultType: resultType,
            creator: msg.sender,
            description: description,
            timeFrame: TimeFrame(startTime, endTime),
            maxVoters: maxVoters,
            passKeyHash: passKeyHash
        });

        userCreatedCampaigns[msg.sender].push(newCampaignId);

        _createNotification(
            msg.sender,
            newCampaignId,
            0, // CampaignCreated
            0,
            description
        );

        emit CampaignCreated(
            newCampaignId, 
            msg.sender, 
            VotingType.CandidateBased,
            restriction,
            startTime, 
            endTime
        );
    }

    /**
     * @dev Adds a new proposal to an existing campaign
     * @param _campaignId The campaign ID
     * @param proposalContent The proposal content
     */
    function addProposal(uint256 _campaignId, string memory proposalContent)
        external
        whenNotPaused
        campaignExists(_campaignId)
        onlyCreator(_campaignId)
    {
        require(bytes(proposalContent).length > 0 && bytes(proposalContent).length <= MAX_PROPOSAL_LENGTH, "Invalid proposal length");
        require(campaignMetadata[_campaignId].votingType == VotingType.ProposalBased, "Not proposal-based");
        require(getCurrentCampaignStatus(_campaignId) == CampaignStatus.Created, "Cannot add proposals after start");

        CampaignData storage data = campaignData[_campaignId];
        uint256 newProposalId = data.proposalCount;
        data.proposals[newProposalId] = Proposal({ 
            content: proposalContent, 
            voteCount: 0, 
            lastVoteTimestamp: 0 
        });
        data.proposalCount++;

        _createNotification(
            msg.sender,
            _campaignId,
            1, // ProposalAdded
            newProposalId,
            proposalContent
        );

        emit ProposalAdded(_campaignId, newProposalId, proposalContent);
    }

    /**
     * @dev Registers a new candidate for a campaign
     * @param _campaignId The campaign ID
     * @param name Candidate name
     * @param statement Candidate statement
     * @param imageHash IPFS hash of candidate image
     * @param passKey Registration passkey
     */
    function registerAsCandidate(
        uint256 _campaignId,
        string memory name,
        string memory statement,
        string memory imageHash,
        string memory passKey
    ) external whenNotPaused campaignExists(_campaignId) {
        require(bytes(name).length > 0 && bytes(name).length <= MAX_NAME_LENGTH, "Invalid name length");
        require(bytes(statement).length > 0 && bytes(statement).length <= MAX_STATEMENT_LENGTH, "Invalid statement length");

        CampaignMetadata storage metadata = campaignMetadata[_campaignId];
        require(metadata.votingType == VotingType.CandidateBased, "Not candidate-based");
        require(metadata.restriction == VotingRestriction.RequiredRegistration, "Registration not required");

        uint256 newTokenId = _checkAndRegisterUser(_campaignId, passKey, RegistrationType.Candidate);

        CampaignData storage data = campaignData[_campaignId];
        uint256 newCandidateId = data.candidateCount;
        data.candidates[newCandidateId] = Candidate({
            candidateAddress: msg.sender,
            name: name,
            statement: statement,
            imageHash: imageHash,
            voteCount: 0,
            lastVoteTimestamp: 0
        });
        data.candidateCount++;

        _createNotification(
            msg.sender,
            _campaignId,
            2, // CandidateAdded
            newCandidateId,
            name
        );

        emit CandidateRegistered(_campaignId, msg.sender, newTokenId);
    }

    /**
     * @dev Burns a voting NFT after voting
     * @param _campaignId The campaign ID
     */
    function burnMyVotingNFT(uint256 _campaignId)
        external
        whenNotPaused
        campaignExists(_campaignId)
    {
        CampaignData storage data = campaignData[_campaignId];
        address voter = msg.sender;

        require(data.hasVoted[voter], "Must vote before burning NFT");

        uint256 tokenId = voterTokens[voter][_campaignId];
        require(tokenId > 0, "No voting NFT found");
        require(ownerOf(tokenId) == voter, "Not token owner");

        _burn(tokenId);

        delete tokenToCampaign[tokenId];
        delete voterTokens[voter][_campaignId];

        _createNotification(
            msg.sender,
            _campaignId,
            7, // NFTBurned
            tokenId,
            ""
        );

        emit NFTBurned(_campaignId, voter, tokenId);
    }

    /**
     * @dev Registers a voter for a campaign
     * @param _campaignId The campaign ID
     * @param passKey Registration passkey
     */
    function registerToVote(uint256 _campaignId, string memory passKey) 
        external 
        whenNotPaused 
        campaignExists(_campaignId) 
    {
        CampaignMetadata storage metadata = campaignMetadata[_campaignId];
        require(metadata.restriction == VotingRestriction.RequiredRegistration, "Registration not required");
        require(getCurrentCampaignStatus(_campaignId) == CampaignStatus.Created, "Registration closed");

        uint256 newTokenId = _checkAndRegisterUser(_campaignId, passKey, RegistrationType.Voter);

        _createNotification(
            msg.sender,
            _campaignId,
            3, // VoterRegistered
            newTokenId,
            ""
        );

        emit VoterRegistered(_campaignId, msg.sender, newTokenId);
    }

    /**
     * @dev Casts a vote for a proposal
     * @param _campaignId The campaign ID
     * @param _proposalId The proposal ID
     */
    function voteForProposal(uint256 _campaignId, uint256 _proposalId)
        external
        whenNotPaused
        campaignExists(_campaignId)
    {
        CampaignMetadata storage metadata = campaignMetadata[_campaignId];
        CampaignData storage data = campaignData[_campaignId];

        require(metadata.votingType == VotingType.ProposalBased, "Not proposal-based");
        require(isVotingOpen(_campaignId), "Voting not open");
        require(!data.hasVoted[msg.sender], "Already voted");
        require(_proposalId < data.proposalCount, "Invalid proposal ID");

        // Check vote cap for Limited mode
        if (metadata.restriction == VotingRestriction.Limited) {
            require(data.totalVotes < metadata.maxVoters, "Vote cap reached");
        } else if (metadata.restriction == VotingRestriction.RequiredRegistration) {
            require(data.isRegistered[msg.sender], "Not registered");
            uint256 tokenId = voterTokens[msg.sender][_campaignId];
            require(tokenId > 0 && ownerOf(tokenId) == msg.sender, "No valid voting NFT");
        }

        data.hasVoted[msg.sender] = true;
        data.proposals[_proposalId].voteCount++;
        data.proposals[_proposalId].lastVoteTimestamp = block.timestamp;
        data.totalVotes++;

        userVotedCampaigns[msg.sender].push(_campaignId);

        _createNotification(
            msg.sender,
            _campaignId,
            5, // VoteCast
            _proposalId,
            ""
        );

        emit VoteCast(_campaignId, msg.sender, _proposalId);

        // Check if vote cap is reached
        if (metadata.restriction == VotingRestriction.Limited && 
            data.totalVotes >= metadata.maxVoters) {
            _createNotification(
                msg.sender,
                _campaignId,
                8, // VoteCapReached
                data.totalVotes,
                ""
            );
            emit VoteCapReached(_campaignId, data.totalVotes);
        }
    }

    /**
     * @dev Casts a vote for a candidate
     * @param _campaignId The campaign ID
     * @param _candidateId The candidate ID
     */
    function voteForCandidate(uint256 _campaignId, uint256 _candidateId)
        external
        whenNotPaused
        campaignExists(_campaignId)
    {
        CampaignMetadata storage metadata = campaignMetadata[_campaignId];
        CampaignData storage data = campaignData[_campaignId];

        require(metadata.votingType == VotingType.CandidateBased, "Not candidate-based");
        require(isVotingOpen(_campaignId), "Voting not open");
        require(!data.hasVoted[msg.sender], "Already voted");
        require(_candidateId < data.candidateCount, "Invalid candidate ID");

        // Check vote cap for Limited mode
        if (metadata.restriction == VotingRestriction.Limited) {
            require(data.totalVotes < metadata.maxVoters, "Vote cap reached");
        } else if (metadata.restriction == VotingRestriction.RequiredRegistration) {
            require(data.isRegistered[msg.sender], "Not registered");
            
            if (data.registrationType[msg.sender] == RegistrationType.Candidate) {
                require(data.candidates[_candidateId].candidateAddress != msg.sender, "Cannot vote for self");
            }
            
            uint256 tokenId = voterTokens[msg.sender][_campaignId];
            require(tokenId > 0 && ownerOf(tokenId) == msg.sender, "No valid voting NFT");
        }

        data.hasVoted[msg.sender] = true;
        data.candidates[_candidateId].voteCount++;
        data.candidates[_candidateId].lastVoteTimestamp = block.timestamp;
        data.totalVotes++;

        userVotedCampaigns[msg.sender].push(_campaignId);

        _createNotification(
            msg.sender,
            _campaignId,
            5, // VoteCast
            _candidateId,
            ""
        );

        emit VoteCast(_campaignId, msg.sender, _candidateId);

        // Check if vote cap is reached
        if (metadata.restriction == VotingRestriction.Limited && 
            data.totalVotes >= metadata.maxVoters) {
            _createNotification(
                msg.sender,
                _campaignId,
                8, // VoteCapReached
                data.totalVotes,
                ""
            );
            emit VoteCapReached(_campaignId, data.totalVotes);
        }
    }

    /**
     * @dev Gets notifications for a user
     */
    function getUserNotifications(address user, uint256 offset, uint256 limit)
        external
        view
        returns (Notification[] memory)
    {
        uint256[] storage userNotificationIds = userNotifications[user];
        uint256 totalCount = userNotificationIds.length;
        uint256 endIndex = offset + limit > totalCount ? totalCount : offset + limit;
        uint256 resultCount = endIndex > offset ? endIndex - offset : 0;

        Notification[] memory result = new Notification[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = notifications[userNotificationIds[offset + i]];
        }
        return result;
    }


    /**
     * @dev Gets notifications for a campaign
     */
    function getCampaignNotifications(uint256 campaignId, uint256 offset, uint256 limit)
        external
        view
        campaignExists(campaignId)
        returns (Notification[] memory)
    {
        uint256[] storage campaignNotificationIds = campaignNotifications[campaignId];
        uint256 totalCount = campaignNotificationIds.length;
        uint256 endIndex = offset + limit > totalCount ? totalCount : offset + limit;
        uint256 resultCount = endIndex > offset ? endIndex - offset : 0;

        Notification[] memory result = new Notification[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = notifications[campaignNotificationIds[offset + i]];
        }
        return result;
    }

    /**
     * @dev Gets notification count for a user
     */
    function getUserNotificationCount(address user) 
        external 
        view 
        returns (uint256) 
    {
        return userNotifications[user].length;
    }

    /**
     * @dev Gets notification count for a campaign
     */
    function getCampaignNotificationCount(uint256 campaignId) 
        external 
        view 
        campaignExists(campaignId)
        returns (uint256) 
    {
        return campaignNotifications[campaignId].length;
    }

    /**
     * @dev Checks if voting is currently open for a campaign
     * @param _campaignId The campaign ID
     * @return bool True if voting is open
     */
    function isVotingOpen(uint256 _campaignId) public view returns (bool) {
        TimeFrame memory timeFrame = campaignMetadata[_campaignId].timeFrame;
        return block.timestamp >= timeFrame.startTime && block.timestamp <= timeFrame.endTime;
    }

    /**
     * @dev Gets the current status of a campaign
     * @param _campaignId The campaign ID
     * @return CampaignStatus The current status
     */
    function getCurrentCampaignStatus(uint256 _campaignId) public view campaignExists(_campaignId) returns (CampaignStatus) {
        TimeFrame memory timeFrame = campaignMetadata[_campaignId].timeFrame;
        
        if (block.timestamp > timeFrame.endTime) {
            return CampaignStatus.Ended;
        } else if (block.timestamp >= timeFrame.startTime) {
            return CampaignStatus.Active;
        } else {
            return CampaignStatus.Created;
        }
    }

    /**
     * @dev Gets the vote count for a proposal
     * @param _campaignId The campaign ID
     * @param _proposalId The proposal ID
     * @return uint256 The vote count
     */
    function getProposalVoteCount(uint256 _campaignId, uint256 _proposalId) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (uint256) 
    {
        require(campaignMetadata[_campaignId].votingType == VotingType.ProposalBased, "Not proposal-based");
        require(_proposalId < campaignData[_campaignId].proposalCount, "Invalid proposal ID");
        return campaignData[_campaignId].proposals[_proposalId].voteCount;
    }

    /**
     * @dev Gets the content of a proposal
     * @param _campaignId The campaign ID
     * @param _proposalId The proposal ID
     * @return string The proposal content
     */
    function getProposalContent(uint256 _campaignId, uint256 _proposalId) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (string memory) 
    {
        require(campaignMetadata[_campaignId].votingType == VotingType.ProposalBased, "Not proposal-based");
        require(_proposalId < campaignData[_campaignId].proposalCount, "Invalid proposal ID");
        return campaignData[_campaignId].proposals[_proposalId].content;
    }

    /**
     * @dev Gets the number of proposals in a campaign
     * @param _campaignId The campaign ID
     * @return uint256 The number of proposals
     */
    function getProposalIds(uint256 _campaignId) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (uint256) 
    {
        require(campaignMetadata[_campaignId].votingType == VotingType.ProposalBased, "Not proposal-based");
        return campaignData[_campaignId].proposalCount;
    }

    /**
     * @dev Gets all proposals and their vote counts
     * @param _campaignId The campaign ID
     * @return contents Array of proposal contents
     * @return voteCounts Array of vote counts
     */
    function getProposals(uint256 _campaignId)
        external
        view
        campaignExists(_campaignId)
        returns (string[] memory contents, uint256[] memory voteCounts)
    {
        require(campaignMetadata[_campaignId].votingType == VotingType.ProposalBased, "Not proposal-based");
        
        CampaignData storage data = campaignData[_campaignId];
        contents = new string[](data.proposalCount);
        voteCounts = new uint256[](data.proposalCount);

        for (uint256 i = 0; i < data.proposalCount; i++) {
            contents[i] = data.proposals[i].content;
            voteCounts[i] = data.proposals[i].voteCount;
        }
    }

    /**
     * @dev Gets a candidate's name
     * @param _campaignId The campaign ID
     * @param _candidateId The candidate ID
     * @return string The candidate's name
     */
    function getCandidateName(uint256 _campaignId, uint256 _candidateId) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (string memory) 
    {
        require(campaignMetadata[_campaignId].votingType == VotingType.CandidateBased, "Not candidate-based");
        require(_candidateId < campaignData[_campaignId].candidateCount, "Invalid candidate ID");
        return campaignData[_campaignId].candidates[_candidateId].name;
    }

    /**
     * @dev Gets detailed information about a candidate
     * @param _campaignId The campaign ID
     * @param _candidateId The candidate ID
     * @return Candidate information (address, name, statement, imageHash, voteCount)
     */
    function getCandidateInfo(uint256 _campaignId, uint256 _candidateId)
        external
        view
        campaignExists(_campaignId)
        returns (address, string memory, string memory, string memory, uint256)
    {
        require(campaignMetadata[_campaignId].votingType == VotingType.CandidateBased, "Not candidate-based");
        require(_candidateId < campaignData[_campaignId].candidateCount, "Invalid candidate ID");
        
        Candidate storage candidate = campaignData[_campaignId].candidates[_candidateId];
        return (
            candidate.candidateAddress,
            candidate.name,
            candidate.statement,
            candidate.imageHash,
            candidate.voteCount
        );
    }

    /**
     * @dev Gets the number of candidates in a campaign
     * @param _campaignId The campaign ID
     * @return uint256 The number of candidates
     */
    function getCandidateIds(uint256 _campaignId) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (uint256) 
    {
        require(campaignMetadata[_campaignId].votingType == VotingType.CandidateBased, "Not candidate-based");
        return campaignData[_campaignId].candidateCount;
    }

    /**
     * @dev Gets all candidates and their vote information
     * @param _campaignId The campaign ID
     * @return addresses Array of candidate addresses
     * @return names Array of candidate names
     * @return voteCounts Array of vote counts
     * @return lastVoteTimestamps Array of last vote timestamps
     */
    function getCandidates(uint256 _campaignId)
        external view campaignExists(_campaignId)
        returns (
            address[] memory addresses,
            string[] memory names,
            uint256[] memory voteCounts,
            uint256[] memory lastVoteTimestamps
        )
    {
        require(campaignMetadata[_campaignId].votingType == VotingType.CandidateBased, "Not candidate-based");
        CampaignData storage data = campaignData[_campaignId];
        uint256 count = data.candidateCount;

        addresses = new address[](count);
        names = new string[](count);
        voteCounts = new uint256[](count);
        lastVoteTimestamps = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            Candidate storage c = data.candidates[i];
            addresses[i] = c.candidateAddress;
            names[i] = c.name;
            voteCounts[i] = c.voteCount;
            lastVoteTimestamps[i] = c.lastVoteTimestamp;
        }
    }

    /**
     * @dev Gets basic information about a campaign
     * @param _campaignId The campaign ID
     * @return Campaign type information
     */
    function getCampaignBasicInfo(uint256 _campaignId)
        external
        view
        campaignExists(_campaignId)
        returns (
            VotingType votingType,
            VotingRestriction restriction,
            ResultType resultType,
            address creator,
            string memory description
        )
    {
        CampaignMetadata storage metadata = campaignMetadata[_campaignId];
        
        return (
            metadata.votingType,
            metadata.restriction,
            metadata.resultType,
            metadata.creator,
            metadata.description
        );
    }

    /**
     * @dev Gets time-related information about a campaign
     * @param _campaignId The campaign ID
     * @return Campaign timing information
     */
    function getCampaignTimeInfo(uint256 _campaignId)
        external
        view
        campaignExists(_campaignId)
        returns (
            CampaignStatus status,
            uint256 startTime,
            uint256 endTime
        )
    {
        CampaignMetadata storage metadata = campaignMetadata[_campaignId];
        status = getCurrentCampaignStatus(_campaignId);
        
        return (
            status,
            metadata.timeFrame.startTime,
            metadata.timeFrame.endTime
        );
    }

    /**
     * @dev Gets statistical information about a campaign
     * @param _campaignId The campaign ID
     * @return Campaign statistics
     */
    function getCampaignStats(uint256 _campaignId)
        external
        view
        campaignExists(_campaignId)
        returns (
            uint256 totalVotes,
            uint256 itemCount,
            uint256 registeredVoterCount
        )
    {
        CampaignMetadata storage metadata = campaignMetadata[_campaignId];
        CampaignData storage data = campaignData[_campaignId];
        
        return (
            data.totalVotes,
            metadata.votingType == VotingType.ProposalBased ? data.proposalCount : data.candidateCount,
            data.registeredVoterCount
        );
    }

    /**
     * @dev Checks if a user has voted in a campaign
     * @param _campaignId The campaign ID
     * @param _user The user's address
     * @return bool True if the user has voted
     */
    function hasUserVoted(uint256 _campaignId, address _user) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (bool) 
    {
        return campaignData[_campaignId].hasVoted[_user];
    }

    /**
     * @dev Checks if a user is registered for a campaign
     * @param _campaignId The campaign ID
     * @param _user The user's address
     * @return bool True if the user is registered
     */
    function isUserRegistered(uint256 _campaignId, address _user) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (bool) 
    {
        return campaignData[_campaignId].isRegistered[_user];
    }

    /**
     * @dev Gets a user's registration type for a campaign
     * @param _campaignId The campaign ID
     * @param _user The user's address
     * @return RegistrationType The user's registration type
     */
    
    function getUserRegistrationType(uint256 _campaignId, address _user) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (RegistrationType) 
    {
        require(campaignData[_campaignId].isRegistered[_user], "User not registered");
        return campaignData[_campaignId].registrationType[_user];
    }

    /**
     * @dev Gets all campaigns created by a user
     * @param _user The user's address
     * @return uint256[] Array of campaign IDs
     */
    function getUserCreatedCampaigns(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userCreatedCampaigns[_user];
    }

    /**
     * @dev Gets all campaigns a user has voted in
     * @param _user The user's address
     * @return uint256[] Array of campaign IDs
     */
    function getUserVotedCampaigns(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userVotedCampaigns[_user];
    }

    /**
     * @dev Checks if registration is still open for a campaign
     * @param _campaignId The campaign ID
     * @return bool True if registration is open
     */
    function isRegistrationOpen(uint256 _campaignId) 
        public 
        view 
        returns (bool) 
    {
        CampaignMetadata storage metadata = campaignMetadata[_campaignId];
        return block.timestamp < metadata.timeFrame.startTime;
    }

    /**
     * @dev Pauses all contract operations
     */
    function pause() external onlyOwner {
        _pause();
        emit ContractPaused(msg.sender);
    }

    /**
     * @dev Unpauses all contract operations
     */
    function unpause() external onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }
}