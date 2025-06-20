import { API_URL } from "@/constant/apiURL";
import { extendedAxios, EToastType, toastNotification } from "@/lib";
import { MutationOptions, useMutation } from "@tanstack/react-query";

export type PostChangePasswordFirstTimeDTO = {
  email: string;
  temporaryPassword: string;
  newPassword: string;
};

export type TChangePasswordFirstTime = {
  status: string;
  data: string;
};

export type TError = {
  timestamp?: string;
  message?: string;
  details?: string;
};

type TUsePostChangePasswordFirstTimeParams = {
  options?: MutationOptions<
    TChangePasswordFirstTime,
    TError,
    PostChangePasswordFirstTimeDTO
  >;
};

export const postChangePasswordFirstTime = async (
  data: PostChangePasswordFirstTimeDTO,
) => {
  const response = await extendedAxios.post<
    TChangePasswordFirstTime,
    PostChangePasswordFirstTimeDTO
  >(API_URL.userService.changePasswordFirstTime, data);

  return response?.data;
};

export const usePostChangePasswordFirstTime = ({
  options,
}: TUsePostChangePasswordFirstTimeParams = {}) => {
  const mutation = useMutation({
    mutationKey: ["first-time-change-password"],
    mutationFn: postChangePasswordFirstTime,
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
