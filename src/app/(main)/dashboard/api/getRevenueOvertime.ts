import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination } from "@/types/IPagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

type TRevenueOvertime = {
  label: string;
  value: number;
};

export type GetRevenueOvertimeDTO = IPagination & {
  start: string;
  end: string;
};

export type TUseGetRevenueOvertimeParams = {
  params?: GetRevenueOvertimeDTO;
  options?: UseQueryOptions<TResult>;
};

type TResult = TRevenueOvertime[];

const getRevenueOvertime = async (params?: GetRevenueOvertimeDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.analyticService.revenueOvertime,
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

export const useGetRevenueOvertime = ({
  options,
  params,
}: TUseGetRevenueOvertimeParams = {}) => {
  const query = useQuery({
    queryKey: ["revenueOvertime", params],
    queryFn: () => getRevenueOvertime(params),
    ...options,
  });

  return { ...query };
};
