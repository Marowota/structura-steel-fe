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

export type TDeleteVehicleForeverDTO = {
  vehicleId: string;
  partnerId: string;
};

export type TUseDeleteVehicleForeverParams = {
  params: TDeleteVehicleForeverDTO;
  options?: MutationOptions<unknown, TDeleteError, TDeleteVehicleForeverDTO>;
};

const deleteVehicleForever = async ({
  vehicleId,
  partnerId,
}: TDeleteVehicleForeverDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.delete<string>(
      API_URL.partnerService.vehicleDetail(partnerId, vehicleId),
    ),
  );
  return response;
};

export const useDeleteVehicleForever = (
  { options }: TUseDeleteVehicleForeverParams = {
    params: {
      vehicleId: "",
      partnerId: "",
    },
  },
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteVehicleForever,
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
