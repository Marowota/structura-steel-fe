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

export type PostVehicleDTO = {
  driverName: string;
  licensePlate: string;
  capacity: number;
  vehicleType: EVehicleType;
  description: string;
  partnerId: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostVehicleParams = {
  options?: MutationOptions<TVehicle, TCreateError, PostVehicleDTO>;
};

const postVehicle = async (data: PostVehicleDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TVehicle, PostVehicleDTO>(
      API_URL.partnerService.vehicleIndex(data.partnerId),
      data,
    ),
  );
  return response.data;
};

export const usePostVehicle = ({ options }: TUsePostVehicleParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["vehicles"],
    mutationFn: postVehicle,
    onSuccess: () => {
      toastNotification("Vehicle created successfully", EToastType.SUCCESS);
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
