import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'wagmi';
import { agentRegistryAbi } from '@/contracts/abi/agent-registry-abi';
import { reputationLedgerAbi } from '@/contracts/abi/reputation-ledger-abi';
import { CONTRACT_ADDRESSES } from '@/contracts';
import { pharosTestnet } from '@/lib/wagmi';

interface AgentMetadata {
  name?: string;
  description?: string;
  image?: string;
  version?: string;
  skills?: string[];
  tags?: string[];
  socials?: {
    website?: string;
    github?: string;
  };
}

interface Review {
  reviewer: `0x${string}`;
  agent: `0x${string}`;
  score: number;
  tag: string;
  dealId: `0x${string}`;
  timestamp: bigint;
}

interface AgentDetailData {
  agentData: any;
  reputationData: any;
  metadata: AgentMetadata | null;
}

export function useAgentDetail(agentAddress: `0x${string}`) {
  // Get agent from Agent Registry
  const {
    data: agentData,
    isLoading: agentLoading,
    error: agentError,
  } = useReadContract({
    abi: agentRegistryAbi,
    address: CONTRACT_ADDRESSES.agentRegistry,
    functionName: 'getAgent',
    args: [agentAddress],
    chainId: pharosTestnet.id,
  });

  // Get reputation from Reputation Ledger
  const {
    data: reputationData,
    isLoading: reputationLoading,
    error: reputationError,
  } = useReadContract({
    abi: reputationLedgerAbi,
    address: CONTRACT_ADDRESSES.reputationLedger,
    functionName: 'getReputation',
    args: [agentAddress],
    chainId: pharosTestnet.id,
  });

  // Access via object properties, not array indices!
  const metadataURI = agentData?.metadataURI;
  console.log("useAgentDetail - metadataURI:", metadataURI);
  console.log("useAgentDetail - agentData:", agentData);
  
  // Fetch metadata from IPFS
  const {
    data: metadata,
    isLoading: metadataLoading,
    error: metadataError,
  } = useQuery({
    queryKey: ['agent-metadata', agentAddress, metadataURI],
    queryFn: async () => {
      if (!metadataURI) return null;
      try {
        const ipfsGateway = 'https://gateway.pinata.cloud/ipfs/';
        const ipfsPath = metadataURI.replace('ipfs://', '');
        const response = await fetch(`${ipfsGateway}${ipfsPath}`);
        if (!response.ok) throw new Error('Failed to fetch metadata');
        return await response.json();
      } catch (err) {
        console.error('Error fetching metadata:', err);
        return null;
      }
    },
    enabled: !!metadataURI,
  });

  const isLoading = agentLoading || reputationLoading || metadataLoading;
  const error = agentError || reputationError || metadataError;

  return {
    agentData,
    reputationData,
    metadata,
    isLoading,
    error,
  };
}
