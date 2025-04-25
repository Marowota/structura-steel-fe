import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib/extendedAxios";
import { EToastType, toastNotification } from "@/lib/toastNotification";
import { MutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";

type PostLoginDTO = {
  username: string;
  password: string;
  grant_type: string;
  client_id: string;
};

type TCredential = {
  access_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  session_state?: string;
  scope?: string;
};

type TLoginError = {
  error?: string;
  error_description?: string;
};

type TUsePostLoginParams = {
  options?: MutationOptions<TCredential, TLoginError, PostLoginDTO>;
};

export const postLogin = async (data: PostLoginDTO) => {
  data.grant_type ??= "password";
  data.client_id ??= "structura-steel-client";

  const response = await extendedAxios.post<TCredential, PostLoginDTO>(
    API_URL.AuthService.login,
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  return response.data;
};

export const usePostLogin = ({ options }: TUsePostLoginParams = {}) => {
  return useMutation({
    mutationKey: ["sus"],
    mutationFn: postLogin,
    onSuccess: () => {
      toastNotification("Login successful", EToastType.SUCCESS);
    },
    onError: (error) => {
      console.log(error);
    },
    ...options,
  });
};
