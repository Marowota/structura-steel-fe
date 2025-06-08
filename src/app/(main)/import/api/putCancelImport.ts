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
import { TImport } from "./getImports";

export type PutCancelImportDTO = {
  importId: string;
  reason?: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutCancelImportParams = {
  options?: MutationOptions<TImport, TCreateError, PutCancelImportDTO>;
};

export const putCancelImport = async (data: PutCancelImportDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TImport, PutCancelImportDTO>(
      API_URL.importService.cancel(data.importId),
      data,
      { params: { reason: data.reason } },
    ),
  );
  return response.data;
};

export const usePutCancelImport = ({
  options,
}: TUsePutCancelImportParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["imports"],
    mutationFn: putCancelImport,
    onSuccess: () => {
      toastNotification("Import cancelled successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["imports"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
