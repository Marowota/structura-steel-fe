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

export type TDeleteWarehouseForeverDTO = {
  warehouseId: string;
  partnerId: string;
};

export type TUseDeleteWarehouseForeverParams = {
  params: TDeleteWarehouseForeverDTO;
  options?: MutationOptions<unknown, TDeleteError, TDeleteWarehouseForeverDTO>;
};

const deleteWarehouseForever = async ({
  warehouseId,
  partnerId,
}: TDeleteWarehouseForeverDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.delete<string>(
      API_URL.partnerService.warehouseDetail(partnerId, warehouseId),
    ),
  );
  return response;
};

export const useDeleteWarehouseForever = (
  { options }: TUseDeleteWarehouseForeverParams = {
    params: {
      warehouseId: "",
      partnerId: "",
    },
  },
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteWarehouseForever,
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
