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
import { EPartnerType, TPartner } from "./getPartners";

export type PutPartnerDTO = {
  partnerId: string;
  partnerType: EPartnerType;
  partnerName: string;
  taxCode: string;
  legalRepresentative: string;
  legalRepresentativePhone: string;
  contactPerson: string;
  contactPersonPhone: string;
  bankName: string;
  bankAccountNumber: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutPartnerParams = {
  options?: MutationOptions<TPartner, TCreateError, PutPartnerDTO>;
};

const putPartner = async (data: PutPartnerDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TPartner, PutPartnerDTO>(
      API_URL.partnerService.detail(data.partnerId),
      data,
    ),
  );
  return response.data;
};

export const usePutPartner = ({ options }: TUsePutPartnerParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["partners"],
    mutationFn: putPartner,
    onSuccess: () => {
      toastNotification("Partner updated successfully", EToastType.SUCCESS);
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
