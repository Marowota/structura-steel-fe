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

export enum EImportStatus {
  NEW = "New",
  PROCESSING = "Processing",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  DONE = "Done",
  CANCELLED = "Cancelled",
}

export type TImport = {
  id: string;
  importCode: string;
  supplierId: string;
  confirmationFromSupplier: string;
  supplierName: string;
  supplierCode: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  status: EImportStatus;
  totalAmount: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type GetImportsDTO = IPagination & {};

export type TUseGetImportsParams = {
  params?: GetImportsDTO;
  options?: UseQueryOptions<TResult>;
};

export type TUseGetInfiniteImportsParams = {
  params: GetImportsDTO;
  options?: UndefinedInitialDataInfiniteOptions<
    TResult,
    DefaultError,
    InfiniteData<TResult>,
    QueryKey,
    GetImportsDTO
  >;
};

type TResult = IPaginationResponse<TImport>;

const getImports = async (params?: GetImportsDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.importService.index,
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

export const useGetImports = ({
  options,
  params,
}: TUseGetImportsParams = {}) => {
  const query = useQuery({
    queryKey: ["imports", params],
    queryFn: () => getImports(params),
    ...options,
  });

  return { ...query };
};

export const useGetInfiniteImports = ({
  options,
  params,
}: TUseGetInfiniteImportsParams) => {
  return useInfiniteQuery({
    queryKey: ["imports", "infinite", params],
    queryFn: ({ pageParam }) => getImports(pageParam),
    getNextPageParam: (lastPage) => ({
      ...params,
      pageNo: lastPage.pageNo + 1,
    }),
    initialPageParam: params,
    ...options,
  });
};
