import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination } from "@/types/IPagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { EDebtType } from "../../debt/api/postPayDebt";

type TDebtStatues = {
  status: string;
  count: number;
  totalAmount: number;
};

export type GetDebtStatuesDTO = IPagination & {
  type: EDebtType;
};

export type TUseGetDebtStatuesParams = {
  params?: GetDebtStatuesDTO;
  options?: UseQueryOptions<TResult>;
};

type TResult = TDebtStatues[];

const getDebtStatues = async (params?: GetDebtStatuesDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.analyticService.debtStatus,
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

export const useGetDebtStatues = ({
  options,
  params,
}: TUseGetDebtStatuesParams = {}) => {
  const query = useQuery({
    queryKey: ["debtStatues", params],
    queryFn: () => getDebtStatues(params),
    ...options,
  });

  return { ...query };
};
