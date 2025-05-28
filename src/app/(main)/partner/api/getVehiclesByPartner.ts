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

export enum EVehicleType {
  TRACTOR_TRAILER = "TRACTOR_TRAILER",
  HEAVY_TRUCK = "HEAVY_TRUCK",
  CRANE_TRUCK = "CRANE_TRUCK",
  MEDIUM_LIGHT_TRUCK = "MEDIUM_LIGHT_TRUCK",
  SPECIALIZED = "SPECIALIZED",
  UNSPECIFIED = "UNSPECIFIED",
}
export const EVehicleTypeLabel: Map<EVehicleType, string> = new Map([
  [EVehicleType.TRACTOR_TRAILER, "Tractor Trailer"],
  [EVehicleType.HEAVY_TRUCK, "Heavy Truck"],
  [EVehicleType.CRANE_TRUCK, "Crane Truck"],
  [EVehicleType.MEDIUM_LIGHT_TRUCK, "Medium/Light Truck"],
  [EVehicleType.SPECIALIZED, "Specialized Vehicle"],
  [EVehicleType.UNSPECIFIED, "Unspecified Vehicle"],
]);

export type TVehicle = {
  id: string;
  vehicleCode: string;
  driverName: string;
  vehicleType: EVehicleType;
  licensePlate: string;
  capacity: number;
  description: string;
  partnerId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export const defaultTVehicle: TVehicle = {
  id: "",
  vehicleType: EVehicleType.SPECIALIZED,
  licensePlate: "",
  vehicleCode: "",
  capacity: 0,
  description: "",
  driverName: "",
  partnerId: "",
  version: 0,
  createdAt: "",
  updatedAt: "",
  createdBy: "",
  updatedBy: "",
};

export type GetVehiclesDTO = IPagination & { partnerId?: string };

type TResult = IPaginationResponse<TVehicle>;

export type TUseGetVehiclesByPartnerParams = {
  params?: GetVehiclesDTO;
  options?: UseQueryOptions<TResult>;
};

export type TUseGetInfiniteVehiclesByPartnerParams = {
  params: GetVehiclesDTO;
  options?: UndefinedInitialDataInfiniteOptions<
    TResult,
    DefaultError,
    InfiniteData<TResult>,
    QueryKey,
    GetVehiclesDTO
  >;
};

const getVehiclesByPartner = async (params?: GetVehiclesDTO) => {
  try {
    if (params?.partnerId == undefined)
      return DEFAULT_PAGINATION_RESPONSE as TResult;
    const response = await extendedAxios.get<TResult>(
      API_URL.partnerService.vehicleIndex(params?.partnerId),
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

export const useGetVehiclesByPartner = ({
  options,
  params,
}: TUseGetVehiclesByPartnerParams = {}) => {
  const query = useQuery({
    queryKey: ["vehicles", params],
    queryFn: () => getVehiclesByPartner(params),
    ...options,
  });

  return { ...query };
};

export const useGetInfiniteVehiclesByPartner = ({
  options,
  params,
}: TUseGetInfiniteVehiclesByPartnerParams) => {
  return useInfiniteQuery({
    queryKey: ["vehicles", "infinite", params],
    queryFn: ({ pageParam }) => getVehiclesByPartner(pageParam),
    getNextPageParam: (lastPage) => ({
      ...params,
      pageNo: lastPage.pageNo + 1,
    }),
    initialPageParam: params,
    ...options,
  });
};
