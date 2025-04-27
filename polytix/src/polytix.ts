import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  BaseImageURISet as BaseImageURISetEvent,
  CampaignCreated as CampaignCreatedEvent,
  CampaignStatusChanged as CampaignStatusChangedEvent,
  CandidateAdded as CandidateAddedEvent,
  CandidateImageURISet as CandidateImageURISetEvent,
  CandidateRegistered as CandidateRegisteredEvent,
  ContractPaused as ContractPausedEvent,
  ContractUnpaused as ContractUnpausedEvent,
  NFTBurned as NFTBurnedEvent,
  NotificationCreated as NotificationCreatedEvent,
  Paused as PausedEvent,
  ProposalAdded as ProposalAddedEvent,
  Transfer as TransferEvent,
  Unpaused as UnpausedEvent,
  VoteCapReached as VoteCapReachedEvent,
  VoteCast as VoteCastEvent,
  VoterRegistered as VoterRegisteredEvent
} from "../generated/Polytix/Polytix"
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
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBaseImageURISet(event: BaseImageURISetEvent): void {
  let entity = new BaseImageURISet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newURI = event.params.newURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  let entity = new CampaignCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.creator = event.params.creator
  entity.votingType = event.params.votingType
  entity.restriction = event.params.restriction
  entity.startTime = event.params.startTime
  entity.endTime = event.params.endTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCampaignStatusChanged(
  event: CampaignStatusChangedEvent
): void {
  let entity = new CampaignStatusChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.status = event.params.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCandidateAdded(event: CandidateAddedEvent): void {
  let entity = new CandidateAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.candidateId = event.params.candidateId
  entity.candidateAddress = event.params.candidateAddress
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCandidateImageURISet(
  event: CandidateImageURISetEvent
): void {
  let entity = new CandidateImageURISet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newURI = event.params.newURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCandidateRegistered(
  event: CandidateRegisteredEvent
): void {
  let entity = new CandidateRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.candidate = event.params.candidate
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContractPaused(event: ContractPausedEvent): void {
  let entity = new ContractPaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContractUnpaused(event: ContractUnpausedEvent): void {
  let entity = new ContractUnpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNFTBurned(event: NFTBurnedEvent): void {
  let entity = new NFTBurned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.voter = event.params.voter
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNotificationCreated(
  event: NotificationCreatedEvent
): void {
  let entity = new NotificationCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.userAddress = event.params.userAddress
  entity.campaignId = event.params.campaignId
  entity.notificationType = event.params.notificationType
  entity.timestamp = event.params.timestamp
  entity.relatedEntityId = event.params.relatedEntityId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProposalAdded(event: ProposalAddedEvent): void {
  let entity = new ProposalAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.proposalId = event.params.proposalId
  entity.content = event.params.content

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoteCapReached(event: VoteCapReachedEvent): void {
  let entity = new VoteCapReached(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.totalVotes = event.params.totalVotes

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoteCast(event: VoteCastEvent): void {
  let entity = new VoteCast(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.voter = event.params.voter
  entity.targetId = event.params.targetId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoterRegistered(event: VoterRegisteredEvent): void {
  let entity = new VoterRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.voter = event.params.voter
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
