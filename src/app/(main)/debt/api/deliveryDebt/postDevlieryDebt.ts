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

export type PostDeliveryDebtDTO = {
  originalAmount: number;
  debtNote?: string;
  deliveryId: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostDeliveryDebtParams = {
  options?: MutationOptions<TDeliveryDebt, TCreateError, PostDeliveryDebtDTO>;
};

const postDeliveryDebt = async (data: PostDeliveryDebtDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TDeliveryDebt, PostDeliveryDebtDTO>(
      API_URL.deliveryService.debt(data.deliveryId ?? ""),
      data,
    ),
  );
  return response.data;
};

export const usePostDeliveryDebt = ({
  options,
}: TUsePostDeliveryDebtParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["deliveryDebts"],
    mutationFn: postDeliveryDebt,
    onSuccess: () => {
      toastNotification(
        "DeliveryDebt created successfully",
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
