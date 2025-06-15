import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";
import { TImportDebt } from "./getImportDebt";

export type GetImportDebtDetailDTO = {
  id?: string;
  importId?: string;
};

export type UseGetImportDebtDetailParams = {
  params?: GetImportDebtDetailDTO;
  options?: UseQueryOptions<TImportDebt>;
};

const getImportDebtDetail = async (params?: GetImportDebtDetailDTO) => {
  if (!params?.importId) return {} as TImportDebt;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TImportDebt>(
      API_URL.importService.debtDetail(
        params?.importId ?? "",
        params?.id ?? "",
      ),
    ),
  );

  return response.data;
};

export const useGetImportDebtDetail = ({
  options,
  params,
}: UseGetImportDebtDetailParams = {}) => {
  const query = useQuery({
    queryKey: ["importDebts", "detail", params],
    queryFn: () => getImportDebtDetail(params),
    ...options,
  });

  return { ...query };
};
