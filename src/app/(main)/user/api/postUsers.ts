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
import { EUserRole, TUser } from "./getUsers";

export type PostUserDTO = {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  realmRole: EUserRole;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostUserParams = {
  options?: MutationOptions<TUser, TCreateError, PostUserDTO>;
};

const postUser = async (data: PostUserDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TUser, PostUserDTO>(API_URL.userService.signUp, data),
  );
  return response.data;
};

export const usePostUser = ({ options }: TUsePostUserParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["users"],
    mutationFn: postUser,
    onSuccess: () => {
      toastNotification("User created successfully", EToastType.SUCCESS);
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
