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

export type TDeletePartnerForeverDTO = {
  partnerId: string;
};

export type TUseDeletePartnerForeverParams = {
  params: TDeletePartnerForeverDTO;
  options?: MutationOptions<unknown, TDeleteError, TDeletePartnerForeverDTO>;
};

const deletePartnerForever = async ({
  partnerId,
}: TDeletePartnerForeverDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.delete<string>(API_URL.partnerService.detail(partnerId)),
  );
  return response;
};

export const useDeletePartnerForever = (
  { options }: TUseDeletePartnerForeverParams = {
    params: {
      partnerId: "",
    },
  },
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deletePartnerForever,
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
