import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { TUser } from "./getUsers";
import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";

export type GetUserDetailDTO = {
  username?: string;
};

type TResult = {
  status: number;
  data: TUser;
};

export type UseGetUserDetailParams = {
  params?: GetUserDetailDTO;
  options?: UseQueryOptions<TUser>;
};

const getUserDetail = async (params?: GetUserDetailDTO) => {
  if (!params?.username) return {} as TUser;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TResult>(
      API_URL.userService.detail(params?.username ?? ""),
    ),
  );

  return response.data.data;
};

export const useGetUserDetail = ({
  options,
  params,
}: UseGetUserDetailParams = {}) => {
  const query = useQuery({
    queryKey: ["users", "detail", params],
    queryFn: () => getUserDetail(params),
    ...options,
  });

  return { ...query };
};
