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

export type PutConfirmImportDTO = {
  importId: string;
  confirmationFromSupplier?: EConfirmationFromSupplier;
};

export enum EConfirmationFromSupplier {
  YES = "YES",
  NO = "NO",
}

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutConfirmImportParams = {
  options?: MutationOptions<TImport, TCreateError, PutConfirmImportDTO>;
};

export const putConfirmImport = async (data: PutConfirmImportDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TImport, PutConfirmImportDTO>(
      API_URL.importService.detail(data.importId),
      data,
    ),
  );
  return response.data;
};

export const usePutConfirmImport = ({
  options,
}: TUsePutConfirmImportParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["imports"],
    mutationFn: putConfirmImport,
    onSuccess: () => {
      toastNotification("Import confirmed successfully", EToastType.SUCCESS);
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
