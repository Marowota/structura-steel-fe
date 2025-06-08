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

export type PutCancelDeliveryDTO = {
  deliveryId: string;
  reason?: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutCancelDeliveryParams = {
  options?: MutationOptions<TDelivery, TCreateError, PutCancelDeliveryDTO>;
};

export const putCancelDelivery = async (data: PutCancelDeliveryDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TDelivery, PutCancelDeliveryDTO>(
      API_URL.deliveryService.cancel(data.deliveryId),
      data,
      { params: { reason: data.reason } },
    ),
  );
  return response.data;
};

export const usePutCancelDelivery = ({
  options,
}: TUsePutCancelDeliveryParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["deliveries"],
    mutationFn: putCancelDelivery,
    onSuccess: () => {
      toastNotification("Delivery cancelled successfully", EToastType.SUCCESS);
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
