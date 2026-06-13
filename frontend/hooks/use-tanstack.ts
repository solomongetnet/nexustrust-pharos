import { useQueryClient } from "@tanstack/react-query";

export function useRefetchAllQueries() {
  const queryClient = useQueryClient();

  const refetchAll = async () => {
    // Invalidate all queries
    const result = await queryClient.invalidateQueries({
      predicate: () => true,
    });

    // Then force refetch
    await queryClient.refetchQueries({
      predicate: () => true,
    });

    return result;
  };

  return refetchAll;
}
