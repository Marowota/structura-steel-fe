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
import { TVehicle } from "../../partner/api/getVehiclesByPartner";

export type PutVehicleRestoreDTO = {
  partnerId: string;
  id: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutVehicleRestoreParams = {
  options?: MutationOptions<TVehicle, TCreateError, PutVehicleRestoreDTO>;
};

const putVehicleRestore = async (data: PutVehicleRestoreDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TVehicle, PutVehicleRestoreDTO>(
      API_URL.partnerService.vehicleRestore(data.partnerId, data.id),
    ),
  );
  return response.data;
};

export const usePutVehicleRestore = ({
  options,
}: TUsePutVehicleRestoreParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["vehicles"],
    mutationFn: putVehicleRestore,
    onSuccess: () => {
      toastNotification("Vehicle restored successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
