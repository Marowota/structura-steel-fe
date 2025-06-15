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
import { TOrderDebt } from "./getOrderDebt";

export type PutOrderDebtDTO = {
  id: string;
  productId: string;
  amount: number;
  debtNote?: string;
  status: string;
  orderId: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutOrderDebtParams = {
  options?: MutationOptions<TOrderDebt, TCreateError, PutOrderDebtDTO>;
};

const putOrderDebt = async (data: PutOrderDebtDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TOrderDebt, PutOrderDebtDTO>(
      API_URL.orderService.debtDetail(data.orderId ?? "", data.id ?? ""),
      data,
    ),
  );
  return response.data;
};

export const usePutOrderDebt = ({ options }: TUsePutOrderDebtParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["orderDebts"],
    mutationFn: putOrderDebt,
    onSuccess: () => {
      toastNotification("OrderDebt updated successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["orderDebts"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
