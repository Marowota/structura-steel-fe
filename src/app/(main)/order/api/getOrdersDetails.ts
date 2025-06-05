import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequestHandler, extendedAxios } from "@/lib";
import { API_URL } from "@/constant/apiURL";
import { EOrderStatus } from "./getOrders";
import { TPartner } from "../../partner/api/getPartners";
import { TProject } from "../../partner/api/getProjectsByPartner";
import { EOrderType } from "./postOrder";
import { TOrderProduct } from "./getOrdersProduct";

export type TOrderDetail = {
  id: string;
  partner: TPartner;
  project: TProject;
  status: EOrderStatus;
  orderType: EOrderType;
  totalAmount: number;
  saleOrdersNote: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  exportCode: string;
  saleOrderDetails: TOrderProduct[];
};

export type GetOrderDetailDTO = {
  id?: string;
};

export type UseGetOrderDetailParams = {
  params?: GetOrderDetailDTO;
  options?: UseQueryOptions<TOrderDetail>;
};

const getOrderDetail = async (params?: GetOrderDetailDTO) => {
  if (!params?.id) return {} as TOrderDetail;
  const response = await axiosRequestHandler(() =>
    extendedAxios.get<TOrderDetail>(
      API_URL.orderService.detail(params?.id ?? ""),
    ),
  );

  return response.data;
};

export const useGetOrderDetail = ({
  options,
  params,
}: UseGetOrderDetailParams = {}) => {
  const query = useQuery({
    queryKey: ["orders", "detail", params],
    queryFn: () => getOrderDetail(params),
    ...options,
  });

  return { ...query };
};
