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
import { TProject } from "../../partner/api/getProjectsByPartner";

export type PutProjectRestoreDTO = {
  partnerId: string;
  id: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutProjectRestoreParams = {
  options?: MutationOptions<TProject, TCreateError, PutProjectRestoreDTO>;
};

const putProjectRestore = async (data: PutProjectRestoreDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TProject, PutProjectRestoreDTO>(
      API_URL.partnerService.projectRestore(data.partnerId, data.id),
    ),
  );
  return response.data;
};

export const usePutProjectRestore = ({
  options,
}: TUsePutProjectRestoreParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["projects"],
    mutationFn: putProjectRestore,
    onSuccess: () => {
      toastNotification("Project restored successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
