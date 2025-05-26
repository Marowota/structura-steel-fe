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

export type TDeleteProjectDTO = {
  projectId: string;
  partnerId: string;
};

export type TUseDeleteProjectParams = {
  params: TDeleteProjectDTO;
  options?: MutationOptions<unknown, TDeleteError, TDeleteProjectDTO>;
};

const deleteProject = async ({ projectId, partnerId }: TDeleteProjectDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.delete<string>(
      API_URL.partnerService.projectSoftDelete(partnerId, projectId),
    ),
  );
  return response;
};

export const useDeleteProject = (
  { options }: TUseDeleteProjectParams = {
    params: {
      projectId: "",
      partnerId: "",
    },
  },
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toastNotification("Project deleted successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toastNotification(
        error.message || "Failed to delete project",
        EToastType.ERROR,
      );
    },
    ...options,
  });
  return { ...mutation };
};
