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
import { PostOrderDebtDTO } from "./postOrderDebt";

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostOrderDebtBatchParams = {
  options?: MutationOptions<TOrderDebt, TCreateError, PostOrderDebtDTO[]>;
};

const postOrderDebtBatch = async (data: PostOrderDebtDTO[]) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TOrderDebt, PostOrderDebtDTO[]>(
      API_URL.orderService.debtDetailBatch(data[0].orderId ?? ""),
      data,
    ),
  );
  return response.data;
};

export const usePostOrderDebtBatch = ({
  options,
}: TUsePostOrderDebtBatchParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["orderDebts", "product", "batch"],
    mutationFn: postOrderDebtBatch,
    onSuccess: () => {
      toastNotification("Order Debt created successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["orderDebts"] });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
