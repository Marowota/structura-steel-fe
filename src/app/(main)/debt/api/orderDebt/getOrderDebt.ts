import { TProduct } from "@/app/(main)/product/api/getProducts";
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

export type TOrderDebt = {
  id: string;
  status: string;
  saleOrderId: string;
  product: TProduct;
  originalAmount: number;
  remainingAmount: number;
  debtNote: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type GetOrderDebtsDTO = IPagination & { orderId?: string };

type TResult = IPaginationResponse<TOrderDebt>;

export type TUseGetOrderDebtsParams = {
  params?: GetOrderDebtsDTO;
  options?: UseQueryOptions<TResult>;
};

export type TUseGetInfiniteOrderDebtsParams = {
  params: GetOrderDebtsDTO;
  options?: UndefinedInitialDataInfiniteOptions<
    TResult,
    DefaultError,
    InfiniteData<TResult>,
    QueryKey,
    GetOrderDebtsDTO
  >;
};

const getOrderDebts = async (params?: GetOrderDebtsDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.orderService.debt(params?.orderId ?? ""),
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

export const useGetOrderDebts = ({
  options,
  params,
}: TUseGetOrderDebtsParams = {}) => {
  const query = useQuery({
    queryKey: ["orderDebts", params],
    queryFn: () => getOrderDebts(params),
    ...options,
  });

  return { ...query };
};

export const useGetInfiniteOrderDebts = ({
  options,
  params,
}: TUseGetInfiniteOrderDebtsParams) => {
  return useInfiniteQuery({
    queryKey: ["orderDebts", "infinite", params],
    queryFn: ({ pageParam }) => getOrderDebts(pageParam),
    getNextPageParam: (lastPage) => ({
      ...params,
      pageNo: lastPage.pageNo + 1,
    }),
    initialPageParam: params,
    ...options,
  });
};
