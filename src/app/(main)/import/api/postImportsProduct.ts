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

export type PostImportProductDTO = {
  importId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  name?: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostImportProductParams = {
  options?: MutationOptions<TImport, TCreateError, PostImportProductDTO>;
};

const postImportProduct = async (data: PostImportProductDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TImport, PostImportProductDTO>(
      API_URL.importService.importProduct(data.importId),
      data,
    ),
  );
  return response.data;
};

export const usePostImportProduct = ({
  options,
}: TUsePostImportProductParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["imports", "product"],
    mutationFn: postImportProduct,
    onSuccess: () => {
      toastNotification("Import created successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["imports"] });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
