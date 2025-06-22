import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination } from "@/types/IPagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

type TTopCustomer = {
  name: string;
  value: number;
};

export type GetTopCustomerDTO = IPagination & {
  start: string;
  end: string;
  limit?: number;
};

export type TUseGetTopCustomerParams = {
  params?: GetTopCustomerDTO;
  options?: UseQueryOptions<TResult>;
};

type TResult = TTopCustomer[];

const getTopCustomer = async (params?: GetTopCustomerDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.analyticService.topCustomer,
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

export const useGetTopCustomer = ({
  options,
  params,
}: TUseGetTopCustomerParams = {}) => {
  const query = useQuery({
    queryKey: ["topCustomer", params],
    queryFn: () => getTopCustomer(params),
    ...options,
  });

  return { ...query };
};
