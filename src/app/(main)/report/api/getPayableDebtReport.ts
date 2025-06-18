import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination } from "@/types/IPagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

export type TPayableDebtReport = {
  partnerName: string;
  debtType: string;
  referenceCode: string;
  debtDate: string;
  remainingAmount: number;
};

export type GetPayableDebtReportsDTO = IPagination & {
  download?: boolean;
  start?: string;
  end?: string;
};

export type TUseGetPayableDebtReportsParams = {
  params?: GetPayableDebtReportsDTO;
  options?: UseQueryOptions<TResult>;
};

type TResult = TPayableDebtReport[];

const getPayableDebtReport = async (params?: GetPayableDebtReportsDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.reportService.payables,
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

export const downloadPayableDebtReport = async (
  params?: GetPayableDebtReportsDTO,
) => {
  try {
    const response = await extendedAxios.get<Blob>(
      API_URL.reportService.payables,
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

export const useGetPayableDebtReports = ({
  options,
  params,
}: TUseGetPayableDebtReportsParams = {}) => {
  const query = useQuery({
    queryKey: ["payableDebtReports", params],
    queryFn: () => getPayableDebtReport(params),
    ...options,
  });

  return { ...query };
};
