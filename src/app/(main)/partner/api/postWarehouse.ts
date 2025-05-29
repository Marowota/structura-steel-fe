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
import { TWarehouse } from "./getWarehouseByPartner";

export type PostWarehouseDTO = {
  warehouseName: string;
  warehouseAddress: string;
  partnerId: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostWarehouseParams = {
  options?: MutationOptions<TWarehouse, TCreateError, PostWarehouseDTO>;
};

const postWarehouse = async (data: PostWarehouseDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TWarehouse, PostWarehouseDTO>(
      API_URL.partnerService.warehouseIndex(data.partnerId),
      data,
    ),
  );
  return response.data;
};

export const usePostWarehouse = ({ options }: TUsePostWarehouseParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["warehouses"],
    mutationFn: postWarehouse,
    onSuccess: () => {
      toastNotification("Warehouse created successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
