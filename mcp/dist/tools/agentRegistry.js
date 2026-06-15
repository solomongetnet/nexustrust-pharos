import {} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getPublicClient, getWalletClient, getAccount } from "../config/chain.js";
import { agentRegistryAbi } from "../contracts/abi/agent-registry-abi.js";
import { CONTRACT_ADDRESSES } from "../contracts/index.js";
const registryAddress = CONTRACT_ADDRESSES.agentRegistry;
export function registerAgentRegistryTools(server) {
    // 1. registerAgent
    server.tool("registerAgent", "Register a new AI agent on the Pharos Agent Registry", {
        agentAddress: z.string().describe("The wallet address of the agent"),
        metadataURI: z.string().describe("Off-chain URI (e.g. IPFS) pointing to agent metadata JSON"),
    }, async ({ agentAddress, metadataURI }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "registerAgent",
                args: [agentAddress, metadataURI],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return {
                content: [{ type: "text", text: `Agent registered successfully! Tx Hash: ${receipt.transactionHash}` }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error registering agent: ${error.message}` }],
                isError: true,
            };
        }
    });
    // 2. updateMetadata
    server.tool("updateMetadata", "Update the metadata URI for an existing agent", {
        agentAddress: z.string().describe("The wallet address of the agent"),
        newMetadataURI: z.string().describe("The new off-chain metadata URI"),
    }, async ({ agentAddress, newMetadataURI }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "updateMetadata",
                args: [agentAddress, newMetadataURI],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return {
                content: [{ type: "text", text: `Metadata updated successfully! Tx Hash: ${receipt.transactionHash}` }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error updating metadata: ${error.message}` }],
                isError: true,
            };
        }
    });
    // 3. deactivateAgent
    server.tool("deactivateAgent", "Deactivate an agent (mark as inactive/retired)", {
        agentAddress: z.string().describe("The wallet address of the agent"),
    }, async ({ agentAddress }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "deactivateAgent",
                args: [agentAddress],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return {
                content: [{ type: "text", text: `Agent deactivated successfully! Tx Hash: ${receipt.transactionHash}` }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error deactivating agent: ${error.message}` }],
                isError: true,
            };
        }
    });
    // 4. reactivateAgent
    server.tool("reactivateAgent", "Reactivate a previously deactivated agent", {
        agentAddress: z.string().describe("The wallet address of the agent"),
    }, async ({ agentAddress }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "reactivateAgent",
                args: [agentAddress],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return {
                content: [{ type: "text", text: `Agent reactivated successfully! Tx Hash: ${receipt.transactionHash}` }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error reactivating agent: ${error.message}` }],
                isError: true,
            };
        }
    });
    // 5. getAgent
    server.tool("getAgent", "Get full agent info by address", {
        agentAddress: z.string().describe("The wallet address of the agent"),
    }, async ({ agentAddress }) => {
        try {
            const publicClient = getPublicClient();
            const agent = await publicClient.readContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "getAgent",
                args: [agentAddress],
            });
            // Convert bigints to strings for JSON serialization
            const formattedAgent = {
                agentAddress: agent.agentAddress,
                metadataURI: agent.metadataURI,
                tokenId: agent.tokenId.toString(),
                registeredAt: agent.registeredAt.toString(),
                active: agent.active,
            };
            return {
                content: [{ type: "text", text: JSON.stringify(formattedAgent, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error fetching agent: ${error.message}` }],
                isError: true,
            };
        }
    });
    // 6. getAllAgents
    server.tool("getAllAgents", "Get a paginated list of all registered agents", {
        offset: z.number().describe("Starting index (0-based)"),
        limit: z.number().describe("Number of agents to return"),
    }, async ({ offset, limit }) => {
        try {
            const publicClient = getPublicClient();
            const agents = await publicClient.readContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "getAllAgents",
                args: [BigInt(offset), BigInt(limit)],
            });
            const formattedAgents = agents.map((agent) => ({
                agentAddress: agent.agentAddress,
                metadataURI: agent.metadataURI,
                tokenId: agent.tokenId.toString(),
                registeredAt: agent.registeredAt.toString(),
                active: agent.active,
            }));
            return {
                content: [{ type: "text", text: JSON.stringify(formattedAgents, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error fetching agents: ${error.message}` }],
                isError: true,
            };
        }
    });
    // 7. isActive
    server.tool("isActive", "Check whether an address is a registered and active agent", {
        agentAddress: z.string().describe("The wallet address of the agent"),
    }, async ({ agentAddress }) => {
        try {
            const publicClient = getPublicClient();
            const active = await publicClient.readContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "isActive",
                args: [agentAddress],
            });
            return {
                content: [{ type: "text", text: `Agent Active Status: ${active}` }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error checking active status: ${error.message}` }],
                isError: true,
            };
        }
    });
}
