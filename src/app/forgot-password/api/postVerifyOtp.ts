import { API_URL } from "@/constant/apiURL";
import { extendedAxios, EToastType, toastNotification } from "@/lib";
import { MutationOptions, useMutation } from "@tanstack/react-query";

export type PostVerifyOtpDTO = {
  email: string;
  otp: string;
};

export type TVerifyOtp = {
  status: string;
  data: string;
};

export type TError = {
  timestamp?: string;
  message?: string;
  details?: string;
};

type TUsePostVerifyOtpParams = {
  options?: MutationOptions<TVerifyOtp, TError, PostVerifyOtpDTO>;
};

export const postVerifyOtp = async (data: PostVerifyOtpDTO) => {
  const response = await extendedAxios.post<TVerifyOtp, PostVerifyOtpDTO>(
    API_URL.userService.verifyOtp,
    data,
  );

  return response?.data;
};

export const usePostVerifyOtp = ({ options }: TUsePostVerifyOtpParams = {}) => {
  const mutation = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: postVerifyOtp,
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
