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

export type PostOrderDebtDTO = {
  productId: string;
  originalAmount: number;
  debtNote?: string;
  orderId: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostOrderDebtParams = {
  options?: MutationOptions<TOrderDebt, TCreateError, PostOrderDebtDTO>;
};

const postOrderDebt = async (data: PostOrderDebtDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TOrderDebt, PostOrderDebtDTO>(
      API_URL.orderService.debt(data.orderId ?? ""),
      data,
    ),
  );
  return response.data;
};

export const usePostOrderDebt = ({ options }: TUsePostOrderDebtParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["orderDebts"],
    mutationFn: postOrderDebt,
    onSuccess: () => {
      toastNotification("OrderDebt created successfully", EToastType.SUCCESS);
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
