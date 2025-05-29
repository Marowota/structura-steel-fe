import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import {
  DEFAULT_PAGINATION_RESPONSE,
  IPagination,
  IPaginationResponse,
} from "@/types/IPagination";
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

export type TWarehouse = {
  id: string;
  warehouseName: string;
  warehouseCode: string;
  warehouseAddress: string;
  partnerId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export const defaultTWarehouse: TWarehouse = {
  id: "",
  warehouseName: "",
  warehouseCode: "",
  warehouseAddress: "",
  partnerId: "",
  version: 0,
  createdAt: "",
  updatedAt: "",
  createdBy: "",
  updatedBy: "",
};

export type GetWarehousesDTO = IPagination & { partnerId?: string };

type TResult = IPaginationResponse<TWarehouse>;

export type TUseGetWarehousesByPartnerParams = {
  params?: GetWarehousesDTO;
  options?: UseQueryOptions<TResult>;
};

export type TUseGetInfiniteWarehousesByPartnerParams = {
  params: GetWarehousesDTO;
  options?: UndefinedInitialDataInfiniteOptions<
    TResult,
    DefaultError,
    InfiniteData<TResult>,
    QueryKey,
    GetWarehousesDTO
  >;
};

const getWarehousesByPartner = async (params?: GetWarehousesDTO) => {
  try {
    if (params?.partnerId == undefined)
      return DEFAULT_PAGINATION_RESPONSE as TResult;
    const response = await extendedAxios.get<TResult>(
      API_URL.partnerService.warehouseIndex(params?.partnerId),
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

export const useGetWarehousesByPartner = ({
  options,
  params,
}: TUseGetWarehousesByPartnerParams = {}) => {
  const query = useQuery({
    queryKey: ["warehouses", params],
    queryFn: () => getWarehousesByPartner(params),
    ...options,
  });

  return { ...query };
};

export const useGetInfiniteWarehousesByPartner = ({
  options,
  params,
}: TUseGetInfiniteWarehousesByPartnerParams) => {
  return useInfiniteQuery({
    queryKey: ["warehouses", "infinite", params],
    queryFn: ({ pageParam }) => getWarehousesByPartner(pageParam),
    getNextPageParam: (lastPage) => ({
      ...params,
      pageNo: lastPage.pageNo + 1,
    }),
    initialPageParam: params,
    ...options,
  });
};
