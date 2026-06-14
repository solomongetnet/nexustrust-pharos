import { useMemo } from "react";
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
    console.error("[useUserAgents] Error fetching metadata:", error);
    return null;
  }
}

// Helper to fetch a single agent's data
async function fetchSingleAgent(agentAddress: `0x${string}`): Promise<AgentOnChain | null> {
  try {
    // We'll use fetch to call the contract via wagmi's readContract (but since we can't call hooks in async, let's use viem-like approach via API or another method)
    // Wait, better to use getAllAgents and then filter!
    return null;
  } catch (error) {
    console.error("Failed to fetch agent:", agentAddress, error);
    return null;
  }
}

export function useUserAgents(userAddress?: `0x${string}`) {
  // Step 1: Get user's agent addresses
  const {
    data: userAgentAddresses,
    isLoading: addressesLoading,
    error: addressesError,
  } = useReadContract({
    abi: agentRegistryAbi,
    address: CONTRACT_ADDRESSES.agentRegistry,
    functionName: "getUserAgents",
    args: userAddress ? [userAddress] : undefined,
    chainId: pharosTestnet.id,
    query: {
      enabled: !!userAddress,
    },
  });

  // Step 2: Get ALL agents (easier) then filter by user's agent addresses
  const {
    data: allAgents,
    isLoading: allAgentsLoading,
    error: allAgentsError,
  } = useReadContract({
    abi: agentRegistryAbi,
    address: CONTRACT_ADDRESSES.agentRegistry,
    functionName: "getAllAgents",
    args: [BigInt(0), BigInt(1000)], // Get up to first 1000 agents
    chainId: pharosTestnet.id,
    query: {
      enabled: true,
    },
  });

  // Step 3: Filter all agents to only include user's agents
  const userAgents = useMemo(() => {
    if (!userAgentAddresses || !allAgents) return [];
    return (allAgents as AgentOnChain[]).filter((agent) => 
      (userAgentAddresses as `0x${string}`[]).includes(agent.agentAddress)
    );
  }, [userAgentAddresses, allAgents]);

  // Step 4: Convert BigInt properties to strings
  const processedAgents: AgentWithMetadata[] = userAgents.map((agent) => ({
    ...agent,
    tokenId: agent.tokenId.toString(),
    registeredAt: agent.registeredAt.toString(),
  }));

  // Step 5: Fetch metadata for each agent
  const {
    data: agentsWithMetadata,
    isLoading: metadataLoading,
    error: metadataError,
  } = useQuery({
    queryKey: ["user-agents-metadata", processedAgents],
    queryFn: async () => {
      if (!processedAgents || processedAgents.length === 0) return [];
      const agentsData = await Promise.all(
        processedAgents.map(async (agent): Promise<AgentWithMetadata> => {
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
    enabled: !!processedAgents && processedAgents.length > 0,
  });

  // Combine all loading/error states
  const isLoading = addressesLoading || allAgentsLoading || metadataLoading;
  const error = addressesError || allAgentsError || metadataError;

  return {
    agents: agentsWithMetadata || processedAgents,
    isLoading,
    error,
  };
}
