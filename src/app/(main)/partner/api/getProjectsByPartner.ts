import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination, IPaginationResponse } from "@/types/IPagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { TProduct } from "../../product/api/getProducts";

export type TProject = {
  id: string;
  partnerId: string;
  projectCode: string;
  projectName: string;
  projectAddress: string;
  projectRepresentative: string;
  projectRepresentativePhone: string;
  contactPerson: string;
  contactPersonPhone: string;
  address: string;
  products: TProduct[];
};

export type GetProjectsDTO = IPagination & { partnerId?: string };

type TResult = IPaginationResponse<TProject>;

export type TUseGetProjectsByPartnerParams = {
  params?: GetProjectsDTO;
  options?: UseQueryOptions<TResult>;
};

const getProjectsByPartner = async (params?: GetProjectsDTO) => {
  try {
    if (params?.partnerId == undefined) return {} as TResult;
    const response = await extendedAxios.get<TResult>(
      API_URL.partnerService.projectIndex(params?.partnerId),
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

export const useGetProjectsByPartner = ({
  options,
  params,
}: TUseGetProjectsByPartnerParams = {}) => {
  const query = useQuery({
    queryKey: ["partners", "detail", params],
    queryFn: () => getProjectsByPartner(params),
    ...options,
  });

  return { ...query };
};
