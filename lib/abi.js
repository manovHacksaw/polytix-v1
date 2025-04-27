const metadata ={
	"compiler": {
		"version": "0.8.29+commit.ab55807c"
	},
	"language": "Solidity",
	"output": {
		"abi": [
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"inputs": [],
				"name": "ERC721EnumerableForbiddenBatchMint",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"name": "ERC721IncorrectOwner",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "operator",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "ERC721InsufficientApproval",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "approver",
						"type": "address"
					}
				],
				"name": "ERC721InvalidApprover",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "operator",
						"type": "address"
					}
				],
				"name": "ERC721InvalidOperator",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"name": "ERC721InvalidOwner",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					}
				],
				"name": "ERC721InvalidReceiver",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					}
				],
				"name": "ERC721InvalidSender",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "ERC721NonexistentToken",
				"type": "error"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					}
				],
				"name": "ERC721OutOfBoundsIndex",
				"type": "error"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "approved",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "Approval",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "operator",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "bool",
						"name": "approved",
						"type": "bool"
					}
				],
				"name": "ApprovalForAll",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "string",
						"name": "newURI",
						"type": "string"
					}
				],
				"name": "BaseImageURISet",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "enum Polytix.VotingType",
						"name": "votingType",
						"type": "uint8"
					},
					{
						"indexed": false,
						"internalType": "enum Polytix.VotingRestriction",
						"name": "restriction",
						"type": "uint8"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					}
				],
				"name": "CampaignCreated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "enum Polytix.CampaignStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"name": "CampaignStatusChanged",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "candidateId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "candidateAddress",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "name",
						"type": "string"
					}
				],
				"name": "CandidateAdded",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "string",
						"name": "newURI",
						"type": "string"
					}
				],
				"name": "CandidateImageURISet",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "candidate",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "CandidateRegistered",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "operator",
						"type": "address"
					}
				],
				"name": "ContractPaused",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "operator",
						"type": "address"
					}
				],
				"name": "ContractUnpaused",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "voter",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "NFTBurned",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint8",
						"name": "notificationType",
						"type": "uint8"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "relatedEntityId",
						"type": "uint256"
					}
				],
				"name": "NotificationCreated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "account",
						"type": "address"
					}
				],
				"name": "Paused",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "proposalId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "content",
						"type": "string"
					}
				],
				"name": "ProposalAdded",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "Transfer",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "account",
						"type": "address"
					}
				],
				"name": "Unpaused",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "totalVotes",
						"type": "uint256"
					}
				],
				"name": "VoteCapReached",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "voter",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "targetId",
						"type": "uint256"
					}
				],
				"name": "VoteCast",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "voter",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "VoterRegistered",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "proposalContent",
						"type": "string"
					}
				],
				"name": "addProposal",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "approve",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"name": "balanceOf",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "baseImageURI",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "burnMyVotingNFT",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "campaignCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "campaignMetadata",
				"outputs": [
					{
						"internalType": "enum Polytix.VotingType",
						"name": "votingType",
						"type": "uint8"
					},
					{
						"internalType": "enum Polytix.VotingRestriction",
						"name": "restriction",
						"type": "uint8"
					},
					{
						"internalType": "enum Polytix.ResultType",
						"name": "resultType",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "startTime",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "endTime",
								"type": "uint256"
							}
						],
						"internalType": "struct Polytix.TimeFrame",
						"name": "timeFrame",
						"type": "tuple"
					},
					{
						"internalType": "uint256",
						"name": "maxVoters",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "passKeyHash",
						"type": "bytes32"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "candidateImageURI",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "enum Polytix.VotingRestriction",
						"name": "restriction",
						"type": "uint8"
					},
					{
						"internalType": "enum Polytix.ResultType",
						"name": "resultType",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxVoters",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "passKey",
						"type": "string"
					}
				],
				"name": "createCandidateBasedCampaign",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "enum Polytix.VotingRestriction",
						"name": "restriction",
						"type": "uint8"
					},
					{
						"internalType": "enum Polytix.ResultType",
						"name": "resultType",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxVoters",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "passKey",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "proposals",
						"type": "string[]"
					}
				],
				"name": "createProposalBasedCampaign",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "getApproved",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "getCampaignBasicInfo",
				"outputs": [
					{
						"internalType": "enum Polytix.VotingType",
						"name": "votingType",
						"type": "uint8"
					},
					{
						"internalType": "enum Polytix.VotingRestriction",
						"name": "restriction",
						"type": "uint8"
					},
					{
						"internalType": "enum Polytix.ResultType",
						"name": "resultType",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					}
				],
				"name": "getCampaignNotificationCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "offset",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "limit",
						"type": "uint256"
					}
				],
				"name": "getCampaignNotifications",
				"outputs": [
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "id",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "userAddress",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "campaignId",
								"type": "uint256"
							},
							{
								"internalType": "uint8",
								"name": "notificationType",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "timestamp",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "relatedEntityId",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "data",
								"type": "string"
							}
						],
						"internalType": "struct Polytix.Notification[]",
						"name": "",
						"type": "tuple[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "getCampaignStats",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "totalVotes",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "itemCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "registeredVoterCount",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "getCampaignTimeInfo",
				"outputs": [
					{
						"internalType": "enum Polytix.CampaignStatus",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "getCandidateIds",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_candidateId",
						"type": "uint256"
					}
				],
				"name": "getCandidateInfo",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_candidateId",
						"type": "uint256"
					}
				],
				"name": "getCandidateName",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "getCandidates",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "addresses",
						"type": "address[]"
					},
					{
						"internalType": "string[]",
						"name": "names",
						"type": "string[]"
					},
					{
						"internalType": "uint256[]",
						"name": "voteCounts",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256[]",
						"name": "lastVoteTimestamps",
						"type": "uint256[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "getCurrentCampaignStatus",
				"outputs": [
					{
						"internalType": "enum Polytix.CampaignStatus",
						"name": "",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_proposalId",
						"type": "uint256"
					}
				],
				"name": "getProposalContent",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "getProposalIds",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_proposalId",
						"type": "uint256"
					}
				],
				"name": "getProposalVoteCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "getProposals",
				"outputs": [
					{
						"internalType": "string[]",
						"name": "contents",
						"type": "string[]"
					},
					{
						"internalType": "uint256[]",
						"name": "voteCounts",
						"type": "uint256[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_user",
						"type": "address"
					}
				],
				"name": "getUserCreatedCampaigns",
				"outputs": [
					{
						"internalType": "uint256[]",
						"name": "",
						"type": "uint256[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					}
				],
				"name": "getUserNotificationCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "offset",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "limit",
						"type": "uint256"
					}
				],
				"name": "getUserNotifications",
				"outputs": [
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "id",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "userAddress",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "campaignId",
								"type": "uint256"
							},
							{
								"internalType": "uint8",
								"name": "notificationType",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "timestamp",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "relatedEntityId",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "data",
								"type": "string"
							}
						],
						"internalType": "struct Polytix.Notification[]",
						"name": "",
						"type": "tuple[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "_user",
						"type": "address"
					}
				],
				"name": "getUserRegistrationType",
				"outputs": [
					{
						"internalType": "enum Polytix.RegistrationType",
						"name": "",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_user",
						"type": "address"
					}
				],
				"name": "getUserVotedCampaigns",
				"outputs": [
					{
						"internalType": "uint256[]",
						"name": "",
						"type": "uint256[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "_user",
						"type": "address"
					}
				],
				"name": "hasUserVoted",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "operator",
						"type": "address"
					}
				],
				"name": "isApprovedForAll",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "isRegistrationOpen",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "_user",
						"type": "address"
					}
				],
				"name": "isUserRegistered",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "isVotingOpen",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "name",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "owner",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "ownerOf",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "pause",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "paused",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "statement",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "imageHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "passKey",
						"type": "string"
					}
				],
				"name": "registerAsCandidate",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "passKey",
						"type": "string"
					}
				],
				"name": "registerToVote",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "safeTransferFrom",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes"
					}
				],
				"name": "safeTransferFrom",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "operator",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "approved",
						"type": "bool"
					}
				],
				"name": "setApprovalForAll",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_newURI",
						"type": "string"
					}
				],
				"name": "setBaseImageURI",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_newURI",
						"type": "string"
					}
				],
				"name": "setCandidateImageURI",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes4",
						"name": "interfaceId",
						"type": "bytes4"
					}
				],
				"name": "supportsInterface",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "symbol",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					}
				],
				"name": "tokenByIndex",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					}
				],
				"name": "tokenOfOwnerByIndex",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "tokenToCampaign",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "tokenURI",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "totalSupply",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "transferFrom",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "unpause",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_candidateId",
						"type": "uint256"
					}
				],
				"name": "voteForCandidate",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_proposalId",
						"type": "uint256"
					}
				],
				"name": "voteForProposal",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "voterTokens",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		],
		"devdoc": {
			"author": "Original Author",
			"details": "A decentralized voting platform that supports both candidate-based and proposal-based voting campaigns. Features include: - NFT-based voting rights - Multiple voting types (candidate/proposal based) - Configurable voting restrictions - Registration system - Vote tracking and result calculation",
			"errors": {
				"ERC721EnumerableForbiddenBatchMint()": [
					{
						"details": "Batch mint is not allowed."
					}
				],
				"ERC721IncorrectOwner(address,uint256,address)": [
					{
						"details": "Indicates an error related to the ownership over a particular token. Used in transfers.",
						"params": {
							"owner": "Address of the current owner of a token.",
							"sender": "Address whose tokens are being transferred.",
							"tokenId": "Identifier number of a token."
						}
					}
				],
				"ERC721InsufficientApproval(address,uint256)": [
					{
						"details": "Indicates a failure with the `operator`’s approval. Used in transfers.",
						"params": {
							"operator": "Address that may be allowed to operate on tokens without being their owner.",
							"tokenId": "Identifier number of a token."
						}
					}
				],
				"ERC721InvalidApprover(address)": [
					{
						"details": "Indicates a failure with the `approver` of a token to be approved. Used in approvals.",
						"params": {
							"approver": "Address initiating an approval operation."
						}
					}
				],
				"ERC721InvalidOperator(address)": [
					{
						"details": "Indicates a failure with the `operator` to be approved. Used in approvals.",
						"params": {
							"operator": "Address that may be allowed to operate on tokens without being their owner."
						}
					}
				],
				"ERC721InvalidOwner(address)": [
					{
						"details": "Indicates that an address can't be an owner. For example, `address(0)` is a forbidden owner in ERC-20. Used in balance queries.",
						"params": {
							"owner": "Address of the current owner of a token."
						}
					}
				],
				"ERC721InvalidReceiver(address)": [
					{
						"details": "Indicates a failure with the token `receiver`. Used in transfers.",
						"params": {
							"receiver": "Address to which tokens are being transferred."
						}
					}
				],
				"ERC721InvalidSender(address)": [
					{
						"details": "Indicates a failure with the token `sender`. Used in transfers.",
						"params": {
							"sender": "Address whose tokens are being transferred."
						}
					}
				],
				"ERC721NonexistentToken(uint256)": [
					{
						"details": "Indicates a `tokenId` whose `owner` is the zero address.",
						"params": {
							"tokenId": "Identifier number of a token."
						}
					}
				],
				"ERC721OutOfBoundsIndex(address,uint256)": [
					{
						"details": "An `owner`'s token query was out of bounds for `index`. NOTE: The owner being `address(0)` indicates a global out of bounds index."
					}
				]
			},
			"events": {
				"Approval(address,address,uint256)": {
					"details": "Emitted when `owner` enables `approved` to manage the `tokenId` token."
				},
				"ApprovalForAll(address,address,bool)": {
					"details": "Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets."
				},
				"Paused(address)": {
					"details": "Emitted when the pause is triggered by `account`."
				},
				"Transfer(address,address,uint256)": {
					"details": "Emitted when `tokenId` token is transferred from `from` to `to`."
				},
				"Unpaused(address)": {
					"details": "Emitted when the pause is lifted by `account`."
				}
			},
			"kind": "dev",
			"methods": {
				"addProposal(uint256,string)": {
					"details": "Adds a new proposal to an existing campaign",
					"params": {
						"_campaignId": "The campaign ID",
						"proposalContent": "The proposal content"
					}
				},
				"approve(address,uint256)": {
					"details": "See {IERC721-approve}."
				},
				"balanceOf(address)": {
					"details": "See {IERC721-balanceOf}."
				},
				"burnMyVotingNFT(uint256)": {
					"details": "Burns a voting NFT after voting",
					"params": {
						"_campaignId": "The campaign ID"
					}
				},
				"constructor": {
					"details": "Constructor initializes the contract with basic settings"
				},
				"createCandidateBasedCampaign(string,uint8,uint8,uint256,uint256,uint256,string)": {
					"details": "Creates a new candidate-based campaign",
					"params": {
						"description": "Campaign description",
						"endTime": "Campaign end time",
						"maxVoters": "Maximum number of voters (for limited campaigns)",
						"passKey": "Registration passkey",
						"restriction": "Voting restriction type",
						"resultType": "Result calculation type",
						"startTime": "Campaign start time"
					}
				},
				"createProposalBasedCampaign(string,uint8,uint8,uint256,uint256,uint256,string,string[])": {
					"details": "Creates a new proposal-based campaign",
					"params": {
						"description": "Campaign description",
						"endTime": "Campaign end time",
						"maxVoters": "Maximum number of voters (for limited campaigns)",
						"passKey": "Registration passkey",
						"proposals": "Array of initial proposals",
						"restriction": "Voting restriction type",
						"resultType": "Result calculation type",
						"startTime": "Campaign start time"
					}
				},
				"getApproved(uint256)": {
					"details": "See {IERC721-getApproved}."
				},
				"getCampaignNotificationCount(uint256)": {
					"details": "Gets notification count for a campaign"
				},
				"getCampaignNotifications(uint256,uint256,uint256)": {
					"details": "Gets notifications for a campaign"
				},
				"getCandidateIds(uint256)": {
					"details": "Gets the number of candidates in a campaign",
					"params": {
						"_campaignId": "The campaign ID"
					},
					"returns": {
						"_0": "uint256 The number of candidates"
					}
				},
				"getCandidateInfo(uint256,uint256)": {
					"details": "Gets detailed information about a candidate",
					"params": {
						"_campaignId": "The campaign ID",
						"_candidateId": "The candidate ID"
					},
					"returns": {
						"_0": "Candidate information (address, name, statement, imageHash, voteCount)"
					}
				},
				"getCandidateName(uint256,uint256)": {
					"details": "Gets a candidate's name",
					"params": {
						"_campaignId": "The campaign ID",
						"_candidateId": "The candidate ID"
					},
					"returns": {
						"_0": "string The candidate's name"
					}
				},
				"getCandidates(uint256)": {
					"details": "Gets all candidates and their vote information",
					"params": {
						"_campaignId": "The campaign ID"
					},
					"returns": {
						"addresses": "Array of candidate addresses",
						"lastVoteTimestamps": "Array of last vote timestamps",
						"names": "Array of candidate names",
						"voteCounts": "Array of vote counts"
					}
				},
				"getCurrentCampaignStatus(uint256)": {
					"details": "Gets the current status of a campaign",
					"params": {
						"_campaignId": "The campaign ID"
					},
					"returns": {
						"_0": "CampaignStatus The current status"
					}
				},
				"getProposalContent(uint256,uint256)": {
					"details": "Gets the content of a proposal",
					"params": {
						"_campaignId": "The campaign ID",
						"_proposalId": "The proposal ID"
					},
					"returns": {
						"_0": "string The proposal content"
					}
				},
				"getProposalIds(uint256)": {
					"details": "Gets the number of proposals in a campaign",
					"params": {
						"_campaignId": "The campaign ID"
					},
					"returns": {
						"_0": "uint256 The number of proposals"
					}
				},
				"getProposalVoteCount(uint256,uint256)": {
					"details": "Gets the vote count for a proposal",
					"params": {
						"_campaignId": "The campaign ID",
						"_proposalId": "The proposal ID"
					},
					"returns": {
						"_0": "uint256 The vote count"
					}
				},
				"getProposals(uint256)": {
					"details": "Gets all proposals and their vote counts",
					"params": {
						"_campaignId": "The campaign ID"
					},
					"returns": {
						"contents": "Array of proposal contents",
						"voteCounts": "Array of vote counts"
					}
				},
				"getUserCreatedCampaigns(address)": {
					"details": "Gets all campaigns created by a user",
					"params": {
						"_user": "The user's address"
					},
					"returns": {
						"_0": "uint256[] Array of campaign IDs"
					}
				},
				"getUserNotificationCount(address)": {
					"details": "Gets notification count for a user"
				},
				"getUserNotifications(address,uint256,uint256)": {
					"details": "Gets notifications for a user"
				},
				"getUserRegistrationType(uint256,address)": {
					"details": "Gets a user's registration type for a campaign",
					"params": {
						"_campaignId": "The campaign ID",
						"_user": "The user's address"
					},
					"returns": {
						"_0": "RegistrationType The user's registration type"
					}
				},
				"getUserVotedCampaigns(address)": {
					"details": "Gets all campaigns a user has voted in",
					"params": {
						"_user": "The user's address"
					},
					"returns": {
						"_0": "uint256[] Array of campaign IDs"
					}
				},
				"hasUserVoted(uint256,address)": {
					"details": "Checks if a user has voted in a campaign",
					"params": {
						"_campaignId": "The campaign ID",
						"_user": "The user's address"
					},
					"returns": {
						"_0": "bool True if the user has voted"
					}
				},
				"isApprovedForAll(address,address)": {
					"details": "See {IERC721-isApprovedForAll}."
				},
				"isRegistrationOpen(uint256)": {
					"details": "Checks if registration is still open for a campaign",
					"params": {
						"_campaignId": "The campaign ID"
					},
					"returns": {
						"_0": "bool True if registration is open"
					}
				},
				"isUserRegistered(uint256,address)": {
					"details": "Checks if a user is registered for a campaign",
					"params": {
						"_campaignId": "The campaign ID",
						"_user": "The user's address"
					},
					"returns": {
						"_0": "bool True if the user is registered"
					}
				},
				"isVotingOpen(uint256)": {
					"details": "Checks if voting is currently open for a campaign",
					"params": {
						"_campaignId": "The campaign ID"
					},
					"returns": {
						"_0": "bool True if voting is open"
					}
				},
				"name()": {
					"details": "See {IERC721Metadata-name}."
				},
				"ownerOf(uint256)": {
					"details": "See {IERC721-ownerOf}."
				},
				"pause()": {
					"details": "Pauses all contract operations"
				},
				"paused()": {
					"details": "Returns true if the contract is paused, and false otherwise."
				},
				"registerAsCandidate(uint256,string,string,string,string)": {
					"details": "Registers a new candidate for a campaign",
					"params": {
						"_campaignId": "The campaign ID",
						"imageHash": "IPFS hash of candidate image",
						"name": "Candidate name",
						"passKey": "Registration passkey",
						"statement": "Candidate statement"
					}
				},
				"registerToVote(uint256,string)": {
					"details": "Registers a voter for a campaign",
					"params": {
						"_campaignId": "The campaign ID",
						"passKey": "Registration passkey"
					}
				},
				"safeTransferFrom(address,address,uint256)": {
					"details": "See {IERC721-safeTransferFrom}."
				},
				"safeTransferFrom(address,address,uint256,bytes)": {
					"details": "See {IERC721-safeTransferFrom}."
				},
				"setApprovalForAll(address,bool)": {
					"details": "See {IERC721-setApprovalForAll}."
				},
				"setBaseImageURI(string)": {
					"details": "Sets the base image URI for NFTs",
					"params": {
						"_newURI": "The new base URI"
					}
				},
				"setCandidateImageURI(string)": {
					"details": "Sets the candidate image URI for NFTs",
					"params": {
						"_newURI": "The new candidate URI"
					}
				},
				"supportsInterface(bytes4)": {
					"details": "See {IERC165-supportsInterface}."
				},
				"symbol()": {
					"details": "See {IERC721Metadata-symbol}."
				},
				"tokenByIndex(uint256)": {
					"details": "See {IERC721Enumerable-tokenByIndex}."
				},
				"tokenOfOwnerByIndex(address,uint256)": {
					"details": "See {IERC721Enumerable-tokenOfOwnerByIndex}."
				},
				"tokenURI(uint256)": {
					"details": "Returns the token URI for a given token ID",
					"params": {
						"tokenId": "The ID of the token"
					},
					"returns": {
						"_0": "string The token URI"
					}
				},
				"totalSupply()": {
					"details": "See {IERC721Enumerable-totalSupply}."
				},
				"transferFrom(address,address,uint256)": {
					"details": "See {IERC721-transferFrom}."
				},
				"unpause()": {
					"details": "Unpauses all contract operations"
				},
				"voteForCandidate(uint256,uint256)": {
					"details": "Casts a vote for a candidate",
					"params": {
						"_campaignId": "The campaign ID",
						"_candidateId": "The candidate ID"
					}
				},
				"voteForProposal(uint256,uint256)": {
					"details": "Casts a vote for a proposal",
					"params": {
						"_campaignId": "The campaign ID",
						"_proposalId": "The proposal ID"
					}
				}
			},
			"title": "Polytix",
			"version": 1
		},
		"userdoc": {
			"kind": "user",
			"methods": {},
			"version": 1
		}
	},
	"settings": {
		"compilationTarget": {
			"contracts/Poltix.sol": "Polytix"
		},
		"evmVersion": "cancun",
		"libraries": {},
		"metadata": {
			"bytecodeHash": "ipfs"
		},
		"optimizer": {
			"enabled": true,
			"runs": 200
		},
		"remappings": [],
		"viaIR": true
	},
	"sources": {
		"@openzeppelin/contracts/access/Ownable.sol": {
			"keccak256": "0xff6d0bb2e285473e5311d9d3caacb525ae3538a80758c10649a4d61029b017bb",
			"license": "MIT",
			"urls": [
				"bzz-raw://8ed324d3920bb545059d66ab97d43e43ee85fd3bd52e03e401f020afb0b120f6",
				"dweb:/ipfs/QmfEckWLmZkDDcoWrkEvMWhms66xwTLff9DDhegYpvHo1a"
			]
		},
		"@openzeppelin/contracts/interfaces/draft-IERC6093.sol": {
			"keccak256": "0x880da465c203cec76b10d72dbd87c80f387df4102274f23eea1f9c9b0918792b",
			"license": "MIT",
			"urls": [
				"bzz-raw://399594cd8bb0143bc9e55e0f1d071d0d8c850a394fb7a319d50edd55d9ed822b",
				"dweb:/ipfs/QmbPZzgtT6LEm9CMqWfagQFwETbV1ztpECBB1DtQHrKiRz"
			]
		},
		"@openzeppelin/contracts/security/Pausable.sol": {
			"keccak256": "0x0849d93b16c9940beb286a7864ed02724b248b93e0d80ef6355af5ef15c64773",
			"license": "MIT",
			"urls": [
				"bzz-raw://4ddabb16009cd17eaca3143feadf450ac13e72919ebe2ca50e00f61cb78bc004",
				"dweb:/ipfs/QmSPwPxX7d6TTWakN5jy5wsaGkS1y9TW8fuhGSraMkLk2B"
			]
		},
		"@openzeppelin/contracts/security/ReentrancyGuard.sol": {
			"keccak256": "0xa535a5df777d44e945dd24aa43a11e44b024140fc340ad0dfe42acf4002aade1",
			"license": "MIT",
			"urls": [
				"bzz-raw://41319e7f621f2dc3733511332c4fd032f8e32ad2aa7fd6f665c19741d9941a34",
				"dweb:/ipfs/QmcYR3bd862GD1Bc7jwrU9bGxrhUu5na1oP964bDCu2id1"
			]
		},
		"@openzeppelin/contracts/token/ERC721/ERC721.sol": {
			"keccak256": "0x39ed367e54765186281efcfe83e47cf0ad62cc879f10e191360712507125f29a",
			"license": "MIT",
			"urls": [
				"bzz-raw://2c5ae6d85bd48cca8d6d2fcec8c63efd86f56f8a5832577a47e403ce0e65cb09",
				"dweb:/ipfs/QmUtcS8AbRSWhuc61puYet58os8FvSqm329ChoW8wwZXZk"
			]
		},
		"@openzeppelin/contracts/token/ERC721/IERC721.sol": {
			"keccak256": "0x5dc63d1c6a12fe1b17793e1745877b2fcbe1964c3edfd0a482fac21ca8f18261",
			"license": "MIT",
			"urls": [
				"bzz-raw://6b7f97c5960a50fd1822cb298551ffc908e37b7893a68d6d08bce18a11cb0f11",
				"dweb:/ipfs/QmQQvxBytoY1eBt3pRQDmvH2hZ2yjhs12YqVfzGm7KSURq"
			]
		},
		"@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol": {
			"keccak256": "0xb5afb8e8eebc4d1c6404df2f5e1e6d2c3d24fd01e5dfc855314951ecfaae462d",
			"license": "MIT",
			"urls": [
				"bzz-raw://78586466c424f076c6a2a551d848cfbe3f7c49e723830807598484a1047b3b34",
				"dweb:/ipfs/Qmb717ovcFxm7qgNKEShiV6M9SPR3v1qnNpAGH84D6w29p"
			]
		},
		"@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol": {
			"keccak256": "0x5191f783af281c75b7de0f1e3e36cdc6ac5cb2358d929584c4953fd02fa2b5eb",
			"license": "MIT",
			"urls": [
				"bzz-raw://d3ca2689d95ba45e297e55c8f71112e3ccec701d0087cb5e1c6ecb1b9ce86f00",
				"dweb:/ipfs/QmNQ5xKxJpF9k7AahnmJYvg5XeGSYtRig2Lp2WHmWXyBze"
			]
		},
		"@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol": {
			"keccak256": "0x3d6954a93ac198a2ffa384fa58ccf18e7e235263e051a394328002eff4e073de",
			"license": "MIT",
			"urls": [
				"bzz-raw://1f58c799bd939d3951c94893e83ef86acd56989d1d7db7f9d180c515e29e28ff",
				"dweb:/ipfs/QmTgAxHAAys4kq9ZfU9YB24MWYoHLGAKSxnYUigPFrNW7g"
			]
		},
		"@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol": {
			"keccak256": "0x37d1aaaa5a2908a09e9dcf56a26ddf762ecf295afb5964695937344fc6802ce1",
			"license": "MIT",
			"urls": [
				"bzz-raw://ed0bfc1b92153c5000e50f4021367b931bbe96372ac6facec3c4961b72053d02",
				"dweb:/ipfs/Qmbwp8VDerjS5SV1quwHH1oMXxPQ93fzfLVqJ2RCqbowGE"
			]
		},
		"@openzeppelin/contracts/token/ERC721/utils/ERC721Utils.sol": {
			"keccak256": "0xddab643169f47a2c5291afafcbfdca045d9e6835553307d090bc048b6dabd0ac",
			"license": "MIT",
			"urls": [
				"bzz-raw://d0ffbacfee42977167b3c75bd4787f8b72a7ab1176abd544f3dff662c6528e24",
				"dweb:/ipfs/QmUprM1cWCyaQ3LDjHA2DhwiPs3wekQ6MWXHFZdMMxpcyX"
			]
		},
		"@openzeppelin/contracts/utils/Base64.sol": {
			"keccak256": "0xbee2b819e1b4bf569ffc1b1b9d560b4abd6a589575f3093edaab9244de18a0c2",
			"license": "MIT",
			"urls": [
				"bzz-raw://e478c0e9bbf3eb8cd3b7784f9b397603e34747f9ffd16571ed1d89ce102de389",
				"dweb:/ipfs/QmZ6zXpwy5xRxx9RkodJmDZSUTeEqPQUanAC5TUoYqW2VR"
			]
		},
		"@openzeppelin/contracts/utils/Context.sol": {
			"keccak256": "0x493033a8d1b176a037b2cc6a04dad01a5c157722049bbecf632ca876224dd4b2",
			"license": "MIT",
			"urls": [
				"bzz-raw://6a708e8a5bdb1011c2c381c9a5cfd8a9a956d7d0a9dc1bd8bcdaf52f76ef2f12",
				"dweb:/ipfs/Qmax9WHBnVsZP46ZxEMNRQpLQnrdE4dK8LehML1Py8FowF"
			]
		},
		"@openzeppelin/contracts/utils/Panic.sol": {
			"keccak256": "0xf7fe324703a64fc51702311dc51562d5cb1497734f074e4f483bfb6717572d7a",
			"license": "MIT",
			"urls": [
				"bzz-raw://c6a5ff4f9fd8649b7ee20800b7fa387d3465bd77cf20c2d1068cd5c98e1ed57a",
				"dweb:/ipfs/QmVSaVJf9FXFhdYEYeCEfjMVHrxDh5qL4CGkxdMWpQCrqG"
			]
		},
		"@openzeppelin/contracts/utils/Strings.sol": {
			"keccak256": "0x81c274a60a7ae232ae3dc9ff3a4011b4849a853c13b0832cd3351bb1bb2f0dae",
			"license": "MIT",
			"urls": [
				"bzz-raw://9da0c20dc74358a2a76330818f3bac9d1e2ce3371aec847b9cbf5d147fbae4f6",
				"dweb:/ipfs/QmeczhmnFv1hbXKGLwbYXY6Rrytc9a5A2YaRi5QMMgjPnb"
			]
		},
		"@openzeppelin/contracts/utils/introspection/ERC165.sol": {
			"keccak256": "0xddce8e17e3d3f9ed818b4f4c4478a8262aab8b11ed322f1bf5ed705bb4bd97fa",
			"license": "MIT",
			"urls": [
				"bzz-raw://8084aa71a4cc7d2980972412a88fe4f114869faea3fefa5436431644eb5c0287",
				"dweb:/ipfs/Qmbqfs5dRdPvHVKY8kTaeyc65NdqXRQwRK7h9s5UJEhD1p"
			]
		},
		"@openzeppelin/contracts/utils/introspection/IERC165.sol": {
			"keccak256": "0x79796192ec90263f21b464d5bc90b777a525971d3de8232be80d9c4f9fb353b8",
			"license": "MIT",
			"urls": [
				"bzz-raw://f6fda447a62815e8064f47eff0dd1cf58d9207ad69b5d32280f8d7ed1d1e4621",
				"dweb:/ipfs/QmfDRc7pxfaXB2Dh9np5Uf29Na3pQ7tafRS684wd3GLjVL"
			]
		},
		"@openzeppelin/contracts/utils/math/Math.sol": {
			"keccak256": "0x1225214420c83ebcca88f2ae2b50f053aaa7df7bd684c3e878d334627f2edfc6",
			"license": "MIT",
			"urls": [
				"bzz-raw://6c5fab4970634f9ab9a620983dc1c8a30153981a0b1a521666e269d0a11399d3",
				"dweb:/ipfs/QmVRnBC575MESGkEHndjujtR7qub2FzU9RWy9eKLp4hPZB"
			]
		},
		"@openzeppelin/contracts/utils/math/SafeCast.sol": {
			"keccak256": "0x195533c86d0ef72bcc06456a4f66a9b941f38eb403739b00f21fd7c1abd1ae54",
			"license": "MIT",
			"urls": [
				"bzz-raw://b1d578337048cad08c1c03041cca5978eff5428aa130c781b271ad9e5566e1f8",
				"dweb:/ipfs/QmPFKL2r9CBsMwmUqqdcFPfHZB2qcs9g1HDrPxzWSxomvy"
			]
		},
		"@openzeppelin/contracts/utils/math/SignedMath.sol": {
			"keccak256": "0xb1970fac7b64e6c09611e6691791e848d5e3fe410fa5899e7df2e0afd77a99e3",
			"license": "MIT",
			"urls": [
				"bzz-raw://db5fbb3dddd8b7047465b62575d96231ba8a2774d37fb4737fbf23340fabbb03",
				"dweb:/ipfs/QmVUSvooZKEdEdap619tcJjTLcAuH6QBdZqAzWwnAXZAWJ"
			]
		},
		"contracts/Poltix.sol": {
			"keccak256": "0x276fd706180f11dc58880e41583732931081b332e35bcdb946ab4cfc2396f76d",
			"license": "MIT",
			"urls": [
				"bzz-raw://a0658b921d94a39730616913ec99089110fcfd54c38eb5d2ad2850266f9ea6b0",
				"dweb:/ipfs/QmYgKKShvZrzLfVD8bFZLA9E3kJkCgifcVB6NLgwKWmZ2G"
			]
		}
	},
	"version": 1
}
export default metadata.output.abi