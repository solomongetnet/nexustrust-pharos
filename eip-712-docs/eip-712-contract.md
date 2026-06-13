Here is the complete, self-contained Solidity Smart Contract for your Pharos Hackathon submission.
It is designed to receive the payload from your Express.js backend, verify the agent's signature using the EIP-712 standard, and update the marketplace reputation scores safely.
## The Solidity Smart Contract

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/**
 * @title PharosAgentMarketplace
 * @notice Handles gasless reputation updates for autonomous AI agents using EIP-712 signatures.
 */
contract PharosAgentMarketplace is EIP712 {
    using ECDSA for bytes32;

    // 1. TYPEHASH definition: This must exactly match your off-chain JavaScript types object structure.
    bytes32 private constant UPDATE_REPUTATION_TYPEHASH = keccak256(
        "UpdateReputation(address agentAddress,uint256 score,uint256 nonce)"
    );

    // 2. STATE STORAGE
    // Prevents replay attacks by ensuring each signature can only be processed once
    mapping(address => uint256) public nonces;
    
    // Stores the actual marketplace reputation scores for your agents
    mapping(address => uint256) public agentReputation;

    // 3. EVENTS (Crucial for frontend tracking and hackathon scoring logs)
    event ReputationUpdated(address indexed agent, uint256 newScore, address indexed relayer);

    /**
     * @notice Constructor initializes the EIP-712 Domain Separator.
     * @dev "PharosMarket" is the app name, and "1" is the signing version string.
     */
    constructor() EIP712("PharosMarket", "1") {}

    /**
     * @notice Executed gaslessly via the Platform Relayer backend API.
     * @param agentAddress The public key identity of the autonomous agent.
     * @param score The new reputation score requested by the agent.
     * @param signature The EIP-712 cryptographic signature generated off-chain by the agent.
     */
    function executeGaslessUpdate(
        address agentAddress,
        uint256 score,
        bytes calldata signature
    ) external {
        // Step A: Reconstruct the structural hash matching the off-chain layout
        // It includes the current nonce of the agent to ensure uniqueness
        bytes32 structHash = keccak256(
            abi.encode(
                UPDATE_REPUTATION_TYPEHASH,
                agentAddress,
                score,
                nonces[agentAddress]
            )
        );

        // Step B: Mix the structHash with the Domain Separator to create the finalized EIP-712 digest
        bytes32 digest = _hashTypedDataV4(structHash);

        // Step C: Cryptographically recover the public key address of the signer
        address recoveredSigner = digest.recover(signature);

        // Step D: Validate Identity — Throw an error if a hacker/wrong agent signed this message
        require(recoveredSigner == agentAddress, "PharosAuth: Invalid Agent Signature");

        // Step E: Invalidate this specific signature by incrementing the nonce permanently
        nonces[agentAddress]++;

        // Step F: Execute state change using 'agentAddress' as the authenticated identity context
        agentReputation[agentAddress] = score;

        // Step G: Emit an event so indexers and frontends know the state changed gaslessly
        emit ReputationUpdated(agentAddress, score, msg.sender);
    }
}

## Key Technical Explanations for Judges:

* _hashTypedDataV4(structHash): This is a built-in OpenZeppelin function that automatically combines your data parameters with the security environment context (like chainId and verifyingContract), completely stopping cross-network exploit replays.
* nonces[agentAddress]++: By updating this counter right before saving the state, the exact same signature string will cause a complete transaction failure if your Express backend or an outside malicious actor tries to replay the packet.

------------------------------
Would you like help creating a deployment script (using Hardhat or Viem) to get this contract live on your target Pharos test network?

