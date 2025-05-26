import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";
import { TProject } from "./getProjectsByPartner";

export type GetProjectDetailDTO = {
  partnerId?: string;
  projectId?: string;
};

export type UseGetProjectDetailByPartnerParams = {
  params?: GetProjectDetailDTO;
  options?: UseQueryOptions<TProject>;
};

const getProjectDetailByPartner = async (params?: GetProjectDetailDTO) => {
  if (!params) return {} as TProject;
  const { partnerId, projectId } = params;
  if (!partnerId || !projectId) return {} as TProject;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TProject>(
      API_URL.partnerService.projectDetail(partnerId, projectId),
    ),
  );

  return response.data;
};

export const useGetProjectDetailByPartner = ({
  options,
  params,
}: UseGetProjectDetailByPartnerParams = {}) => {
  const query = useQuery({
    queryKey: ["projects", "detail", params],
    queryFn: () => getProjectDetailByPartner(params),
    ...options,
  });

  return { ...query };
};
