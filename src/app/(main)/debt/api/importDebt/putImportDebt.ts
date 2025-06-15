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

export type PutImportDebtDTO = {
  id: string;
  productId: string;
  amount: number;
  debtNote?: string;
  importId: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutImportDebtParams = {
  options?: MutationOptions<TImportDebt, TCreateError, PutImportDebtDTO>;
};

const putImportDebt = async (data: PutImportDebtDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TImportDebt, PutImportDebtDTO>(
      API_URL.importService.debtDetail(data.importId ?? "", data.id ?? ""),
      data,
    ),
  );
  return response.data;
};

export const usePutImportDebt = ({ options }: TUsePutImportDebtParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["importDebts"],
    mutationFn: putImportDebt,
    onSuccess: () => {
      toastNotification("ImportDebt updated successfully", EToastType.SUCCESS);
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
