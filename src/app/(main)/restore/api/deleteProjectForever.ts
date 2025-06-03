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

export type TDeleteProjectForeverDTO = {
  projectId: string;
  partnerId: string;
};

export type TUseDeleteProjectForeverParams = {
  params: TDeleteProjectForeverDTO;
  options?: MutationOptions<unknown, TDeleteError, TDeleteProjectForeverDTO>;
};

const deleteProjectForever = async ({
  projectId,
  partnerId,
}: TDeleteProjectForeverDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.delete<string>(
      API_URL.partnerService.projectDetail(partnerId, projectId),
    ),
  );
  return response;
};

export const useDeleteProjectForever = (
  { options }: TUseDeleteProjectForeverParams = {
    params: {
      projectId: "",
      partnerId: "",
    },
  },
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteProjectForever,
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
