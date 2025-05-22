import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import {
  DEFAULT_PAGINATION_RESPONSE,
  IPagination,
  IPaginationResponse,
} from "@/types/IPagination";
import {
  DefaultError,
  InfiniteData,
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
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

export const defaultTProject: TProject = {
  id: "",
  partnerId: "",
  projectCode: "",
  projectName: "",
  projectAddress: "",
  projectRepresentative: "",
  projectRepresentativePhone: "",
  contactPerson: "",
  contactPersonPhone: "",
  address: "",
  products: [],
};

export type GetProjectsDTO = IPagination & { partnerId?: string };

type TResult = IPaginationResponse<TProject>;

export type TUseGetProjectsByPartnerParams = {
  params?: GetProjectsDTO;
  options?: UseQueryOptions<TResult>;
};

export type TUseGetInfiniteProjectsByPartnerParams = {
  params: GetProjectsDTO;
  options?: UndefinedInitialDataInfiniteOptions<
    TResult,
    DefaultError,
    InfiniteData<TResult>,
    QueryKey,
    GetProjectsDTO
  >;
};

const getProjectsByPartner = async (params?: GetProjectsDTO) => {
  try {
    if (params?.partnerId == undefined)
      return DEFAULT_PAGINATION_RESPONSE as TResult;
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
    queryKey: ["partners", "detail", "project", params],
    queryFn: () => getProjectsByPartner(params),
    ...options,
  });

  return { ...query };
};

export const useGetInfiniteProjectsByPartner = ({
  options,
  params,
}: TUseGetInfiniteProjectsByPartnerParams) => {
  return useInfiniteQuery({
    queryKey: ["partners", "detail", "project", "infinite", params],
    queryFn: ({ pageParam }) => getProjectsByPartner(pageParam),
    getNextPageParam: (lastPage) => ({
      ...params,
      pageNo: lastPage.pageNo + 1,
    }),
    initialPageParam: params,
    ...options,
  });
};
