import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { TPartner } from "./getPartners";
import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";

export type GetPartnerDetailDTO = {
  id?: string;
};

export type UseGetPartnerDetailParams = {
  params?: GetPartnerDetailDTO;
  options?: UseQueryOptions<TPartner>;
};

const getPartnerDetail = async (params?: GetPartnerDetailDTO) => {
  if (!params?.id) return {} as TPartner;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TPartner>(
      API_URL.partnerService.detail(params?.id ?? ""),
    ),
  );

  return response.data;
};

export const useGetPartnerDetail = ({
  options,
  params,
}: UseGetPartnerDetailParams = {}) => {
  const query = useQuery({
    queryKey: ["partners", "detail", params],
    queryFn: () => getPartnerDetail(params),
    ...options,
  });

  return { ...query };
};
