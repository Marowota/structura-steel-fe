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
import { TOrder } from "./getOrders";

export type PutCancelOrderDTO = {
  orderId: string;
  reason?: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutCancelOrderParams = {
  options?: MutationOptions<TOrder, TCreateError, PutCancelOrderDTO>;
};

const putCancelOrder = async (data: PutCancelOrderDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TOrder, PutCancelOrderDTO>(
      API_URL.orderService.cancel(data.orderId),
      data,
      { params: { reason: data.reason } },
    ),
  );
  return response.data;
};

export const usePutCancelOrder = ({
  options,
}: TUsePutCancelOrderParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["orders"],
    mutationFn: putCancelOrder,
    onSuccess: () => {
      toastNotification("Order cancelled successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
