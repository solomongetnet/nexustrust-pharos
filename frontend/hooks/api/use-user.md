import { getUsersForAdminAction } from "@/server/actions/admin/users.admin.actions";
import {
  getUserForUpdateAction,
  updateUserAction,
} from "@/server/actions/user.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      username: string;
      profileImage: File | Blob | null;
    }) => updateUserAction(data),
    onSuccess: ({ success, error, message }) => {
      if (success && message) {
        queryClient.invalidateQueries({ queryKey: ["user_data_for_update"] });
        toast.message(message);
      } else {
        toast.error(error?.message);
      }
    },
  });
};

export const useGetUserForUpdateQuery = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["user_data_for_update"],
    queryFn: () => getUserForUpdateAction(),
    enabled,
  });
};

// -------------admin----------------------
export const useGetUsersForAdminQuery = (params: {
  page: number;
  limit: number;
  sortField: any | undefined;
  sortDirection: any | undefined;
  role: any | undefined;
  status: any | undefined;
  search: string | undefined;
}) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsersForAdminAction(params),
  });
};
