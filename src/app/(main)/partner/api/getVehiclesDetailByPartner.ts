import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";
import { TVehicle } from "./getVehiclesByPartner";

export type GetVehicleDetailDTO = {
  partnerId?: string;
  vehicleId?: string;
};

export type UseGetVehicleDetailByPartnerParams = {
  params?: GetVehicleDetailDTO;
  options?: UseQueryOptions<TVehicle>;
};

const getVehicleDetailByPartner = async (params?: GetVehicleDetailDTO) => {
  if (!params) return {} as TVehicle;
  const { partnerId, vehicleId } = params;
  if (!partnerId || !vehicleId) return {} as TVehicle;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TVehicle>(
      API_URL.partnerService.vehicleDetail(partnerId, vehicleId),
    ),
  );

  return response.data;
};

export const useGetVehicleDetailByPartner = ({
  options,
  params,
}: UseGetVehicleDetailByPartnerParams = {}) => {
  const query = useQuery({
    queryKey: ["vehicles", "detail", params],
    queryFn: () => getVehicleDetailByPartner(params),
    ...options,
  });

  return { ...query };
};
