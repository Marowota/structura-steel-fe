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

export type TDeliveryDebt = {
  id: string;
  status: string;
  deliveryOrderId: string;
  originalAmount: number;
  remainingAmount: number;
  debtNote: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type GetDeliveryDebtsDTO = IPagination & { deliveryId?: string };

type TResult = IPaginationResponse<TDeliveryDebt>;

export type TUseGetDeliveryDebtsParams = {
  params?: GetDeliveryDebtsDTO;
  options?: UseQueryOptions<TResult>;
};

export type TUseGetInfiniteDeliveryDebtsParams = {
  params: GetDeliveryDebtsDTO;
  options?: UndefinedInitialDataInfiniteOptions<
    TResult,
    DefaultError,
    InfiniteData<TResult>,
    QueryKey,
    GetDeliveryDebtsDTO
  >;
};

const getDeliveryDebts = async (params?: GetDeliveryDebtsDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.deliveryService.debt(params?.deliveryId ?? ""),
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

export const useGetDeliveryDebts = ({
  options,
  params,
}: TUseGetDeliveryDebtsParams = {}) => {
  const query = useQuery({
    queryKey: ["deliveryDebts", params],
    queryFn: () => getDeliveryDebts(params),
    ...options,
  });

  return { ...query };
};

export const useGetInfiniteDeliveryDebts = ({
  options,
  params,
}: TUseGetInfiniteDeliveryDebtsParams) => {
  return useInfiniteQuery({
    queryKey: ["deliveryDebts", "infinite", params],
    queryFn: ({ pageParam }) => getDeliveryDebts(pageParam),
    getNextPageParam: (lastPage) => ({
      ...params,
      pageNo: lastPage.pageNo + 1,
    }),
    initialPageParam: params,
    ...options,
  });
};
