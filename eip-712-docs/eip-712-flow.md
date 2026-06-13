Here is the complete, production-ready blueprint for your Pharos Hackathon submission. It includes the complete flow and the clean, self-contained code for both the Frontend/Agent script and the Solidity Smart Contract.
## The 4-Step Hackathon Flow

   1. The Request: The Agent wants to call a marketplace function (e.g., updateReputation).
   2. The Sign (EIP-712): The Agent signs the action parameters off-chain. Cost = $0 gas.
   3. The Relay: Your platform API receives the payload and signature. Your platform private key wraps it in a blockchain transaction and pays the gas fee.
   4. The Verify: Your Smart Contract checks the signature. It extracts the Agent's identity, confirms it is authentic, and updates the marketplace state.

------------------------------
## 1. The Smart Contract (Solidity)
This contract inherits OpenZeppelin's native EIP-712 utilities. It handles the domain separator hashing and the cryptographic identity recovery.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract PharosAgentMarketplace is EIP712 {
    using ECDSA for bytes32;

    // Define the exact struct layout matching the off-chain data format
    bytes32 private constant UPDATE_REPUTATION_TYPEHASH = keccak256(
        "UpdateReputation(address agentAddress,uint256 score,uint256 nonce)"
    );

    // Track nonces per agent to completely prevent replay attacks
    mapping(address => uint256) public nonces;
    // Mock storage to track agent reputation scores
    mapping(address => uint256) public agentReputation;

    // "PharosMarket" is the app name, "1" is the version for the Domain Separator
    constructor() EIP712("PharosMarket", "1") {}

    /**
     * @notice Executed by the Platform Relayer. The Relayer pays the gas.
     * @param agentAddress The identity of the autonomous agent.
     * @param score The new reputation score to register.
     * @param signature The EIP-712 cryptographic signature created by the agent.
     */
    function executeGaslessUpdate(
        address agentAddress,
        uint256 score,
        bytes calldata signature
    ) external {
        // 1. Reconstruct the EIP-712 typed struct hash using current state nonce
        bytes32 structHash = keccak256(
            abi.encode(
                UPDATE_REPUTATION_TYPEHASH,
                agentAddress,
                score,
                nonces[agentAddress]
            )
        );

        // 2. Combine the struct hash with the EIP-712 Domain Separator
        bytes32 digest = _hashTypedDataV4(structHash);

        // 3. Cryptographically recover the signer's public key (address)
        address recoveredSigner = digest.recover(signature);

        // 4. Validate Identity: Ensure the signature matches the agent's address
        require(recoveredSigner == agentAddress, "PharosAuth: Invalid Agent Signature");

        // 5. Success! Increment nonce to invalidate this signature from being used again
        nonces[agentAddress]++;

        // 6. Execute business logic under the context of the verified agent identity
        agentReputation[agentAddress] = score;
    }
}

------------------------------
## 2. The Execution Script (JavaScript / Ethers.js)
This script demonstrates the Agent signing the payload for free, and your Platform Relayer broadcasting it using its funded wallet.

const { ethers } = require("ethers");
// 1. INITIALIZE ACTORS// Agent has an identity (private key) but NO gas money (0 ETH)const agentWallet = ethers.Wallet.createRandom();
// Platform Backend Relayer has money to pay the network gas feesconst provider = new ethers.JsonRpcProvider("https://ankr.com"); // Use your target testnet RPCconst relayerWallet = new ethers.Wallet("0xYOUR_PLATFORM_RELAYER_PRIVATE_KEY", provider);
const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";
// 2. CONFIGURING THE SPECIFIC EIP-712 DOMAINconst domain = {
    name: "PharosMarket",
    version: "1",
    chainId: 11155111, // Sepolia Testnet ID (or Pharos testnet ID)
    verifyingContract: CONTRACT_ADDRESS
};
// 3. DEFINE THE DATA TYPESconst types = {
    UpdateReputation: [
        { name: "agentAddress", type: "address" },
        { name: "score", type: "uint256" },
        { name: "nonce", type: "uint256" }
    ]
};
async function main() {
    console.log(`Agent Identity Address: ${agentWallet.address}`);
    console.log(`Relayer Gas Payer Address: ${relayerWallet.address}\n`);

    // =======================================================
    // STEP 1: OFF-CHAIN AGENT SIGNING (FREE)
    // =======================================================
    // Prepare transaction arguments. Assume nonce is 0 for a new agent.
    const message = {
        agentAddress: agentWallet.address,
        score: 95, // Setting reputation score to 95
        nonce: 0   
    };

    // Agent signs the payload purely mathematically. Gas cost = $0.00
    const signature = await agentWallet.signTypedData(domain, types, message);
    console.log("[-] Step 1: Agent signed payload off-chain successfully.");
    console.log(`    Signature: ${signature}\n`);

    // =======================================================
    // STEP 2: PLATFORM RELAYER EXECUTION (PAYS GAS)
    // =======================================================
    console.log("[-] Step 2: Relayer submitting transaction to blockchain...");

    // Connect to contract instance using the funded Relayer wallet
    const contractAbi = [
        "function executeGaslessUpdate(address agentAddress, uint256 score, bytes calldata signature) external"
    ];
    const marketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, relayerWallet);

    // Relayer sends the transaction and covers all gas costs
    const tx = await marketplaceContract.executeGaslessUpdate(
        message.agentAddress,
        message.score,
        signature
    );

    console.log(`[-] Step 3: Transaction broadcasted. Waiting for confirmation...`);
    const receipt = await tx.wait();
    
    console.log(`\n[+] SUCCESS! Transaction mined in block: ${receipt.blockNumber}`);
    console.log(`    Tx Hash: ${tx.hash}`);
}

main().catch((error) => {
    console.error("Flow failed:", error);
});

------------------------------
Would you like to write a GitHub README feature snippet highlighting this architecture so you can easily copy-paste it into your Pharos project submission?

