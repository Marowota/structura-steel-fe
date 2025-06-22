import { API_URL } from "@/constant/apiURL";
import { extendedAxios, EToastType, toastNotification } from "@/lib";
import { MutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";

export type PostForgotPasswordDTO = {
  email: string;
};

export type TForgotPassword = {
  status: string;
  data: string;
};

export type TError = {
  timestamp?: string;
  message?: string;
  details?: string;
};

type TUsePostForgotPasswordParams = {
  options?: MutationOptions<TForgotPassword, TError, PostForgotPasswordDTO>;
};

export const postForgotPassword = async (data: PostForgotPasswordDTO) => {
  try {
    const response = await extendedAxios.post<
      TForgotPassword,
      PostForgotPasswordDTO
    >(API_URL.userService.forgotPassword, data);

    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const usePostForgotPassword = ({
  options,
}: TUsePostForgotPasswordParams = {}) => {
  const mutation = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: postForgotPassword,
    onSuccess: (data) => {
      toastNotification(data.data, EToastType.SUCCESS);
    },
    onError: (error) => {
      toastNotification(error?.message ?? "change failed", EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
