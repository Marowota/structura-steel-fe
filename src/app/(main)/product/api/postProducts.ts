import {
  axiosRequestHandler,
  EToastType,
  extendedAxios,
  toastNotification,
} from "@/lib";
import { EProductType, TProduct } from "./getProducts";
import { API_URL } from "@/constant/apiURL";
import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export type PostProductDTO = {
  name: string;
  productType: EProductType;
  unitWeight: number;
  length: number;
  width: number | null;
  height: number | null;
  thickness: number | null;
  diameter: number | null;
  standard: string;
};

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostProductParams = {
  options?: MutationOptions<TProduct, TCreateError, PostProductDTO>;
};

const postProduct = async (data: PostProductDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TProduct, PostProductDTO>(
      API_URL.productService.index,
      data,
    ),
  );
  return response.data;
};

export const usePostProduct = ({ options }: TUsePostProductParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["products"],
    mutationFn: postProduct,
    onSuccess: () => {
      toastNotification("Product created successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: TCreateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
