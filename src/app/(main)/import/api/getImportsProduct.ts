import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";
import { IPagination, IPaginationResponse } from "@/types/IPagination";
import { TProduct } from "../../product/api/getProducts";

export type TImportProduct = {
  id: number;
  purchaseOrderId: number;
  productId: number;
  product: TProduct;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type GetImportProductDTO = IPagination & {
  id?: string;
};

type TResult = IPaginationResponse<TImportProduct>;

export type UseGetImportProductParams = {
  params?: GetImportProductDTO;
  options?: UseQueryOptions<TResult>;
};

const getImportProduct = async (params?: GetImportProductDTO) => {
  if (!params?.id) return {} as TResult;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TResult>(
      API_URL.importService.importProduct(params?.id ?? ""),
    ),
  );

  return response.data;
};

export const useGetImportProduct = ({
  options,
  params,
}: UseGetImportProductParams = {}) => {
  const query = useQuery({
    queryKey: ["imports", "product", params],
    queryFn: () => getImportProduct(params),
    ...options,
  });

  return { ...query };
};
