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

export type TDeleteVehicleDTO = {
  vehicleId: string;
  partnerId: string;
};

export type TUseDeleteVehicleParams = {
  params: TDeleteVehicleDTO;
  options?: MutationOptions<unknown, TDeleteError, TDeleteVehicleDTO>;
};

const deleteVehicle = async ({ vehicleId, partnerId }: TDeleteVehicleDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.delete<string>(
      API_URL.partnerService.vehicleSoftDelete(partnerId, vehicleId),
    ),
  );
  return response;
};

export const useDeleteVehicle = (
  { options }: TUseDeleteVehicleParams = {
    params: {
      vehicleId: "",
      partnerId: "",
    },
  },
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      toastNotification("Vehicle deleted successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (error) => {
      toastNotification(
        error.message || "Failed to delete vehicle",
        EToastType.ERROR,
      );
    },
    ...options,
  });
  return { ...mutation };
};
