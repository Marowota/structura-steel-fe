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

export type PostProjectDTO = {
  projectName: string;
  projectAddress: string;
  projectRepresentative: string;
  projectRepresentativePhone: string;
  contactPerson: string;
  contactPersonPhone: string;
  address: string;
  productIds?: number[];
  partnerId: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostProjectParams = {
  options?: MutationOptions<TProject, TCreateError, PostProjectDTO>;
};

const postProject = async (data: PostProjectDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TProject, PostProjectDTO>(
      API_URL.partnerService.projectIndex(data.partnerId),
      data,
    ),
  );
  return response.data;
};

export const usePostProject = ({ options }: TUsePostProjectParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["projects"],
    mutationFn: postProject,
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
