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
import { TImportDebt } from "./getImportDebt";

export type PostImportDebtDTO = {
  productId: string;
  originalAmount: number;
  debtNote?: string;
  importId?: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostImportDebtParams = {
  options?: MutationOptions<TImportDebt, TCreateError, PostImportDebtDTO>;
};

const postImportDebt = async (data: PostImportDebtDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TImportDebt, PostImportDebtDTO>(
      API_URL.importService.debt(data.importId ?? ""),
      data,
    ),
  );
  return response.data;
};

export const usePostImportDebt = ({
  options,
}: TUsePostImportDebtParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["importDebts"],
    mutationFn: postImportDebt,
    onSuccess: () => {
      toastNotification("ImportDebt created successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["importDebts"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
