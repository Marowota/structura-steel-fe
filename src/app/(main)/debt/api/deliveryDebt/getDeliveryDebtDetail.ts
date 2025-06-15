import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";
import { TDeliveryDebt } from "./getDeliveryDebt";

export type GetDeliveryDebtDetailDTO = {
  id?: string;
  deliveryId?: string;
};

export type UseGetDeliveryDebtDetailParams = {
  params?: GetDeliveryDebtDetailDTO;
  options?: UseQueryOptions<TDeliveryDebt>;
};

const getDeliveryDebtDetail = async (params?: GetDeliveryDebtDetailDTO) => {
  if (!params?.deliveryId) return {} as TDeliveryDebt;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TDeliveryDebt>(
      API_URL.deliveryService.debtDetail(
        params?.deliveryId ?? "",
        params?.id ?? "",
      ),
    ),
  );

  return response.data;
};

export const useGetDeliveryDebtDetail = ({
  options,
  params,
}: UseGetDeliveryDebtDetailParams = {}) => {
  const query = useQuery({
    queryKey: ["deliveryDebts", "detail", params],
    queryFn: () => getDeliveryDebtDetail(params),
    ...options,
  });

  return { ...query };
};
