import { API_URL } from "@/constant/apiURL";
import { extendedAxios, EToastType, toastNotification } from "@/lib";
import { MutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";

export type PostLoginDTO = {
  username: string;
  password: string;
  grant_type: string;
  client_id: string;
};

export type TCredential = {
  access_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  session_state?: string;
  scope?: string;
};

export type TLoginError = {
  error?: string;
  error_description?: string;
};

type TUsePostLoginParams = {
  options?: MutationOptions<TCredential, TLoginError, PostLoginDTO>;
};

export const postLogin = async (data: PostLoginDTO) => {
  data.grant_type ??= "password";
  data.client_id ??= "structura-steel-client";

  try {
    const response = await extendedAxios.post<TCredential, PostLoginDTO>(
      API_URL.AuthService.login,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const usePostLogin = ({ options }: TUsePostLoginParams = {}) => {
  const mutation = useMutation({
    mutationKey: ["sus"],
    mutationFn: postLogin,
    onSuccess: () => {
      toastNotification("Login successful", EToastType.SUCCESS);
    },
    onError: (error) => {
      toastNotification(
        error?.error_description ?? "Login failed",
        EToastType.ERROR,
      );
    },
    ...options,
  });
  const mutateAsync = async (data: PostLoginDTO) => {
    try {
      return await mutation.mutateAsync(data);
    } catch (error) {}
  };
  return { ...mutation, mutateAsync };
};
