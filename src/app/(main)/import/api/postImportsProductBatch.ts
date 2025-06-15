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
import { PostImportProductDTO } from "./postImportsProduct";
import { TImportProduct } from "./getImportsProduct";

export type TCreateError = {
  timestamp: string;
  message: string;
  details: string;
};

export type TUsePostImportProductBatchParams = {
  options?: MutationOptions<
    TImportProduct[],
    TCreateError,
    PostImportProductDTO[]
  >;
};

const postImportProductBatch = async (data: PostImportProductDTO[]) => {
  const response = await axiosRequestHandler(() =>
    extendedAxios.post<TImportProduct[], PostImportProductDTO[]>(
      API_URL.importService.importProductBatch(data[0].importId),
      data,
    ),
  );
  return response.data;
};

export const usePostImportProductBatch = ({
  options,
}: TUsePostImportProductBatchParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["imports", "product", "batch"],
    mutationFn: postImportProductBatch,
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
