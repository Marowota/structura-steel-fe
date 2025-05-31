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
import { EVehicleType, TVehicle } from "./getVehiclesByPartner";

export type PutVehicleDTO = {
  partnerId: string;
  vehicleId: string;
  vehicleType: EVehicleType;
  licensePlate: string;
  capacity: number;
  description: string;
  driverName: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutVehicleParams = {
  options?: MutationOptions<TVehicle, TCreateError, PutVehicleDTO>;
};

const putVehicle = async (data: PutVehicleDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TVehicle, PutVehicleDTO>(
      API_URL.partnerService.vehicleDetail(data.partnerId, data.vehicleId),
      data,
    ),
  );
  return response.data;
};

export const usePutVehicle = ({ options }: TUsePutVehicleParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["vehicles"],
    mutationFn: putVehicle,
    onSuccess: () => {
      toastNotification("Vehicle updated successfully", EToastType.SUCCESS);
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
