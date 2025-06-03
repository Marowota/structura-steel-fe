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

export type TUseDeleteProductForeverParams = {
  options?: MutationOptions<unknown, TDeleteError, string>;
};

const deleteProductForever = async (productId: string = "") => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.delete<string>(API_URL.productService.detail(productId)),
  );
  return response;
};

export const useDeleteProductForever = ({
  options,
}: TUseDeleteProductForeverParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteProductForever,
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
