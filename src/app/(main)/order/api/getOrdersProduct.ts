import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";
import { IPagination, IPaginationResponse } from "@/types/IPagination";
import { TProduct } from "../../product/api/getProducts";

export type TOrderProduct = {
  id: string;
  productId: string;
  product: TProduct;
  quantity: number;
  weight: number;
  unitPrice: number;
  subtotal: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type GetOrderProductDTO = IPagination & {
  id?: string;
};

type TResult = IPaginationResponse<TOrderProduct>;

export type UseGetOrderProductParams = {
  params?: GetOrderProductDTO;
  options?: UseQueryOptions<TResult>;
};

const getOrderProduct = async (params?: GetOrderProductDTO) => {
  if (!params?.id) return {} as TResult;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TResult>(
      API_URL.orderService.orderProduct(params?.id ?? ""),
    ),
  );

  return response.data;
};

export const useGetOrderProduct = ({
  options,
  params,
}: UseGetOrderProductParams = {}) => {
  const query = useQuery({
    queryKey: ["orders", "product", params],
    queryFn: () => getOrderProduct(params),
    ...options,
  });

  return { ...query };
};
