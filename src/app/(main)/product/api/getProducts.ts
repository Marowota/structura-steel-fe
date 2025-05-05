import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib/extendedAxios";
import { IPagination, IPaginationResponse } from "@/types/IPagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

export type TProduct = {
  id: number;
  code: string;
  name: string;
  unitWeight: number;
  length: number;
  width: number | null;
  height: number | null;
  thickness: number | null;
  diameter: number | null;
  standard: string;
};

export type GetProductsDTO = IPagination & {};

export type TUseGetProductsParams = {
  params?: GetProductsDTO;
  options?: UseQueryOptions<TResult>;
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
