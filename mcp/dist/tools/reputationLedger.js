import {} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getPublicClient, getWalletClient, getAccount } from "../config/chain.js";
import { reputationLedgerAbi } from "../contracts/abi/reputation-ledger-abi.js";
import { CONTRACT_ADDRESSES } from "../contracts/index.js";
const ledgerAddress = CONTRACT_ADDRESSES.reputationLedger;
export function registerReputationLedgerTools(server) {
    // 1. createDeal
    server.tool("createDeal", "Propose a deal from a client agent to a worker agent", {
        worker: z.string().describe("Address of the worker agent being proposed"),
        dealId: z.string().describe("Unique identifier (bytes32 hex string) for this deal"),
        taskMetadataURI: z.string().describe("Off-chain URI pointing to the task description"),
    }, async ({ worker, dealId, taskMetadataURI }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: ledgerAddress,
                abi: reputationLedgerAbi,
                functionName: "createDeal",
                args: [worker, dealId, taskMetadataURI],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return {
                content: [{ type: "text", text: `Deal created successfully! Tx Hash: ${receipt.transactionHash}` }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error creating deal: ${error.message}` }],
                isError: true,
            };
        }
    });
    // 2. acceptDeal
    server.tool("acceptDeal", "Accept a proposed deal. Only callable by the deal's worker.", {
        dealId: z.string().describe("Unique identifier (bytes32 hex string) for this deal"),
    }, async ({ dealId }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: ledgerAddress,
                abi: reputationLedgerAbi,
                functionName: "acceptDeal",
                args: [dealId],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return {
                content: [{ type: "text", text: `Deal accepted successfully! Tx Hash: ${receipt.transactionHash}` }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error accepting deal: ${error.message}` }],
                isError: true,
            };
        }
    });
    // 3. rejectDeal
    server.tool("rejectDeal", "Reject a proposed deal. Only callable by the deal's worker.", {
        dealId: z.string().describe("Unique identifier (bytes32 hex string) for this deal"),
    }, async ({ dealId }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: ledgerAddress,
                abi: reputationLedgerAbi,
                functionName: "rejectDeal",
                args: [dealId],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return {
                content: [{ type: "text", text: `Deal rejected successfully! Tx Hash: ${receipt.transactionHash}` }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error rejecting deal: ${error.message}` }],
                isError: true,
            };
        }
    });
    // 4. completeDeal
    server.tool("completeDeal", "Mark an accepted deal as completed. Only callable by the deal's client.", {
        dealId: z.string().describe("Unique identifier (bytes32 hex string) for this deal"),
    }, async ({ dealId }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: ledgerAddress,
                abi: reputationLedgerAbi,
                functionName: "completeDeal",
                args: [dealId],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return {
                content: [{ type: "text", text: `Deal completed successfully! Tx Hash: ${receipt.transactionHash}` }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error completing deal: ${error.message}` }],
                isError: true,
            };
        }
    });
    // 5. submitReview
    server.tool("submitReview", "Submit a review for a completed deal. Only callable by the client.", {
        dealId: z.string().describe("Unique identifier (bytes32 hex string) for this deal"),
        score: z.number().describe("Score from 1 to 5"),
        tag: z.string().describe("Short label describing the experience (max 32 bytes)"),
    }, async ({ dealId, score, tag }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: ledgerAddress,
                abi: reputationLedgerAbi,
                functionName: "submitReview",
                args: [dealId, score, tag],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return {
                content: [{ type: "text", text: `Review submitted successfully! Tx Hash: ${receipt.transactionHash}` }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error submitting review: ${error.message}` }],
                isError: true,
            };
        }
    });
    // 6. getReputation
    server.tool("getReputation", "Get aggregate reputation data for an agent", {
        agentAddress: z.string().describe("The agent address to query"),
    }, async ({ agentAddress }) => {
        try {
            const publicClient = getPublicClient();
            const result = await publicClient.readContract({
                address: ledgerAddress,
                abi: reputationLedgerAbi,
                functionName: "getReputation",
                args: [agentAddress],
            });
            const avgScoreX100 = result[0];
            const reviewCount = result[1];
            const recent = result[2];
            const formattedResult = {
                avgScoreX100: avgScoreX100.toString(),
                reviewCount: reviewCount.toString(),
                recent: recent.map((r) => ({
                    reviewer: r.reviewer,
                    agent: r.agent,
                    score: r.score,
                    tag: r.tag,
                    dealId: r.dealId,
                    timestamp: r.timestamp.toString(),
                })),
            };
            return {
                content: [{ type: "text", text: JSON.stringify(formattedResult, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error fetching reputation: ${error.message}` }],
                isError: true,
            };
        }
    });
    // 7. getDeal
    server.tool("getDeal", "Get the full deal record for a given dealId", {
        dealId: z.string().describe("Unique identifier (bytes32 hex string) for this deal"),
    }, async ({ dealId }) => {
        try {
            const publicClient = getPublicClient();
            const deal = await publicClient.readContract({
                address: ledgerAddress,
                abi: reputationLedgerAbi,
                functionName: "getDeal",
                args: [dealId],
            });
            const formattedDeal = {
                client: deal.client,
                worker: deal.worker,
                status: deal.status,
                createdAt: deal.createdAt.toString(),
                acceptedAt: deal.acceptedAt.toString(),
                completedAt: deal.completedAt.toString(),
                taskMetadataURI: deal.taskMetadataURI,
            };
            return {
                content: [{ type: "text", text: JSON.stringify(formattedDeal, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error fetching deal: ${error.message}` }],
                isError: true,
            };
        }
    });
}
