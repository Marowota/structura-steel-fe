import { API_URL } from "@/constant/apiURL";
import {
  axiosRequestHandler,
  EToastType,
  extendedAxios,
  toastNotification,
} from "@/lib";
import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export type TDeleteError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TDeleteUserDTO = {
  userId: string;
};

export type TUseDeleteUserParams = {
  params: TDeleteUserDTO;
  options?: MutationOptions<unknown, TDeleteError, TDeleteUserDTO>;
};

const deleteUser = async ({ userId }: TDeleteUserDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.delete<string>(API_URL.userService.detail(userId)),
  );
  return response;
};

export const useDeleteUser = (
  { options }: TUseDeleteUserParams = {
    params: {
      userId: "",
    },
  },
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toastNotification("User deleted successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toastNotification(
        error.message || "Failed to delete user",
        EToastType.ERROR,
      );
    },
    ...options,
  });
  return { ...mutation };
};
