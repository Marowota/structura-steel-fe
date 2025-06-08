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

export type PostDeliveryDTO = {
  purchaseOrderId?: string;
  saleOrderId?: string;
  deliveryDate: string;
  partnerId: string;
  vehicleId: string;
  driverName: string;
  deliveryAddress: string;
  distance: number;
  deliveryUnitPrice: number;
  additionalFees: number;
  totalDeliveryFee: number;
  deliveryOrderNote: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostDeliveryParams = {
  options?: MutationOptions<TDelivery, TCreateError, PostDeliveryDTO>;
};

const postDelivery = async (data: PostDeliveryDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TDelivery, PostDeliveryDTO>(
      API_URL.deliveryService.index,
      data,
    ),
  );
  return response.data;
};

export const usePostDelivery = ({ options }: TUsePostDeliveryParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["deliveries"],
    mutationFn: postDelivery,
    onSuccess: () => {
      //toastNotification("Delivery created successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
