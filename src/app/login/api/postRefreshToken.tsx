import { MutationOptions, useMutation } from "@tanstack/react-query";
import { PostLoginDTO, TCredential, TLoginError } from "./postLogin";
import { extendedAxios } from "@/lib/extendedAxios";
import { API_URL } from "@/constant/apiURL";
import { EToastType, toastNotification } from "@/lib/toastNotification";

export type PostRefreshTokenDTO = {
  grant_type?: string;
  client_id?: string;
  refresh_token: string;
};

type TUsePostLoginParams = {
  options?: MutationOptions<TCredential, TLoginError, PostRefreshTokenDTO>;
};

export const postRefreshToken = async (data: PostRefreshTokenDTO) => {
  data.grant_type ??= "password";
  data.client_id ??= "structura-steel-client";

  const response = await extendedAxios.post<TCredential, PostRefreshTokenDTO>(
    API_URL.AuthService.login,
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response?.data;
};

export const usePostRefreshToken = ({ options }: TUsePostLoginParams = {}) => {
  const mutation = useMutation({
    mutationKey: ["sus"],
    mutationFn: postRefreshToken,
    onError: (error) => {
      toastNotification(
        error?.error_description ?? "Session expired, please login again",
        EToastType.ERROR,
      );
    },
    ...options,
  });

  const mutateAsync = async (data: PostRefreshTokenDTO) => {
    try {
      return await mutation.mutateAsync(data);
    } catch (error) {}
  };

  return { ...mutation, mutateAsync };
};
