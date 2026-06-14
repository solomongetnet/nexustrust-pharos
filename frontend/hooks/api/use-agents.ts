import { useQuery } from "@tanstack/react-query";
import { useReadContract } from "wagmi";
import { agentRegistryAbi } from "@/contracts/abi/agent-registry-abi";
import { CONTRACT_ADDRESSES } from "@/contracts";
import { pharosTestnet } from "@/lib/wagmi";

interface AgentOnChain {
    agentAddress: `0x${string}`;
    metadataURI: string;
    tokenId: bigint;
    registeredAt: bigint;
    active: boolean;
}

interface AgentMetadata {
    name: string;
    description?: string;
    image?: string;
    agentAddress: string;
    version?: string;
    skills?: string[];
    tags?: string[];
    socials?: {
        website?: string;
        github?: string;
    };
}

export interface AgentWithMetadata extends Omit<AgentOnChain, 'tokenId' | 'registeredAt'> {
    tokenId: string;
    registeredAt: string;
    metadata?: AgentMetadata;
    metadataLoading?: boolean;
    metadataError?: Error;
}

// Fetch metadata from IPFS gateway
async function fetchMetadata(metadataURI: string): Promise<AgentMetadata | null> {
    try {
        if (!metadataURI) return null;
        const ipfsGateway = "https://gateway.pinata.cloud/ipfs/";
        const ipfsPath = metadataURI.replace("ipfs://", "");
        const response = await fetch(`${ipfsGateway}${ipfsPath}`);
        if (!response.ok) {
            throw new Error("Failed to fetch metadata");
        }
        return await response.json();
    } catch (error) {
        console.error("[useAgents] Error fetching metadata:", error);
        return null;
    }
}

export function useAgents() {
    // First, get total agent count
    const {
        data: totalAgents,
        isLoading: totalLoading,
        error: totalError,
    } = useReadContract({
        abi: agentRegistryAbi,
        address: CONTRACT_ADDRESSES.agentRegistry,
        functionName: "getTotalAgentCount",
        chainId: pharosTestnet.id,
        query: {
            select: (data) => Number(data),
        },
    });

    // Then fetch all agents
    const {
        data: agentsRaw,
        isLoading: agentsLoading,
        error: agentsError,
        refetch,
    } = useReadContract({
        abi: agentRegistryAbi,
        address: CONTRACT_ADDRESSES.agentRegistry,
        functionName: "getAllAgents",
        args: [BigInt(0), totalAgents ? BigInt(totalAgents) : BigInt(0)],
        chainId: pharosTestnet.id,
    });

    // Convert BigInts to strings for serialization
    const agents: AgentWithMetadata[] = agentsRaw
        ? (agentsRaw as AgentOnChain[]).map((agent) => ({
            ...agent,
            tokenId: agent.tokenId.toString(),
            registeredAt: agent.registeredAt.toString(),
        }))
        : [];

    // Then fetch metadata for each agent
    const {
        data: agentsWithMetadata,
        isLoading: metadataLoading,
        error: metadataError,
    } = useQuery({
        queryKey: ["agents-metadata"],
        queryFn: async () => {
            if (!agents || agents.length === 0) return [];
            const agentsData = await Promise.all(
                agents.map(async (agent): Promise<AgentWithMetadata> => {
                    try {
                        const metadata = await fetchMetadata(agent.metadataURI);
                        return { ...agent, metadata };
                    } catch (error) {
                        return { ...agent, metadata: undefined };
                    }
                })
            );
            return agentsData;
        },
        enabled: !!agents && agents.length > 0,
    });

    const isLoading = totalLoading || agentsLoading || metadataLoading;
    const error = totalError || agentsError || metadataError;

    return {
        agents: agentsWithMetadata || agents,
        isLoading,
        error,
        refetch,
    };
}
