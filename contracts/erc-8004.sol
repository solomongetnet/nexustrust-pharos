// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IERC8004IdentityRegistry
 * @notice Interface defining the core ERC-8004 Identity Registry standard.
 */
 
interface IERC8004IdentityRegistry {
    event AgentRegistered(uint256 indexed agentId, address indexed owner, string agentURI);
    event AgentWalletUpdated(uint256 indexed agentId, address indexed newWallet);

    function registerAgent(string calldata agentURI, address agentWallet) external returns (uint256);
    function getAgentWallet(uint256 agentId) external view returns (address);
}

/**
 * @title IERC8004ReputationRegistry
 * @notice Interface defining the core ERC-8004 Reputation Registry standard.
 */
interface IERC8004ReputationRegistry {
    event FeedbackSubmitted(
        uint256 indexed agentId, 
        address indexed client, 
        int128 score, 
        string[] tags, 
        bytes32 paymentProofHash
    );

    function submitFeedback(
        uint256 agentId,
        int128 score,
        string[] calldata tags,
        bytes32 paymentProofHash
    ) external;
}

/**
 * @title ERC8004TrustlessAgents
 * @notice Combined reference implementation of the ERC-8004 Identity and Reputation registries.
 */
contract ERC8004TrustlessAgents is ERC721URIStorage, Ownable, IERC8004IdentityRegistry, IERC8004ReputationRegistry {
    uint256 private _nextAgentId;

    // Maps AgentId to their active operational machine wallet address
    mapping(uint256 => address) private _agentWallets;
    
    // Maps operational wallet address back to the active AgentID token
    mapping(address => uint256) private _walletToAgentId;

    // Reputation Storage: AgentId => Category Tag => Aggregated Score (Fixed-point representation)
    mapping(uint256 => mapping(string => int128)) public domainScores;
    mapping(uint256 => mapping(string => uint256)) public totalReviewsByDomain;

    // Anti-Spam Guardrail: Maps payment validation hashes (e.g., x402 receipt hashes) to burn states
    mapping(bytes32 => bool) public processedPayments;

    constructor() ERC721("ERC-8004 Trustless Agent Passport", "AGENT") Ownable(msg.sender) {}

    /**
     * @notice Registers a new autonomous entity into the global identity index.
     * @param agentURI The remote URI pointing to the off-chain "Agent Card" JSON schema.
     * @param agentWallet The cryptographic hot-wallet the agent utilizes to sign transactional actions.
     */
    function registerAgent(
        string calldata agentURI, 
        address agentWallet
    ) external override returns (uint256) {
        require(agentWallet != address(0), "Invalid operational wallet address");
        require(_walletToAgentId[agentWallet] == 0, "Wallet already bound to an identity");

        uint256 currentId = ++_nextAgentId;
        
        _safeMint(msg.sender, currentId);
        _setTokenURI(currentId, agentURI);
        
        _agentWallets[currentId] = agentWallet;
        _walletToAgentId[agentWallet] = currentId;

        emit AgentRegistered(currentId, msg.sender, agentURI);
        emit AgentWalletUpdated(currentId, agentWallet);

        return currentId;
    }

    /**
     * @notice Submits verifiable, multidimensional runtime feedback against an active agent identity.
     * @param agentId The target agent token identifier receiving evaluation data.
     * @param score The performance measurement score bounded as an int128 value.
     * @param tags Categorical domain contexts identifying specific evaluation vectors (e.g., ["coding", "defi"]).
     * @param paymentProofHash Cryptographic tracking hash verifying an x402 payment settlement trace.
     */
    function submitFeedback(
        uint256 agentId,
        int128 score,
        string[] calldata tags,
        bytes32 paymentProofHash
    ) external override {
        require(_ownerOf(agentId) != address(0), "Target agent identity does not exist");
        require(!processedPayments[paymentProofHash], "Duplicate interaction token: payment trace already spent");
        require(score >= 0 && score <= 100, "Scores must sit on a standard 0-100 baseline mapping");
        require(tags.length > 0, "Must provide at least one domain specialization metric");

        // Process and consume payment receipt token to prevent Sybil review generation
        processedPayments[paymentProofHash] = true;

        for (uint256 i = 0; i < tags.length; i++) {
            string memory currentTag = tags[i];
            
            uint256 currentCount = totalReviewsByDomain[agentId][currentTag];
            int128 currentAverage = domainScores[agentId][currentTag];

            // Perform rolling historical average aggregation
            domainScores[agentId][currentTag] = ((currentAverage * int128(int256(currentCount))) + score) / int128(int256(currentCount + 1));
            totalReviewsByDomain[agentId][currentTag] = currentCount + 1;
        }

        emit FeedbackSubmitted(agentId, msg.sender, score, tags, paymentProofHash);
    }

    /**
     * @notice Resolves an agent token identity identifier back to its current active signing wallet address.
     */
    function getAgentWallet(uint256 agentId) external view override returns (address) {
        address wallet = _agentWallets[agentId];
        require(wallet != address(0), "Requested agent identity is uninitialized or dead");
        return wallet;
    }

    /**
     * @notice Backwards compatibility resolution lookup to identify the underlying AgentId from a signing wallet.
     */
    function getAgentIdByWallet(address wallet) external view returns (uint256) {
        return _walletToAgentId[wallet];
    }
}