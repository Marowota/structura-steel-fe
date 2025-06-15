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
import { TDeliveryDebt } from "./getDeliveryDebt";

export type PutDeliveryDebtDTO = {
  id: string;
  amount: number;
  debtNote?: string;
  deliveryId: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutDeliveryDebtParams = {
  options?: MutationOptions<TDeliveryDebt, TCreateError, PutDeliveryDebtDTO>;
};

const putDeliveryDebt = async (data: PutDeliveryDebtDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TDeliveryDebt, PutDeliveryDebtDTO>(
      API_URL.deliveryService.debtDetail(data.deliveryId ?? "", data.id ?? ""),
      data,
    ),
  );
  return response.data;
};

export const usePutDeliveryDebt = ({
  options,
}: TUsePutDeliveryDebtParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["deliveryDebts"],
    mutationFn: putDeliveryDebt,
    onSuccess: () => {
      toastNotification(
        "DeliveryDebt updated successfully",
        EToastType.SUCCESS,
      );
      queryClient.invalidateQueries({
        queryKey: ["deliveryDebts"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
