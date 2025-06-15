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
import { PostImportDebtDTO } from "./postImportDebt";

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostImportDebtBatchParams = {
  options?: MutationOptions<TImportDebt, TCreateError, PostImportDebtDTO[]>;
};

const postImportDebtBatch = async (data: PostImportDebtDTO[]) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TImportDebt, PostImportDebtDTO[]>(
      API_URL.importService.debtDetailBatch(data[0].importId ?? ""),
      data.map((item) => ({
        ...item, // Spread the existing properties
        importId: undefined,
      })),
    ),
  );
  return response.data;
};

export const usePostImportDebtBatch = ({
  options,
}: TUsePostImportDebtBatchParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["importDebts", "product", "batch"],
    mutationFn: postImportDebtBatch,
    onSuccess: () => {
      toastNotification("Import Debt created successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["importDebts"] });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
