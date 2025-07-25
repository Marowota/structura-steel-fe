import { API_URL } from "@/constant/apiURL";
import { extendedAxios } from "@/lib";
import { IPagination, IPaginationResponse } from "@/types/IPagination";
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
import { EConfirmation } from "./putConfirmDelivery";

export enum EDeliveryStatus {
  NEW = "New",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  DONE = "Done",
}

export enum EDeliveryType {
  IMPORT = "Warehouse Import",
  EXPORT = "Project Delivery",
}

export type TDelivery = {
  id: string;
  status: EDeliveryStatus;
  deliveryCode: string;
  confirmationFromPartner: EConfirmation;
  confirmationFromFactory: EConfirmation;
  confirmationFromReceiver: EConfirmation;
  purchaseOrderId: string;
  deliveryDate: string;
  totalDeliveryFee: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type GetDeliveriesDTO = IPagination & {};

export type TUseGetDeliveriesParams = {
  params?: GetDeliveriesDTO;
  options?: UseQueryOptions<TResult>;
};

export type TUseGetInfiniteOrdersParams = {
  params: GetDeliveriesDTO;
  options?: UndefinedInitialDataInfiniteOptions<
    TResult,
    DefaultError,
    InfiniteData<TResult>,
    QueryKey,
    GetDeliveriesDTO
  >;
};

type TResult = IPaginationResponse<TDelivery>;

const getDeliveries = async (params?: GetDeliveriesDTO) => {
  try {
    const response = await extendedAxios.get<TResult>(
      API_URL.deliveryService.index,
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

export const useGetDeliveries = ({
  options,
  params,
}: TUseGetDeliveriesParams = {}) => {
  const query = useQuery({
    queryKey: ["deliveries", params],
    queryFn: () => getDeliveries(params),
    ...options,
  });

  return { ...query };
};

export const useGetInfiniteDeliveries = ({
  options,
  params,
}: TUseGetInfiniteOrdersParams) => {
  return useInfiniteQuery({
    queryKey: ["deliveries", "infinite", params],
    queryFn: ({ pageParam }) => getDeliveries(pageParam),
    getNextPageParam: (lastPage) => ({
      ...params,
      pageNo: lastPage.pageNo + 1,
    }),
    initialPageParam: params,
    ...options,
  });
};
