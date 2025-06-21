import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";
import { TUser } from "../../user/api/getUsers";

export type GetMyProfileDTO = {
  username?: string;
};

type TResult = {
  status: number;
  data: TUser;
};

export type UseGetMyProfileParams = {
  params?: GetMyProfileDTO;
  options?: UseQueryOptions<TUser>;
};

const getMyProfile = async (params?: GetMyProfileDTO) => {
  if (!params?.username) return {} as TUser;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TResult>(API_URL.userService.myProfile),
  );

  return response.data.data;
};

export const useGetMyProfile = ({
  options,
  params,
}: UseGetMyProfileParams = {}) => {
  const query = useQuery({
    queryKey: ["users", "detail", params],
    queryFn: () => getMyProfile(params),
    ...options,
  });

  return { ...query };
};
