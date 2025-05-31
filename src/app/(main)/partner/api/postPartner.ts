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

export type PostPartnerDTO = {
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

export type TUsePostPartnerParams = {
  options?: MutationOptions<TPartner, TCreateError, PostPartnerDTO>;
};

const postPartner = async (data: PostPartnerDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TPartner, PostPartnerDTO>(
      API_URL.partnerService.index,
      data,
    ),
  );
  return response.data;
};

export const usePostPartner = ({ options }: TUsePostPartnerParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["partners"],
    mutationFn: postPartner,
    onSuccess: () => {
      toastNotification("Partner created successfully", EToastType.SUCCESS);
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
