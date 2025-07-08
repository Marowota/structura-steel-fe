import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";
import { EImportStatus } from "./getImports";
import { TPartner } from "../../partner/api/getPartners";
import { TProject } from "../../partner/api/getProjectsByPartner";
import { TImportProduct } from "./getImportsProduct";

export type TImportDetail = {
  id: string;
  status: EImportStatus;
  importCode: string;
  saleOrderId: string;
  confirmationFromSupplier: string;
  supplier: TPartner;
  project: TProject;
  totalAmount: number;
  purchaseOrdersNote: string;
  purchaseOrderDetails: TImportProduct[];
  purchaseDebts: unknown;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type GetImportDetailDTO = {
  id?: string;
};

export type UseGetImportDetailParams = {
  params?: GetImportDetailDTO;
  options?: UseQueryOptions<TImportDetail>;
};

const getImportDetail = async (params?: GetImportDetailDTO) => {
  if (!params?.id) return {} as TImportDetail;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TImportDetail>(
      API_URL.importService.detail(params?.id ?? ""),
    ),
  );

  return response.data;
};

export const useGetImportDetail = ({
  options,
  params,
}: UseGetImportDetailParams = {}) => {
  const query = useQuery({
    queryKey: ["imports", "detail", params],
    queryFn: () => getImportDetail(params),
    ...options,
  });

  return { ...query };
};
