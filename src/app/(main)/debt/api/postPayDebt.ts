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

export enum EDebtType {
  ORDER = "SALE_DEBT",
  DELIVERY = "DELIVERY_DEBT",
  IMPORT = "PURCHASE_DEBT",
}

export type TPayDebt = {
  id: string;
  debtType: EDebtType;
  debtId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  notes: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type PostPayDebtDTO = {
  debtType: EDebtType;
  debtId: string;
  paymentDate: string;
  amountPaid: string;
  paymentMethod: string;
  notes: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostPayDebtParams = {
  options?: MutationOptions<TPayDebt, TCreateError, PostPayDebtDTO>;
};

const postPayDebt = async (data: PostPayDebtDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TPayDebt, PostPayDebtDTO>(
      API_URL.payService.index,
      data,
    ),
  );
  return response.data;
};

export const usePostPayDebt = ({ options }: TUsePostPayDebtParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["payDebts"],
    mutationFn: postPayDebt,
    onSuccess: () => {
      toastNotification("Debt payment has registered", EToastType.SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["payDebts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["deliveryDebts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["importDebts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["orderDebts"],
      });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
