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

export type PutWarehouseDTO = {
  partnerId: string;
  warehouseId: string;
  warehouseName: string;
  warehouseAddress: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutWarehouseParams = {
  options?: MutationOptions<TWarehouse, TCreateError, PutWarehouseDTO>;
};

const putWarehouse = async (data: PutWarehouseDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TWarehouse, PutWarehouseDTO>(
      API_URL.partnerService.warehouseDetail(data.partnerId, data.warehouseId),
      data,
    ),
  );
  return response.data;
};

export const usePutWarehouse = ({ options }: TUsePutWarehouseParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["warehouses"],
    mutationFn: putWarehouse,
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
