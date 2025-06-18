import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination } from "@/types/IPagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

export type TReceivableDebtReport = {
  customerName: string;
  orderCode: string;
  debtDate: string;
  remainingAmount: number;
  status: string;
};

export type GetReceivableDebtReportsDTO = IPagination & {
  download?: boolean;
  start?: string;
  end?: string;
};

export type TUseGetReceivableDebtReportsParams = {
  params?: GetReceivableDebtReportsDTO;
  options?: UseQueryOptions<TResult>;
};

type TResult = TReceivableDebtReport[];

const getReceivableDebtReport = async (
  params?: GetReceivableDebtReportsDTO,
) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.reportService.receivables,
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const downloadReceivableDebtReport = async (
  params?: GetReceivableDebtReportsDTO,
) => {
  try {
    const response = await extendedAxios.get<Blob>(
      API_URL.reportService.receivables,
      {
        params: { ...params, download: true },
        responseType: "blob",
      },
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetReceivableDebtReports = ({
  options,
  params,
}: TUseGetReceivableDebtReportsParams = {}) => {
  const query = useQuery({
    queryKey: ["receivableDebtReports", params],
    queryFn: () => getReceivableDebtReport(params),
    ...options,
  });

  return { ...query };
};
