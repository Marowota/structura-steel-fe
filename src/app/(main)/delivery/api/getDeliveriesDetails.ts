import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";
import { TVehicle } from "../../partner/api/getVehiclesByPartner";
import { TPartner } from "../../partner/api/getPartners";

export type TDeliveryDetail = {
  id: string;
  status: string;
  deliveryCode: string;
  purchaseOrderId: string;
  saleOrderId: string;
  deliveryDate: string;
  vehicle: TVehicle;
  partner: TPartner;
  driverName: string;
  deliveryAddress: string;
  confirmationFromPartner: string;
  confirmationFromFactory: string;
  confirmationFromReceiver: string;
  distance: number;
  deliveryUnitPrice: number;
  additionalFees: number;
  totalDeliveryFee: number;
  deliveryType: string;
  deliveryOrderNote: string;
  deliveryDebts: unknown[];
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type GetDeliveryDetailDTO = {
  id?: string;
};

export type UseGetDeliveryDetailParams = {
  params?: GetDeliveryDetailDTO;
  options?: UseQueryOptions<TDeliveryDetail>;
};

const getDeliveryDetail = async (params?: GetDeliveryDetailDTO) => {
  if (!params?.id) return {} as TDeliveryDetail;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TDeliveryDetail>(
      API_URL.deliveryService.detail(params?.id ?? ""),
    ),
  );

  return response.data;
};

export const useGetDeliveryDetail = ({
  options,
  params,
}: UseGetDeliveryDetailParams = {}) => {
  const query = useQuery({
    queryKey: ["deliveries", "detail", params],
    queryFn: () => getDeliveryDetail(params),
    ...options,
  });

  return { ...query };
};
