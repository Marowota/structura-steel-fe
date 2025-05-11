import {
  axiosRequestHandler,
  EToastType,
  extendedAxios,
  toastNotification,
} from "@/lib";
import { TProduct } from "./getProducts";
import { API_URL } from "@/constant/apiURL";
import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export type PutProductDTO = {
  id: string;
  data: {
    code: string;
    name: string;
    unitWeight: number;
    length: number;
    width: number | null;
    height: number | null;
    thickness: number | null;
    diameter: number | null;
    standard: string;
  };
};

export type TUpdateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePutProductParams = {
  options?: MutationOptions<TProduct, TUpdateError, PutProductDTO>;
};

const putProduct = async (dto: PutProductDTO) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.put<TProduct>(
      API_URL.productService.detail(dto.id),
      dto.data,
    ),
  );
  return response.data;
};

export const usePutProduct = ({ options }: TUsePutProductParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["products"],
    mutationFn: putProduct,
    onSuccess: () => {
      toastNotification("Product updated successfully", EToastType.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: TUpdateError) => {
      toastNotification(error.message, EToastType.ERROR);
    },
    ...options,
  });
  return { ...mutation };
};
