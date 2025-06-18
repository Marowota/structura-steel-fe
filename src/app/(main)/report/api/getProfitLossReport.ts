import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination } from "@/types/IPagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

export type TProfitLossReport = {
  saleOrderCode: string;
  customerName: string;
  completionDate: string;
  revenue: number;
  costOfGoods: number;
  deliveryCost: number;
  grossProfit: number;
};

export type GetProfitLossReportsDTO = IPagination & {
  download?: boolean;
  start?: string;
  end?: string;
};

export type TUseGetProfitLossReportsParams = {
  params?: GetProfitLossReportsDTO;
  options?: UseQueryOptions<TResult>;
};

type TResult = TProfitLossReport[];

const getProfitLossReport = async (params?: GetProfitLossReportsDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.reportService.profitLoss,
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

export const downloadProfitLossReport = async (
  params?: GetProfitLossReportsDTO,
) => {
  try {
    const response = await extendedAxios.get<Blob>(
      API_URL.reportService.profitLoss,
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

export const useGetProfitLossReports = ({
  options,
  params,
}: TUseGetProfitLossReportsParams = {}) => {
  const query = useQuery({
    queryKey: ["profitLossReports", params],
    queryFn: () => getProfitLossReport(params),
    ...options,
  });

  return { ...query };
};
