import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";
import { TWarehouse } from "./getWarehouseByPartner";

export type GetWarehouseDetailDTO = {
  partnerId?: string;
  warehouseId?: string;
};

export type UseGetWarehouseDetailByPartnerParams = {
  params?: GetWarehouseDetailDTO;
  options?: UseQueryOptions<TWarehouse>;
};

const getWarehouseDetailByPartner = async (params?: GetWarehouseDetailDTO) => {
  if (!params) return {} as TWarehouse;
  const { partnerId, warehouseId } = params;
  if (!partnerId || !warehouseId) return {} as TWarehouse;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TWarehouse>(
      API_URL.partnerService.warehouseDetail(partnerId, warehouseId),
    ),
  );

  return response.data;
};

export const useGetWarehouseDetailByPartner = ({
  options,
  params,
}: UseGetWarehouseDetailByPartnerParams = {}) => {
  const query = useQuery({
    queryKey: ["warehouses", "detail", params],
    queryFn: () => getWarehouseDetailByPartner(params),
    ...options,
  });

  return { ...query };
};
