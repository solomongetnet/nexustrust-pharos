import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient, getWalletClient, getAccount } from "../../config/chain.js";
import { agentRegistryAbi } from "../../contracts/abi/agent-registry-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const registryAddress = CONTRACT_ADDRESSES.agentRegistry;
export const registerAgentTool = new DynamicStructuredTool({
    name: "registerAgent",
    description: "Register a new AI agent on the Pharos Agent Registry by providing metadata which will be uploaded to IPFS automatically",
    schema: z.object({
        name: z.string().describe("Name of the agent"),
        description: z.string().describe("Description of the agent"),
        image: z.string().optional().describe("Image URL of the agent"),
        owner: z.string().optional().describe("Owner address of the agent"),
        version: z.string().optional().describe("Version of the agent"),
        skills: z.array(z.string()).optional().describe("Skills of the agent"),
        tags: z.array(z.string()).optional().describe("Tags of the agent"),
        socials: z.object({
            website: z.string().optional(),
            github: z.string().optional(),
        }).optional().describe("Social links of the agent"),
    }),
    func: async ({ name, description, image, owner, version, skills, tags, socials }) => {
        try {
            const account = getAccount();
            const agentAddress = account.address;
            // 1. Upload metadata to backend
            const metadata = {
                name,
                description,
                image,
                agentAddress,
                owner,
                version,
                skills,
                tags,
                socials,
            };
            const baseUrl = process.env.BACKEND_URL || "https://nexustrust-backend.solomongetnet.site";
            const response = await fetch(`${baseUrl}/api/metadata/agent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(metadata),
            });
            if (!response.ok) {
                throw new Error(`Failed to upload metadata to backend: ${response.statusText}`);
            }
            const uploadData = await response.json();
            const metadataURI = uploadData.ipfsUrl;
            if (!metadataURI) {
                throw new Error("Backend did not return a valid ipfsUrl");
            }
            // 2. Register agent on-chain
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const { request } = await publicClient.simulateContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "registerAgent",
                args: [agentAddress, metadataURI],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            const explorerUrl = `https://atlantic.pharosscan.xyz/tx/${receipt.transactionHash}`;
            return `Agent registered successfully!\nMetadata IPFS URL: ${metadataURI}\nExplorer URL: ${explorerUrl}\nTx Hash: ${receipt.transactionHash}`;
        }
        catch (error) {
            return `Error registering agent: ${error.message}`;
        }
    },
});
