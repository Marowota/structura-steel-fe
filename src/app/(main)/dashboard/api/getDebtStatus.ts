import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination } from "@/types/IPagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { EDebtType } from "../../debt/api/postPayDebt";

type TDebtStatus = {
  status: string;
  count: number;
  totalAmount: number;
};

export type GetDebtStatusDTO = IPagination & {
  type: EDebtType;
};

export type TUseGetDebtStatusParams = {
  params?: GetDebtStatusDTO;
  options?: UseQueryOptions<TResult>;
};

type TResult = TDebtStatus[];

const getDebtStatus = async (params?: GetDebtStatusDTO) => {
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

export const useGetDebtStatus = ({
  options,
  params,
}: TUseGetDebtStatusParams = {}) => {
  const query = useQuery({
    queryKey: ["debtStatus", params],
    queryFn: () => getDebtStatus(params),
    ...options,
  });

  return { ...query };
};
