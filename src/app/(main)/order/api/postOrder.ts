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

export type PostOrderDTO = {
  partnerId: number;
  projectId: number;
  status: string;
  orderType: string;
  saleOrdersNote?: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export enum EOrderType {
  BAN_SI = "Bán sỉ",
  BAN_LE = "Bán lẻ",
}

export type TUsePostOrderParams = {
  options?: MutationOptions<TOrder, TCreateError, PostOrderDTO>;
};

const postOrder = async (data: PostOrderDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TOrder, PostOrderDTO>(API_URL.orderService.index, data),
  );
  return response.data;
};

export const usePostOrder = ({ options }: TUsePostOrderParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["orders"],
    mutationFn: postOrder,
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
