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

export type PutDeliveryDTO = {
  deliveryId: string;
  confirmationFromFactory?: string;
  confirmationFromPartner?: string;
  confirmationFromReceiver?: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutDeliveryParams = {
  options?: MutationOptions<TDelivery, TCreateError, PutDeliveryDTO>;
};

const putDelivery = async (data: PutDeliveryDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TDelivery, PutDeliveryDTO>(
      API_URL.deliveryService.detail(data.deliveryId),
      data,
    ),
  );
  return response.data;
};

export const usePutDelivery = ({ options }: TUsePutDeliveryParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["deliveries"],
    mutationFn: putDelivery,
    onSuccess: () => {
      toastNotification("Delivery updated successfully", EToastType.SUCCESS);
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
