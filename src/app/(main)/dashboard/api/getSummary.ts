import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination } from "@/types/IPagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

type TSummary = {
  totalRevenue: number;
  totalCostOfGoods: number;
  grossProfit: number;
  totalDebtReceivable: number;
  totalDebtPayable: number;
};

export type GetSummaryDTO = IPagination & {
  start: string;
  end: string;
};

export type TUseGetSummaryParams = {
  params?: GetSummaryDTO;
  options?: UseQueryOptions<TResult>;
};

type TResult = TSummary;

const getSummary = async (params?: GetSummaryDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.analyticService.summary,
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

export const useGetSummary = ({
  options,
  params,
}: TUseGetSummaryParams = {}) => {
  const query = useQuery({
    queryKey: ["summary", params],
    queryFn: () => getSummary(params),
    ...options,
  });

  return { ...query };
};
