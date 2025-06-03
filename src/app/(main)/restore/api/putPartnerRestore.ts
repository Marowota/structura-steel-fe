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
import { TPartner } from "../../partner/api/getPartners";

export type PutPartnerRestoreDTO = {
  id: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutPartnerRestoreParams = {
  options?: MutationOptions<TPartner, TCreateError, PutPartnerRestoreDTO>;
};

const putPartnerRestore = async (data: PutPartnerRestoreDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TPartner, PutPartnerRestoreDTO>(
      API_URL.partnerService.partnerRestore(data.id),
    ),
  );
  return response.data;
};

export const usePutPartnerRestore = ({
  options,
}: TUsePutPartnerRestoreParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["partners"],
    mutationFn: putPartnerRestore,
    onSuccess: () => {
      toastNotification("Partner restored successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["partners"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
