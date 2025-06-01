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

export type PutUserDTO = {
  userId: string;
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

export type TUsePutUserParams = {
  options?: MutationOptions<TUser, TCreateError, PutUserDTO>;
};

const putUser = async (data: PutUserDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TUser, PutUserDTO>(
      API_URL.userService.detail(data.userId),
      data,
    ),
  );
  return response.data;
};

export const usePutUser = ({ options }: TUsePutUserParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["users"],
    mutationFn: putUser,
    onSuccess: () => {
      toastNotification("User updated successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["sus"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
