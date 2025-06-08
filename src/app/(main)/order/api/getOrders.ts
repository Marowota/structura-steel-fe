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

export enum EOrderStatus {
  NEW = "New",
  PROCESSING = "Processing",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  DONE = "Done",
  CANCELLED = "Cancelled",
}

export type TOrder = {
  id: string;
  partnerId: string;
  partnerName: string;
  projectId: string;
  projectName: string;
  warehouseId: string;
  status: EOrderStatus;
  orderType: string;
  totalAmount: number;
  saleOrdersNote: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  exportCode: string;
};

export type GetOrdersDTO = IPagination & {};

export type TUseGetOrdersParams = {
  params?: GetOrdersDTO;
  options?: UseQueryOptions<TResult>;
};

export type TUseGetInfiniteOrdersParams = {
  params: GetOrdersDTO;
  options?: UndefinedInitialDataInfiniteOptions<
    TResult,
    DefaultError,
    InfiniteData<TResult>,
    QueryKey,
    GetOrdersDTO
  >;
};

type TResult = IPaginationResponse<TOrder>;

const getOrders = async (params?: GetOrdersDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.orderService.index,
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

export const useGetOrders = ({ options, params }: TUseGetOrdersParams = {}) => {
  const query = useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    ...options,
  });

  return { ...query };
};

export const useGetInfiniteOrders = ({
  options,
  params,
}: TUseGetInfiniteOrdersParams) => {
  return useInfiniteQuery({
    queryKey: ["orders", "infinite", params],
    queryFn: ({ pageParam }) => getOrders(pageParam),
    getNextPageParam: (lastPage) => ({
      ...params,
      pageNo: lastPage.pageNo + 1,
    }),
    initialPageParam: params,
    ...options,
  });
};
