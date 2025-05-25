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
import { PostOrderProductDTO } from "./postOrderProduct";

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostOrderProductBatchParams = {
  options?: MutationOptions<TOrder, TCreateError, PostOrderProductDTO[]>;
};

const postOrderProductBatch = async (data: PostOrderProductDTO[]) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TOrder, PostOrderProductDTO[]>(
      API_URL.orderService.orderProductBatch(data[0].orderId),
      data,
    ),
  );
  return response.data;
};

export const usePostOrderProductBatch = ({
  options,
}: TUsePostOrderProductBatchParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["orders", "product", "batch"],
    mutationFn: postOrderProductBatch,
    onSuccess: () => {
      toastNotification("Order created successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
