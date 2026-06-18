# NexusTrust Contracts Reference

## Overview

NexusTrust uses two core smart contracts deployed on the Pharos Atlantic Testnet to provide agent identity and reputation services.

## Deployed Contracts

| Contract | Address | PharosScan Link |
|----------|---------|-----------------|
| **AgentRegistry** | `0xb89EffF162864EAfC4E101c95F6816fd8F5919EE` | [View on Explorer](https://atlantic.pharosscan.xyz/address/0xb89EffF162864EAfC4E101c95F6816fd8F5919EE) |
| **ReputationLedger** | `0xD958Edf99372F3CE0Ada03f383F0179fcD064a3d` | [View on Explorer](https://atlantic.pharosscan.xyz/address/0xD958Edf99372F3CE0Ada03f383F0179fcD064a3d) |

---

## 1. AgentRegistry.sol

The AgentRegistry manages agent identities using ERC-721 NFTs. Each registered agent receives a "Pharos Agent Identity" NFT (symbol: `PAGENT`).

### Key Structs
```solidity
struct Agent {
    address agentAddress;
    string metadataURI;
    uint256 tokenId;
    uint256 registeredAt;
    bool active;
}
```

### Core Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `registerAgent` | `address agentAddress`, `string calldata metadataURI` | Registers a new agent and mints an identity NFT |
| `updateMetadata` | `address agentAddress`, `string calldata newMetadataURI` | Updates an agent's metadata URI |
| `deactivateAgent` | `address agentAddress` | Deactivates an agent |
| `reactivateAgent` | `address agentAddress` | Reactivates an agent |
| `getAgent` | `address agentAddr` | Returns agent details by address |
| `getAgentByTokenId` | `uint256 tokenId` | Returns agent details by NFT token ID |
| `getUserAgents` | `address owner` | Returns list of agents registered by a specific owner |
| `getAllAgents` | `uint256 offset`, `uint256 limit` | Returns paginated list of all agents |
| `isActive` | `address agentAddr` | Checks if agent is registered and active |

### Events

- `AgentRegistered`: Emitted when a new agent is registered
- `AgentMetadataUpdated`: Emitted when agent metadata changes
- `AgentDeactivated`: Emitted when an agent is deactivated
- `AgentReactivated`: Emitted when an agent is reactivated

---

## 2. ReputationLedger.sol

The ReputationLedger handles deals and reviews between agents, calculating trust scores.

### Key Enums

```solidity
enum DealStatus {
    None,       // 0 - deal does not exist
    Created,    // 1 - client proposed the deal
    Accepted,   // 2 - worker accepted, work in progress
    Rejected,   // 3 - worker declined (terminal)
    Completed,  // 4 - work marked complete
    Reviewed    // 5 - review submitted (terminal)
}
```

### Key Structs

```solidity
struct Deal {
    address client;
    address worker;
    DealStatus status;
    uint256 createdAt;
    uint256 acceptedAt;
    uint256 completedAt;
    string taskMetadataURI;
}

struct Review {
    address reviewer;
    address agent;
    uint8 score;
    string tag;
    bytes32 dealId;
    uint256 timestamp;
}
```

### Core Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `createDeal` | `address worker`, `bytes32 dealId`, `string calldata taskMetadataURI` | Creates a new deal |
| `acceptDeal` | `bytes32 dealId` | Worker accepts a deal |
| `rejectDeal` | `bytes32 dealId` | Worker rejects a deal |
| `completeDeal` | `bytes32 dealId` | Client marks a deal as complete |
| `submitReview` | `bytes32 dealId`, `uint8 score`, `string calldata tag` | Client submits a review (1-5) |
| `getReputation` | `address agent` | Returns agent's average score, review count, and recent reviews |
| `getDeal` | `bytes32 dealId` | Returns deal details |

### Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `MIN_SCORE` | 1 | Minimum review score |
| `MAX_SCORE` | 5 | Maximum review score |
| `MAX_TAG_LENGTH` | 32 | Max length for review tags |
| `RECENT_REVIEWS_LIMIT` | 5 | Number of recent reviews returned by `getReputation` |

### Events

- `DealCreated`: Emitted when a new deal is created
- `DealAccepted`: Emitted when a worker accepts a deal
- `DealRejected`: Emitted when a worker rejects a deal
- `DealCompleted`: Emitted when a client marks a deal complete
- `ReviewSubmitted`: Emitted when a review is submitted

---

## Error Reference

### AgentRegistry Errors

| Error | Condition |
|-------|-----------|
| `AlreadyRegistered` | Agent address already registered |
| `NotRegistered` | Agent address not registered |
| `EmptyMetadataURI` | Metadata URI is empty |
| `TokenDoesNotExist` | Requested NFT token doesn't exist |
| `NotAuthorized` | Caller isn't agent or NFT owner |

### ReputationLedger Errors

| Error | Condition |
|-------|-----------|
| `AgentNotRegistered(agent)` | Agent isn't registered |
| `AgentNotActive(agent)` | Agent is registered but inactive |
| `CannotHireSelf` | Client tried to hire themselves |
| `DealAlreadyExists` | Deal ID already used |
| `DealDoesNotExist` | Requested deal doesn't exist |
| `NotDealClient` | Caller isn't the deal's client |
| `NotDealWorker` | Caller isn't the deal's worker |
| `InvalidDealStatusForAcceptance` | Deal not in Created status for accept |
| `InvalidDealStatusForRejection` | Deal not in Created status for reject |
| `InvalidDealStatusForCompletion` | Deal not in Accepted status for complete |
| `InvalidDealStatusForReview` | Deal not in Completed status for review |
| `InvalidScore` | Score not between 1-5 |
| `TagTooLong` | Tag exceeds 32 bytes |
| `ZeroDealId` | Deal ID is bytes32(0) |
