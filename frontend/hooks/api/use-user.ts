import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./base";

export interface User {
  id: string;
  walletAddress: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetOrCreateUserRequest {
  walletAddress: string;
}

interface GetOrCreateUserResponse {
  user: User;
  message: string;
}

export const useGetOrCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GetOrCreateUserRequest): Promise<GetOrCreateUserResponse> => {
      const response = await api.post("/api/users/get-or-create", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user query
      queryClient.invalidateQueries({ queryKey: ["user", data.user.walletAddress] });
      queryClient.setQueryData(["user", data.user.walletAddress], data.user);
    },
  });
};

export const useGetUserByWalletAddress = (walletAddress?: string) => {
  return useQuery({
    queryKey: ["user", walletAddress],
    queryFn: async (): Promise<User> => {
      const response = await api.get(`/api/users/wallet/${walletAddress}`);
      return response.data.user;
    },
    enabled: !!walletAddress,
  });
};