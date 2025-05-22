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

export type PostOrderProductDTO = {
  orderId: string;
  productId: string;
  quantity: number;
  weight: number;
  unitPrice: number;
  name?: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostOrderProductParams = {
  options?: MutationOptions<TOrder, TCreateError, PostOrderProductDTO>;
};

const postOrderProduct = async (data: PostOrderProductDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TOrder, PostOrderProductDTO>(
      API_URL.orderService.orderDetail(data.orderId),
      data,
    ),
  );
  return response.data;
};

export const usePostOrderProduct = ({
  options,
}: TUsePostOrderProductParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["orders", "single"],
    mutationFn: postOrderProduct,
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
