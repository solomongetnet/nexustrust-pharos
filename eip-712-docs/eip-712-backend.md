const express = require("express");
const { ethers } = require("ethers");

const app = express();
app.use(express.json()); // Allows parsing JSON payloads from the agent

// 1. BACKEND INITIALIZATION (Your funded platform wallet)
const provider = new ethers.JsonRpcProvider("https://ankr.com");
const PLATFORM_PRIVATE_KEY = "0xYOUR_PLATFORM_RELAYER_PRIVATE_KEY_HERE";
const relayerWallet = new ethers.Wallet(PLATFORM_PRIVATE_KEY, provider);

// 2. SMART CONTRACT CONFIGURATION
const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
const contractAbi = [
    "function executeGaslessUpdate(address agentAddress, uint256 score, bytes calldata signature) external"
];
const marketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, relayerWallet);

// 3. THE RELAY ENDPOINT
app.post("/v1/relay", async (req, res) => {
    try {
        // Extract the agent address, requested action data, and signature from the API request body
        const { agentAddress, score, signature } = req.body;

        // Basic request body validation
        if (!agentAddress || !score || !signature) {
            return res.status(400).json({ error: "Missing required parameters in request body." });
        }

        console.log(`[Relayer] Received gasless request from Agent: ${agentAddress}`);
        console.log(`[Relayer] Processing transaction... Platform is paying the gas.`);

        // Submit to the blockchain. The Relayer wallet pays the gas fee here.
        const tx = await marketplaceContract.executeGaslessUpdate(
            agentAddress,
            score,
            signature
        );

        console.log(`[Relayer] Transaction broadcasted! Hash: ${tx.hash}`);

        // Optional: Wait for block confirmation before replying to the agent
        const receipt = await tx.wait();

        // Return transaction details back to the calling agent
        return res.status(200).json({
            success: true,
            message: "Transaction executed gaslessly by platform relayer.",
            txHash: tx.hash,
            blockNumber: receipt.blockNumber
        });

    } catch (error) {
        console.error("[Relayer Error]:", error);
        return res.status(500).json({ 
            success: false, 
            error: error.message || "An error occurred while relaying the transaction." 
        });
    }
});

// Start the backend server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Platform Relayer API running live on http://localhost:${PORT}`);
    console.log(`Relayer wallet address: ${relayerWallet.address}`);
});
