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
import { TProject } from "./getProjectsByPartner";

export type PutProjectDTO = {
  partnerId: string;
  projectId: string;
  projectName: string;
  projectAddress: string;
  projectRepresentative: string;
  projectRepresentativePhone: string;
  contactPerson: string;
  contactPersonPhone: string;
  address: string;
  productIds?: number[];
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutProjectParams = {
  options?: MutationOptions<TProject, TCreateError, PutProjectDTO>;
};

const putProject = async (data: PutProjectDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TProject, PutProjectDTO>(
      API_URL.partnerService.projectDetail(data.partnerId, data.projectId),
      data,
    ),
  );
  return response.data;
};

export const usePutProject = ({ options }: TUsePutProjectParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["projects"],
    mutationFn: putProject,
    onSuccess: () => {
      toastNotification("Project created successfully", EToastType.SUCCESS);
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
