// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./AgentRegistry.sol";

/// @title ReputationLedger
/// @notice On-chain job + review ledger giving AI agents a verifiable trust score
///         for agent-to-agent hiring. Designed as the on-chain backing for a Skill
///         API: create_job, accept_job, reject_job, complete_job, submit_review,
///         get_reputation.
contract ReputationLedger {
    AgentRegistry public immutable registry;

    enum JobStatus {
        None,       // 0 - job does not exist
        Created,    // 1 - client proposed the job, awaiting worker's acceptance
        Accepted,   // 2 - worker accepted, work in progress
        Rejected,   // 3 - worker declined the job (terminal)
        Completed,  // 4 - work marked complete, eligible for review
        Reviewed    // 5 - review submitted, job lifecycle finished (terminal)
    }

    struct Job {
        address client;         // agent who created the job (hiring agent)
        address worker;         // agent hired to do the work
        JobStatus status;
        uint256 createdAt;
        uint256 acceptedAt;
        uint256 completedAt;
        string taskMetadataURI; // off-chain pointer (e.g. ipfs://...) to the task spec/description
    }

    struct Review {
        address reviewer;  // = job.client
        address agent;     // = job.worker (agent being reviewed)
        uint8 score;       // 1-5
        string tag;        // short label e.g. "fast", "reliable", "low-quality"
        bytes32 jobId;
        uint256 timestamp;
    }

    /// @notice jobId => Job
    mapping(bytes32 => Job) public jobs;

    /// @notice agent address => list of reviews received
    mapping(address => Review[]) public reviewsReceived;

    /// @notice agent address => running sum of scores received (for cheap avg calc)
    mapping(address => uint256) public totalScore;

    uint8 public constant MIN_SCORE = 1;
    uint8 public constant MAX_SCORE = 5;
    uint256 public constant MAX_TAG_LENGTH = 32;
    uint256 public constant RECENT_REVIEWS_LIMIT = 5;

    event JobCreated(
        bytes32 indexed jobId,
        address indexed client,
        address indexed worker,
        string taskMetadataURI,
        uint256 timestamp
    );
    event JobAccepted(bytes32 indexed jobId, address indexed worker, uint256 timestamp);
    event JobRejected(bytes32 indexed jobId, address indexed worker, uint256 timestamp);
    event JobCompleted(bytes32 indexed jobId, address indexed client, address indexed worker, uint256 timestamp);
    event ReviewSubmitted(
        bytes32 indexed jobId,
        address indexed reviewer,
        address indexed agent,
        uint8 score,
        string tag,
        uint256 timestamp
    );

    error AgentNotRegistered(address agent);
    error AgentNotActive(address agent);
    error CannotHireSelf();
    error JobAlreadyExists();
    error JobDoesNotExist();
    error NotJobClient();
    error NotJobWorker();
    error InvalidJobStatusForAcceptance();
    error InvalidJobStatusForRejection();
    error InvalidJobStatusForCompletion();
    error InvalidJobStatusForReview();
    error InvalidScore();
    error TagTooLong();
    error ZeroJobId();

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

    /// @notice Propose a job: a registered client agent proposes hiring a registered worker agent.
    ///         The job remains in `Created` status until the worker calls `acceptJob` or `rejectJob`.
    /// @param worker Address of the worker agent being proposed.
    /// @param jobId Caller-supplied unique identifier for this job (e.g. keccak256 hash of off-chain task spec).
    /// @param taskMetadataURI Off-chain URI (e.g. ipfs://...) pointing to the task description/spec. Can be empty string.
    function createJob(address worker, bytes32 jobId, string calldata taskMetadataURI) external {
        if (jobId == bytes32(0)) revert ZeroJobId();
        if (worker == msg.sender) revert CannotHireSelf();

        _requireValidAgent(msg.sender, true);
        _requireValidAgent(worker, true);

        if (jobs[jobId].status != JobStatus.None) revert JobAlreadyExists();

        jobs[jobId] = Job({
            client: msg.sender,
            worker: worker,
            status: JobStatus.Created,
            createdAt: block.timestamp,
            acceptedAt: 0,
            completedAt: 0,
            taskMetadataURI: taskMetadataURI
        });

        emit JobCreated(jobId, msg.sender, worker, taskMetadataURI, block.timestamp);
    }

    /// @notice Accept a proposed job. Only callable by the job's worker.
    /// @param jobId The job to accept.
    function acceptJob(bytes32 jobId) external {
        Job storage job = jobs[jobId];
        if (job.status == JobStatus.None) revert JobDoesNotExist();
        if (msg.sender != job.worker) revert NotJobWorker();
        if (job.status != JobStatus.Created) revert InvalidJobStatusForAcceptance();

        job.status = JobStatus.Accepted;
        job.acceptedAt = block.timestamp;

        emit JobAccepted(jobId, msg.sender, block.timestamp);
    }

    /// @notice Reject a proposed job. Only callable by the job's worker. Terminal state.
    /// @param jobId The job to reject.
    function rejectJob(bytes32 jobId) external {
        Job storage job = jobs[jobId];
        if (job.status == JobStatus.None) revert JobDoesNotExist();
        if (msg.sender != job.worker) revert NotJobWorker();
        if (job.status != JobStatus.Created) revert InvalidJobStatusForRejection();

        job.status = JobStatus.Rejected;

        emit JobRejected(jobId, msg.sender, block.timestamp);
    }

    /// @notice Mark an accepted job as completed. Only callable by the job's client.
    /// @param jobId The job to mark complete.
    function completeJob(bytes32 jobId) external {
        Job storage job = jobs[jobId];
        if (job.status == JobStatus.None) revert JobDoesNotExist();
        if (msg.sender != job.client) revert NotJobClient();
        if (job.status != JobStatus.Accepted) revert InvalidJobStatusForCompletion();

        job.status = JobStatus.Completed;
        job.completedAt = block.timestamp;

        emit JobCompleted(jobId, job.client, job.worker, block.timestamp);
    }

    /// @notice Submit a review for a completed job. Only callable by the job's client,
    ///         and only once per job (enforced via job status transition).
    /// @param jobId The job being reviewed.
    /// @param score Score from 1 to 5.
    /// @param tag Short label describing the experience (max 32 bytes).
    function submitReview(bytes32 jobId, uint8 score, string calldata tag) external {
        Job storage job = jobs[jobId];
        if (job.status == JobStatus.None) revert JobDoesNotExist();
        if (msg.sender != job.client) revert NotJobClient();
        if (job.status != JobStatus.Completed) revert InvalidJobStatusForReview();
        if (score < MIN_SCORE || score > MAX_SCORE) revert InvalidScore();
        if (bytes(tag).length > MAX_TAG_LENGTH) revert TagTooLong();

        job.status = JobStatus.Reviewed;

        address worker = job.worker;

        reviewsReceived[worker].push(Review({
            reviewer: msg.sender,
            agent: worker,
            score: score,
            tag: tag,
            jobId: jobId,
            timestamp: block.timestamp
        }));

        totalScore[worker] += score;

        emit ReviewSubmitted(jobId, msg.sender, worker, score, tag, block.timestamp);
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

    /// @notice Get the full job record for a given jobId.
    function getJob(bytes32 jobId) external view returns (Job memory) {
        return jobs[jobId];
    }
}
