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

export type TImportDebt = {
  id: string;
  status: string;
  purchaseOrderId: string;
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

export type GetImportDebtsDTO = IPagination & { importId?: string };

type TResult = IPaginationResponse<TImportDebt>;

export type TUseGetImportDebtsParams = {
  params?: GetImportDebtsDTO;
  options?: UseQueryOptions<TResult>;
};

export type TUseGetInfiniteImportDebtsParams = {
  params: GetImportDebtsDTO;
  options?: UndefinedInitialDataInfiniteOptions<
    TResult,
    DefaultError,
    InfiniteData<TResult>,
    QueryKey,
    GetImportDebtsDTO
  >;
};

const getImportDebts = async (params?: GetImportDebtsDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.importService.debt(params?.importId ?? ""),
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

export const useGetImportDebts = ({
  options,
  params,
}: TUseGetImportDebtsParams = {}) => {
  const query = useQuery({
    queryKey: ["importDebts", params],
    queryFn: () => getImportDebts(params),
    ...options,
  });

  return { ...query };
};

export const useGetInfiniteImportDebts = ({
  options,
  params,
}: TUseGetInfiniteImportDebtsParams) => {
  return useInfiniteQuery({
    queryKey: ["importDebts", "infinite", params],
    queryFn: ({ pageParam }) => getImportDebts(pageParam),
    getNextPageParam: (lastPage) => ({
      ...params,
      pageNo: lastPage.pageNo + 1,
    }),
    initialPageParam: params,
    ...options,
  });
};
