import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { TProduct } from "./getProducts";
import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";

export type GetProductDetailDTO = {
  id?: string;
};

export type UseGetProductDetailParams = {
  params?: GetProductDetailDTO;
  options?: UseQueryOptions<TProduct>;
};

const getProductDetail = async (params?: GetProductDetailDTO) => {
  if (!params?.id) return {} as TProduct;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TProduct>(
      API_URL.productService.detail(params?.id ?? ""),
    ),
  );

  return response.data;
};

export const useGetProductDetail = ({
  options,
  params,
}: UseGetProductDetailParams = {}) => {
  const query = useQuery({
    queryKey: ["product", params],
    queryFn: () => getProductDetail(params),
    ...options,
  });

  return { ...query };
};
