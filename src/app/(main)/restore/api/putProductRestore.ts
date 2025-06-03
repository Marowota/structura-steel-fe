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
import { TProduct } from "../../product/api/getProducts";

export type PutProductRestoreDTO = {
  id: string;
};

export type TUpdateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutProductRestoreParams = {
  options?: MutationOptions<TProduct, TUpdateError, PutProductRestoreDTO>;
};

const putProductRestore = async (dto: PutProductRestoreDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TProduct>(API_URL.productService.restore(dto.id)),
  );
  return response.data;
};

export const usePutProductRestore = ({
  options,
}: TUsePutProductRestoreParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["products"],
    mutationFn: putProductRestore,
    onSuccess: () => {
      toastNotification("Product restored successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: TUpdateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
