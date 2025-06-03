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
import { TWarehouse } from "../../partner/api/getWarehouseByPartner";

export type PutWarehouseRestoreDTO = {
  partnerId: string;
  id: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutWarehouseRestoreParams = {
  options?: MutationOptions<TWarehouse, TCreateError, PutWarehouseRestoreDTO>;
};

const putWarehouseRestore = async (data: PutWarehouseRestoreDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TWarehouse, PutWarehouseRestoreDTO>(
      API_URL.partnerService.warehouseRestore(data.partnerId, data.id),
    ),
  );
  return response.data;
};

export const usePutWarehouseRestore = ({
  options,
}: TUsePutWarehouseRestoreParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["warehouses"],
    mutationFn: putWarehouseRestore,
    onSuccess: () => {
      toastNotification("Warehouse restored successfully", EToastType.SUCCESS);
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
