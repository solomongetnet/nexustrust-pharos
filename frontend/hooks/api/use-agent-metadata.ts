import { useMutation } from "@tanstack/react-query";
import { api } from "./base";

interface AgentMetadata {
  name: string;
  description: string;
  image?: string;
  agentAddress: string;
  owner?: string;
  version?: string;
  skills?: string[];
  tags?: string[];
  socials?: {
    website?: string;
    github?: string;
  };
}

interface UploadMetadataResponse {
  ipfsHash: string;
  ipfsUrl: string;
  metadata: AgentMetadata;
}

export const useUploadAgentMetadata = () => {
  return useMutation({
    mutationFn: async (metadata: AgentMetadata) => {
      const response = await api.post<UploadMetadataResponse>("/api/metadata/agent", metadata);
      return response.data;
    },
  });
};
