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

export enum EProductType {
  RIBBED_BAR = "RIBBED_BAR",
  COIL = "COIL",
  WIRE_COIL = "WIRE_COIL",
  PLATE = "PLATE",
  PIPE = "PIPE",
  BOX = "BOX",
  SHAPED = "SHAPED",
}

export const PRODUCT_TYPE_OPTIONS = new Map<EProductType, string>([
  [EProductType.RIBBED_BAR, "Ribbed Bar"],
  [EProductType.COIL, "Coil"],
  [EProductType.WIRE_COIL, "Wire Coil"],
  [EProductType.PLATE, "Plate"],
  [EProductType.PIPE, "Pipe"],
  [EProductType.BOX, "Box"],
  [EProductType.SHAPED, "Shaped"],
]);

export type TProduct = {
  id: string;
  code: string;
  productType: EProductType;
  name: string;
  unitWeight: number;
  length: number;
  width: number | null;
  height: number | null;
  thickness: number | null;
  diameter: number | null;
  standard: string;
  importPrice: number;
  exportPrice: number;
  profitPercentage: number;
};

export type GetProductsDTO = IPagination & {};

export type TUseGetProductsParams = {
  params?: GetProductsDTO;
  options?: UseQueryOptions<TResult>;
};

export type TUseGetInfiniteProductsParams = {
  params: GetProductsDTO;
  options?: UndefinedInitialDataInfiniteOptions<
    TResult,
    DefaultError,
    InfiniteData<TResult>,
    QueryKey,
    GetProductsDTO
  >;
};

type TResult = IPaginationResponse<TProduct>;

const getProduct = async (params?: GetProductsDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.productService.index,
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

export const useGetProducts = ({
  options,
  params,
}: TUseGetProductsParams = {}) => {
  const query = useQuery({
    queryKey: ["products", params],
    queryFn: () => getProduct(params),
    ...options,
  });

  return { ...query };
};

export const useGetInfiniteProducts = ({
  options,
  params,
}: TUseGetInfiniteProductsParams) => {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", params],
    queryFn: ({ pageParam }) => getProduct(pageParam),
    getNextPageParam: (lastPage) => ({
      ...params,
      pageNo: lastPage.pageNo + 1,
    }),
    initialPageParam: params,
    ...options,
  });
};
