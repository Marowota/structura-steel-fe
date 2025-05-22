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
import { TProject } from "./getProjectsByPartner";

export type TPartner = {
  id: string;
  partnerType: string;
  partnerName: string;
  partnerCode: string;
  taxCode: string;
  legalRepresentative: string;
  legalRepresentativePhone: string;
  contactPerson: string;
  contactPersonPhone: string;
  bankName: string;
  bankAccountNumber: string;
  partnerProjects: TProject[];
};

export type GetPartnersDTO = IPagination & {};

type TResult = IPaginationResponse<TPartner>;

export type TUseGetPartnersParams = {
  params?: GetPartnersDTO;
  options?: UseQueryOptions<TResult>;
};

export type TUseGetInfinitePartnersParams = {
  params: GetPartnersDTO;
  options?: UndefinedInitialDataInfiniteOptions<
    TResult,
    DefaultError,
    InfiniteData<TResult>,
    QueryKey,
    GetPartnersDTO
  >;
};

const getPartners = async (params?: GetPartnersDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.partnerService.index,
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

export const useGetPartners = ({
  options,
  params,
}: TUseGetPartnersParams = {}) => {
  const query = useQuery({
    queryKey: ["partners", params],
    queryFn: () => getPartners(params),
    ...options,
  });

  return { ...query };
};

export const useGetInfinitePartners = ({
  options,
  params,
}: TUseGetInfinitePartnersParams) => {
  return useInfiniteQuery({
    queryKey: ["partners", "infinite", params],
    queryFn: ({ pageParam }) => getPartners(pageParam),
    getNextPageParam: (lastPage) => ({
      ...params,
      pageNo: lastPage.pageNo + 1,
    }),
    initialPageParam: params,
    ...options,
  });
};
