import { GetProjectsDTO, TProject } from "../partner/api/getProjectsByPartner";
import { GetVehiclesDTO, TVehicle } from "../partner/api/getVehiclesByPartner";
import {
  GetWarehousesDTO,
  TWarehouse,
} from "../partner/api/getWarehouseByPartner";
import { GetProductsDTO, TProduct } from "../product/api/getProducts";
import { GetOrdersDTO, TOrder } from "../order/api/getOrders";
import { GetPartnersDTO, TPartner } from "../partner/api/getPartners";
import { IPaginationResponse } from "@/types/IPagination";
import { ColumnDef } from "@tanstack/react-table";

export enum ERestoreType {
  PARTNER = "Partner",
  PROJECT = "Project",
  VEHICLE = "Vehicle",
  WAREHOUSE = "Warehouse",
  PRODUCT = "Product",
  SALE_ORDER = "Sale order",
}

export type TSoftDel =
  | TPartner
  | TProject
  | TVehicle
  | TWarehouse
  | TProduct
  | TOrder;
export type TSoftDelDTO =
  | GetPartnersDTO
  | GetProjectsDTO
  | GetVehiclesDTO
  | GetWarehousesDTO
  | GetProductsDTO
  | GetOrdersDTO;

export type TRestoreAction = {
  key: ERestoreType;
  dataHook: ({ params }: { params: TSoftDelDTO }) => {
    data: IPaginationResponse<TSoftDel> | undefined;
  };
  columns: ColumnDef<TSoftDel>[];
  paramsKey?: string;
};
