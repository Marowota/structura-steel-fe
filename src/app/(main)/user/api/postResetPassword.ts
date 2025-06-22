import {
  axiosRequestHandler,
  EToastType,
  extendedAxios,
  toastNotification,
} from "@/lib";
import { API_URL } from "@/constant/apiURL";
import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export type PostResetPasswordDTO = {
  email: string;
  newPassword: string;
};

export type TResetPassword = {
  status: string;
  data: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostResetPasswordParams = {
  options?: MutationOptions<TResetPassword, TCreateError, PostResetPasswordDTO>;
};

const postResetPassword = async (data: PostResetPasswordDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TResetPassword, PostResetPasswordDTO>(
      API_URL.userService.resetPassword,
      data,
    ),
  );
  return response.data;
};

export const usePostResetPassword = ({
  options,
}: TUsePostResetPasswordParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["users"],
    mutationFn: postResetPassword,
    onSuccess: () => {
      toastNotification("Reset password successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
