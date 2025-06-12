import {
  axiosRequestHandler,
  EToastType,
  extendedAxios,
  toastNotification,
} from "@/lib";
import { API_URL } from "@/constant/apiURL";
import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { TDelivery } from "./getDeliveries";

export type PutConfirmDeliveryDTO = {
  deliveryId: string;
  confirmationFromSender?: EConfirmation;
  confirmationFromReceiver?: EConfirmation;
  confirmationFromFactory?: EConfirmation;
  confirmationFromPartner?: EConfirmation;
  driverName?: string;
  deliveryAddress?: string;
  distance?: number;
  deliveryUnitPrice?: number;
  additionalFees?: number;
  deliveryOrderNote?: string;
};

export enum EConfirmation {
  YES = "YES",
  NO = "NO",
  PENDING = "PENDING",
}

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutConfirmDeliveryParams = {
  options?: MutationOptions<TDelivery, TCreateError, PutConfirmDeliveryDTO>;
};

export const putConfirmDelivery = async (data: PutConfirmDeliveryDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TDelivery, PutConfirmDeliveryDTO>(
      API_URL.deliveryService.detail(data.deliveryId),
      data,
    ),
  );
  return response.data;
};

export const usePutConfirmDelivery = ({
  options,
}: TUsePutConfirmDeliveryParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["deliveries"],
    mutationFn: putConfirmDelivery,
    onSuccess: () => {
      toastNotification("Delivery confirmed successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["deliveries"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
