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

export const DEFAULT_ORDER = {
  id: "-1",
  exportCode: "Import to warehouse",
};

export type PostImportDTO = {
  supplierId: string;
  saleOrderId: string;
  purchaseOrdersNote?: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostImportParams = {
  options?: MutationOptions<TImport, TCreateError, PostImportDTO>;
};

const postImport = async (data: PostImportDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TImport, PostImportDTO>(
      API_URL.importService.index,
      data,
    ),
  );
  return response.data;
};

export const usePostImport = ({ options }: TUsePostImportParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["imports"],
    mutationFn: postImport,
    onSuccess: () => {
      //toastNotification("Import created successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["imports"] });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
