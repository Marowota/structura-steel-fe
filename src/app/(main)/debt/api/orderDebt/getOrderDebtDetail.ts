import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";
import { TOrderDebt } from "./getOrderDebt";

export type GetOrderDebtDetailDTO = {
  id?: string;
  orderId?: string;
};

export type UseGetOrderDebtDetailParams = {
  params?: GetOrderDebtDetailDTO;
  options?: UseQueryOptions<TOrderDebt>;
};

const getOrderDebtDetail = async (params?: GetOrderDebtDetailDTO) => {
  if (!params?.orderId) return {} as TOrderDebt;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TOrderDebt>(
      API_URL.orderService.debtDetail(params?.orderId ?? "", params?.id ?? ""),
    ),
  );

  return response.data;
};

export const useGetOrderDebtDetail = ({
  options,
  params,
}: UseGetOrderDebtDetailParams = {}) => {
  const query = useQuery({
    queryKey: ["orderDebts", "detail", params],
    queryFn: () => getOrderDebtDetail(params),
    ...options,
  });

  return { ...query };
};
