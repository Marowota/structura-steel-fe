import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination, IPaginationResponse } from "@/types/IPagination";
import {
  DefaultError,
  InfiniteData,
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";

export enum EUserRole {
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_IMPORTER = "ROLE_IMPORTER",
  ROLE_SALER = "ROLE_SALER",
  ROLE_ACCOUNTANT = "ROLE_ACCOUNTANT",
  ROLE_USER = "ROLE_USER",
}

export const EUserRoleLabel = new Map<EUserRole, string>([
  [EUserRole.ROLE_ADMIN, "Admin"],
  [EUserRole.ROLE_IMPORTER, "Importer"],
  [EUserRole.ROLE_SALER, "Saler"],
  [EUserRole.ROLE_ACCOUNTANT, "Accountant"],
  [EUserRole.ROLE_USER, "User"],
]);

export type TUser = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  realmRole: EUserRole;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export const defaultTUser: TUser = {
  id: "",
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  realmRole: EUserRole.ROLE_USER,
  version: 0,
  createdAt: "",
  updatedAt: "",
  createdBy: "",
  updatedBy: "",
};

export type GetUsersDTO = IPagination & {};

type TResult = IPaginationResponse<TUser>;

export type TUseGetUsersParams = {
  params?: GetUsersDTO;
  options?: UseQueryOptions<TResult>;
};

export type TUseGetInfiniteUsersParams = {
  params: GetUsersDTO;
  options?: UndefinedInitialDataInfiniteOptions<
    TResult,
    DefaultError,
    InfiniteData<TResult>,
    QueryKey,
    GetUsersDTO
  >;
};

const getUsers = async (params?: GetUsersDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.userService.index,
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetUsers = ({ options, params }: TUseGetUsersParams = {}) => {
  const query = useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    ...options,
  });

  return { ...query };
};

export const useGetInfiniteUsers = ({
  options,
  params,
}: TUseGetInfiniteUsersParams) => {
  return useInfiniteQuery({
    queryKey: ["users", "infinite", params],
    queryFn: ({ pageParam }) => getUsers(pageParam),
    getNextPageParam: (lastPage) => ({
      ...params,
      pageNo: lastPage.pageNo + 1,
    }),
    initialPageParam: params,
    ...options,
  });
};
