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

export type TDeletePartnerDTO = {
  partnerId: string;
};

export type TUseDeletePartnerParams = {
  params: TDeletePartnerDTO;
  options?: MutationOptions<unknown, TDeleteError, TDeletePartnerDTO>;
};

const deletePartner = async ({ partnerId }: TDeletePartnerDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.delete<string>(
      API_URL.partnerService.partnerSoftDelete(partnerId),
    ),
  );
  return response;
};

export const useDeletePartner = (
  { options }: TUseDeletePartnerParams = {
    params: {
      partnerId: "",
    },
  },
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deletePartner,
    onSuccess: () => {
      toastNotification("Partner deleted successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
    onError: (error) => {
      toastNotification(
        error.message || "Failed to delete partner",
        EToastType.ERROR,
      );
    },
    ...options,
  });
  return { ...mutation };
};
