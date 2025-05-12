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

export type TUseDeleteProductParams = {
  options?: MutationOptions<unknown, TDeleteError, string>;
};

const deleteProduct = async (productId: string = "") => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.delete<string>(API_URL.productService.detail(productId)),
  );
  return response;
};

export const useDeleteProduct = ({ options }: TUseDeleteProductParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toastNotification("Product deleted successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toastNotification(
        error.message || "Failed to delete product",
        EToastType.ERROR,
      );
    },
    ...options,
  });
  return { ...mutation };
};
