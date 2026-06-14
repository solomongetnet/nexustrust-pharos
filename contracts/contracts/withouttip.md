// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./AgentRegistry.sol";

/// @title ReputationLedger
/// @notice On-chain deal + review ledger giving AI agents a verifiable trust score
///         for agent-to-agent hiring. Designed as the on-chain backing for a Skill
///         API: create_deal, accept_deal, reject_deal, complete_deal, submit_review,
///         get_reputation.
contract ReputationLedger {
    AgentRegistry public immutable registry;

    enum DealStatus {
        None,       // 0 - deal does not exist
        Created,    // 1 - client proposed the deal, awaiting worker's acceptance
        Accepted,   // 2 - worker accepted, work in progress
        Rejected,   // 3 - worker declined the deal (terminal)
        Completed,  // 4 - work marked complete, eligible for review
        Reviewed    // 5 - review submitted, deal lifecycle finished (terminal)
    }

    struct Deal {
        address client;         // agent who created the deal (hiring agent)
        address worker;         // agent hired to do the work
        DealStatus status;
        uint256 createdAt;
        uint256 acceptedAt;
        uint256 completedAt;
        string taskMetadataURI; // off-chain pointer (e.g. ipfs://...) to the task spec/description
    }

    struct Review {
        address reviewer;  // = deal.client
        address agent;     // = deal.worker (agent being reviewed)
        uint8 score;       // 1-5
        string tag;        // short label e.g. "fast", "reliable", "low-quality"
        bytes32 dealId;
        uint256 timestamp;
    }

    /// @notice dealId => Deal
    mapping(bytes32 => Deal) public deals;

    /// @notice agent address => list of reviews received
    mapping(address => Review[]) public reviewsReceived;

    /// @notice agent address => running sum of scores received (for cheap avg calc)
    mapping(address => uint256) public totalScore;

    uint8 public constant MIN_SCORE = 1;
    uint8 public constant MAX_SCORE = 5;
    uint256 public constant MAX_TAG_LENGTH = 32;
    uint256 public constant RECENT_REVIEWS_LIMIT = 5;

    event DealCreated(
        bytes32 indexed dealId,
        address indexed client,
        address indexed worker,
        string taskMetadataURI,
        uint256 timestamp
    );
    event DealAccepted(bytes32 indexed dealId, address indexed worker, uint256 timestamp);
    event DealRejected(bytes32 indexed dealId, address indexed worker, uint256 timestamp);
    event DealCompleted(bytes32 indexed dealId, address indexed client, address indexed worker, uint256 timestamp);
    event ReviewSubmitted(
        bytes32 indexed dealId,
        address indexed reviewer,
        address indexed agent,
        uint8 score,
        string tag,
        uint256 timestamp
    );

    error AgentNotRegistered(address agent);
    error AgentNotActive(address agent);
    error CannotHireSelf();
    error DealAlreadyExists();
    error DealDoesNotExist();
    error NotDealClient();
    error NotDealWorker();
    error InvalidDealStatusForAcceptance();
    error InvalidDealStatusForRejection();
    error InvalidDealStatusForCompletion();
    error InvalidDealStatusForReview();
    error InvalidScore();
    error TagTooLong();
    error ZeroDealId();

    constructor(address registryAddress) {
        registry = AgentRegistry(registryAddress);
    }

    /// @dev Reverts unless `agent` is registered (and active, if requireActive is true).
    function _requireValidAgent(address agent, bool requireActive) internal view {
        if (!registry.isRegistered(agent)) revert AgentNotRegistered(agent);
        if (requireActive) {
            (, , , bool active) = _agentTuple(agent);
            if (!active) revert AgentNotActive(agent);
        }
    }

    function _agentTuple(address agent) internal view returns (address, string memory, uint256, bool) {
        AgentRegistry.Agent memory a = registry.getAgent(agent);
        return (a.agentAddress, a.metadataURI, a.registeredAt, a.active);
    }

    /// @notice Propose a deal: a registered client agent proposes hiring a registered worker agent.
    ///         The deal remains in `Created` status until the worker calls `acceptDeal` or `rejectDeal`.
    /// @param worker Address of the worker agent being proposed.
    /// @param dealId Caller-supplied unique identifier for this deal (e.g. keccak256 hash of off-chain task spec).
    /// @param taskMetadataURI Off-chain URI (e.g. ipfs://...) pointing to the task description/spec. Can be empty string.
    function createDeal(address worker, bytes32 dealId, string calldata taskMetadataURI) external {
        if (dealId == bytes32(0)) revert ZeroDealId();
        if (worker == msg.sender) revert CannotHireSelf();

        _requireValidAgent(msg.sender, true);
        _requireValidAgent(worker, true);

        if (deals[dealId].status != DealStatus.None) revert DealAlreadyExists();

        deals[dealId] = Deal({
            client: msg.sender,
            worker: worker,
            status: DealStatus.Created,
            createdAt: block.timestamp,
            acceptedAt: 0,
            completedAt: 0,
            taskMetadataURI: taskMetadataURI
        });

        emit DealCreated(dealId, msg.sender, worker, taskMetadataURI, block.timestamp);
    }

    /// @notice Accept a proposed deal. Only callable by the deal's worker.
    /// @param dealId The deal to accept.
    function acceptDeal(bytes32 dealId) external {
        Deal storage deal = deals[dealId];
        if (deal.status == DealStatus.None) revert DealDoesNotExist();
        if (msg.sender != deal.worker) revert NotDealWorker();
        if (deal.status != DealStatus.Created) revert InvalidDealStatusForAcceptance();

        deal.status = DealStatus.Accepted;
        deal.acceptedAt = block.timestamp;

        emit DealAccepted(dealId, msg.sender, block.timestamp);
    }

    /// @notice Reject a proposed deal. Only callable by the deal's worker. Terminal state.
    /// @param dealId The deal to reject.
    function rejectDeal(bytes32 dealId) external {
        Deal storage deal = deals[dealId];
        if (deal.status == DealStatus.None) revert DealDoesNotExist();
        if (msg.sender != deal.worker) revert NotDealWorker();
        if (deal.status != DealStatus.Created) revert InvalidDealStatusForRejection();

        deal.status = DealStatus.Rejected;

        emit DealRejected(dealId, msg.sender, block.timestamp);
    }

    /// @notice Mark an accepted deal as completed. Only callable by the deal's client.
    /// @param dealId The deal to mark complete.
    function completeDeal(bytes32 dealId) external {
        Deal storage deal = deals[dealId];
        if (deal.status == DealStatus.None) revert DealDoesNotExist();
        if (msg.sender != deal.client) revert NotDealClient();
        if (deal.status != DealStatus.Accepted) revert InvalidDealStatusForCompletion();

        deal.status = DealStatus.Completed;
        deal.completedAt = block.timestamp;

        emit DealCompleted(dealId, deal.client, deal.worker, block.timestamp);
    }

    /// @notice Submit a review for a completed deal. Only callable by the deal's client,
    ///         and only once per deal (enforced via deal status transition).
    /// @param dealId The deal being reviewed.
    /// @param score Score from 1 to 5.
    /// @param tag Short label describing the experience (max 32 bytes).
    function submitReview(bytes32 dealId, uint8 score, string calldata tag) external {
        Deal storage deal = deals[dealId];
        if (deal.status == DealStatus.None) revert DealDoesNotExist();
        if (msg.sender != deal.client) revert NotDealClient();
        if (deal.status != DealStatus.Completed) revert InvalidDealStatusForReview();
        if (score < MIN_SCORE || score > MAX_SCORE) revert InvalidScore();
        if (bytes(tag).length > MAX_TAG_LENGTH) revert TagTooLong();

        deal.status = DealStatus.Reviewed;

        address worker = deal.worker;

        reviewsReceived[worker].push(Review({
            reviewer: msg.sender,
            agent: worker,
            score: score,
            tag: tag,
            dealId: dealId,
            timestamp: block.timestamp
        }));

        totalScore[worker] += score;

        emit ReviewSubmitted(dealId, msg.sender, worker, score, tag, block.timestamp);
    }

    /// @notice Get aggregate reputation data for an agent.
    /// @param agent The agent address to query.
    /// @return avgScoreX100 Average score scaled by 100 (e.g. 450 = 4.50). Returns 0 if no reviews.
    /// @return reviewCount Total number of reviews received.
    /// @return recent Up to the most recent RECENT_REVIEWS_LIMIT reviews, newest first.
    function getReputation(address agent)
        external
        view
        returns (uint256 avgScoreX100, uint256 reviewCount, Review[] memory recent)
    {
        Review[] storage all = reviewsReceived[agent];
        reviewCount = all.length;

        if (reviewCount == 0) {
            return (0, 0, new Review[](0));
        }

        avgScoreX100 = (totalScore[agent] * 100) / reviewCount;

        uint256 limit = reviewCount < RECENT_REVIEWS_LIMIT ? reviewCount : RECENT_REVIEWS_LIMIT;
        recent = new Review[](limit);

        for (uint256 i = 0; i < limit; i++) {
            recent[i] = all[reviewCount - 1 - i];
        }
    }

    /// @notice Get the full deal record for a given dealId.
    function getDeal(bytes32 dealId) external view returns (Deal memory) {
        return deals[dealId];
    }
}
