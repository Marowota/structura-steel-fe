import { API_URL } from "@/constant/apiURL";
import {
  axiosRequestHandler,
  EToastType,
  extendedAxios,
  toastNotification,
} from "@/lib";
import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export type TDeleteError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TDeleteWarehouseDTO = {
  warehouseId: string;
  partnerId: string;
};

export type TUseDeleteWarehouseParams = {
  params: TDeleteWarehouseDTO;
  options?: MutationOptions<unknown, TDeleteError, TDeleteWarehouseDTO>;
};

const deleteWarehouse = async ({
  warehouseId,
  partnerId,
}: TDeleteWarehouseDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.delete<string>(
      API_URL.partnerService.warehouseSoftDelete(partnerId, warehouseId),
    ),
  );
  return response;
};

export const useDeleteWarehouse = (
  { options }: TUseDeleteWarehouseParams = {
    params: {
      warehouseId: "",
      partnerId: "",
    },
  },
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      toastNotification("Warehouse deleted successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
    onError: (error) => {
      toastNotification(
        error.message || "Failed to delete warehouse",
        EToastType.ERROR,
      );
    },
    ...options,
  });
  return { ...mutation };
};
