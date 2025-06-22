import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination } from "@/types/IPagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

type TTopProduct = {
  name: string;
  value: number;
};

export type GetTopProductDTO = IPagination & {
  start: string;
  end: string;
  limit?: number;
};

export type TUseGetTopProductParams = {
  params?: GetTopProductDTO;
  options?: UseQueryOptions<TResult>;
};

type TResult = TTopProduct[];

const getTopProduct = async (params?: GetTopProductDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.analyticService.topProduct,
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

export const useGetTopProduct = ({
  options,
  params,
}: TUseGetTopProductParams = {}) => {
  const query = useQuery({
    queryKey: ["topProduct", params],
    queryFn: () => getTopProduct(params),
    ...options,
  });

  return { ...query };
};
