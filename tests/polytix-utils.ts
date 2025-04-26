import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  BaseImageURISet,
  CampaignCreated,
  CampaignStatusChanged,
  CandidateAdded,
  CandidateImageURISet,
  CandidateRegistered,
  ContractPaused,
  ContractUnpaused,
  NFTBurned,
  NotificationCreated,
  Paused,
  ProposalAdded,
  Transfer,
  Unpaused,
  VoteCapReached,
  VoteCast,
  VoterRegistered
} from "../generated/Polytix/Polytix"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBaseImageURISetEvent(newURI: string): BaseImageURISet {
  let baseImageUriSetEvent = changetype<BaseImageURISet>(newMockEvent())

  baseImageUriSetEvent.parameters = new Array()

  baseImageUriSetEvent.parameters.push(
    new ethereum.EventParam("newURI", ethereum.Value.fromString(newURI))
  )

  return baseImageUriSetEvent
}

export function createCampaignCreatedEvent(
  campaignId: BigInt,
  creator: Address,
  votingType: i32,
  restriction: i32,
  startTime: BigInt,
  endTime: BigInt
): CampaignCreated {
  let campaignCreatedEvent = changetype<CampaignCreated>(newMockEvent())

  campaignCreatedEvent.parameters = new Array()

  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "votingType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(votingType))
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "restriction",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(restriction))
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "startTime",
      ethereum.Value.fromUnsignedBigInt(startTime)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )

  return campaignCreatedEvent
}

export function createCampaignStatusChangedEvent(
  campaignId: BigInt,
  status: i32
): CampaignStatusChanged {
  let campaignStatusChangedEvent =
    changetype<CampaignStatusChanged>(newMockEvent())

  campaignStatusChangedEvent.parameters = new Array()

  campaignStatusChangedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  campaignStatusChangedEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )

  return campaignStatusChangedEvent
}

export function createCandidateAddedEvent(
  campaignId: BigInt,
  candidateId: BigInt,
  candidateAddress: Address,
  name: string
): CandidateAdded {
  let candidateAddedEvent = changetype<CandidateAdded>(newMockEvent())

  candidateAddedEvent.parameters = new Array()

  candidateAddedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  candidateAddedEvent.parameters.push(
    new ethereum.EventParam(
      "candidateId",
      ethereum.Value.fromUnsignedBigInt(candidateId)
    )
  )
  candidateAddedEvent.parameters.push(
    new ethereum.EventParam(
      "candidateAddress",
      ethereum.Value.fromAddress(candidateAddress)
    )
  )
  candidateAddedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return candidateAddedEvent
}

export function createCandidateImageURISetEvent(
  newURI: string
): CandidateImageURISet {
  let candidateImageUriSetEvent =
    changetype<CandidateImageURISet>(newMockEvent())

  candidateImageUriSetEvent.parameters = new Array()

  candidateImageUriSetEvent.parameters.push(
    new ethereum.EventParam("newURI", ethereum.Value.fromString(newURI))
  )

  return candidateImageUriSetEvent
}

export function createCandidateRegisteredEvent(
  campaignId: BigInt,
  candidate: Address,
  tokenId: BigInt
): CandidateRegistered {
  let candidateRegisteredEvent = changetype<CandidateRegistered>(newMockEvent())

  candidateRegisteredEvent.parameters = new Array()

  candidateRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  candidateRegisteredEvent.parameters.push(
    new ethereum.EventParam("candidate", ethereum.Value.fromAddress(candidate))
  )
  candidateRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return candidateRegisteredEvent
}

export function createContractPausedEvent(operator: Address): ContractPaused {
  let contractPausedEvent = changetype<ContractPaused>(newMockEvent())

  contractPausedEvent.parameters = new Array()

  contractPausedEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )

  return contractPausedEvent
}

export function createContractUnpausedEvent(
  operator: Address
): ContractUnpaused {
  let contractUnpausedEvent = changetype<ContractUnpaused>(newMockEvent())

  contractUnpausedEvent.parameters = new Array()

  contractUnpausedEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )

  return contractUnpausedEvent
}

export function createNFTBurnedEvent(
  campaignId: BigInt,
  voter: Address,
  tokenId: BigInt
): NFTBurned {
  let nftBurnedEvent = changetype<NFTBurned>(newMockEvent())

  nftBurnedEvent.parameters = new Array()

  nftBurnedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  nftBurnedEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  )
  nftBurnedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return nftBurnedEvent
}

export function createNotificationCreatedEvent(
  id: BigInt,
  userAddress: Address,
  campaignId: BigInt,
  notificationType: i32,
  timestamp: BigInt,
  relatedEntityId: BigInt
): NotificationCreated {
  let notificationCreatedEvent = changetype<NotificationCreated>(newMockEvent())

  notificationCreatedEvent.parameters = new Array()

  notificationCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  notificationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "userAddress",
      ethereum.Value.fromAddress(userAddress)
    )
  )
  notificationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  notificationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "notificationType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(notificationType))
    )
  )
  notificationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  notificationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "relatedEntityId",
      ethereum.Value.fromUnsignedBigInt(relatedEntityId)
    )
  )

  return notificationCreatedEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createProposalAddedEvent(
  campaignId: BigInt,
  proposalId: BigInt,
  content: string
): ProposalAdded {
  let proposalAddedEvent = changetype<ProposalAdded>(newMockEvent())

  proposalAddedEvent.parameters = new Array()

  proposalAddedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  proposalAddedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  proposalAddedEvent.parameters.push(
    new ethereum.EventParam("content", ethereum.Value.fromString(content))
  )

  return proposalAddedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createVoteCapReachedEvent(
  campaignId: BigInt,
  totalVotes: BigInt
): VoteCapReached {
  let voteCapReachedEvent = changetype<VoteCapReached>(newMockEvent())

  voteCapReachedEvent.parameters = new Array()

  voteCapReachedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  voteCapReachedEvent.parameters.push(
    new ethereum.EventParam(
      "totalVotes",
      ethereum.Value.fromUnsignedBigInt(totalVotes)
    )
  )

  return voteCapReachedEvent
}

export function createVoteCastEvent(
  campaignId: BigInt,
  voter: Address,
  targetId: BigInt
): VoteCast {
  let voteCastEvent = changetype<VoteCast>(newMockEvent())

  voteCastEvent.parameters = new Array()

  voteCastEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam(
      "targetId",
      ethereum.Value.fromUnsignedBigInt(targetId)
    )
  )

  return voteCastEvent
}

export function createVoterRegisteredEvent(
  campaignId: BigInt,
  voter: Address,
  tokenId: BigInt
): VoterRegistered {
  let voterRegisteredEvent = changetype<VoterRegistered>(newMockEvent())

  voterRegisteredEvent.parameters = new Array()

  voterRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  voterRegisteredEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  )
  voterRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return voterRegisteredEvent
}
