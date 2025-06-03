"use client";
import {
  Dropdown,
  EBaseActions,
  Input,
  InputSearch,
  mapArrayToTDropdown,
  TTableActionsProps,
} from "@/components/elements";
import { ColumnDef } from "@tanstack/react-table";
import { Trash, Upload } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { TableFilter } from "@/components/elements/tableFilter";
import { useDebouncedCallback } from "use-debounce";
import {
  DEFAULT_PAGINATION_PARAMS,
  DEFAULT_PAGINATION_RESPONSE,
  IPagination,
  IPaginationResponse,
} from "@/types/IPagination";
import { partnerColumn } from "../partner/component/partner/partnerTable";
import {
  GetPartnersDTO,
  TPartner,
  useGetInfinitePartners,
  useGetPartners,
} from "../partner/api/getPartners";
import { projectColumns } from "../partner/component/project/projectTable";
import {
  GetProjectsDTO,
  TProject,
  useGetProjectsByPartner,
} from "../partner/api/getProjectsByPartner";
import { vehicleColumns } from "../partner/component/vehicle/vehicleTable";
import {
  GetVehiclesDTO,
  TVehicle,
  useGetVehiclesByPartner,
} from "../partner/api/getVehiclesByPartner";
import { warehouseColumns } from "../partner/component/warehouse/warehouseTable";
import {
  GetWarehousesDTO,
  TWarehouse,
  useGetWarehousesByPartner,
} from "../partner/api/getWarehouseByPartner";
import { productColumns } from "../product/component/productTable";
import {
  GetProductsDTO,
  TProduct,
  useGetProducts,
} from "../product/api/getProducts";
import { orderColumns } from "../order/component/orderTable";
import { GetOrdersDTO, TOrder, useGetOrders } from "../order/api/getOrders";
import { usePutPartnerRestore } from "./api/putPartnerRestore";
import { usePutProjectRestore } from "./api/putProjectRestore";
import { usePutVehicleRestore } from "./api/putVehicleRestore";
import { usePutWarehouseRestore } from "./api/putWarehouseRestore";
import { usePutProductRestore } from "./api/putProductRestore";
import { useDeletePartnerForever } from "./api/deletePartnerForever";
import { useDeleteProjectForever } from "./api/deleteProjectForever";
import { useDeleteVehicleForever } from "./api/deleteVehicleForever";
import { useDeleteWarehouseForever } from "./api/deleteWarehouseForever";
import { useDeleteProductForever } from "./api/deleteProductForever";

export enum ERestoreType {
  PARTNER = "Partner",
  PROJECT = "Project",
  VEHICLE = "Vehicle",
  WAREHOUSE = "Warehouse",
  PRODUCT = "Product",
  SALE_ORDER = "Sale order",
}

type TSoftDel = TPartner | TProject | TVehicle | TWarehouse | TProduct | TOrder;
type TSoftDelDTO =
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

export const mapRestoreTypeToAction = new Map<ERestoreType, TRestoreAction>([
  [
    ERestoreType.PARTNER,
    {
      key: ERestoreType.PARTNER,
      columns: partnerColumn as ColumnDef<TSoftDel>[],
      dataHook: useGetPartners,
      paramsKey: "pn",
    },
  ],
  [
    ERestoreType.PROJECT,
    {
      key: ERestoreType.PROJECT,
      columns: projectColumns as ColumnDef<TSoftDel>[],
      dataHook: useGetProjectsByPartner,
      paramsKey: "pj",
    },
  ],
  [
    ERestoreType.VEHICLE,
    {
      key: ERestoreType.VEHICLE,
      columns: vehicleColumns as ColumnDef<TSoftDel>[],
      dataHook: useGetVehiclesByPartner,
      paramsKey: "vh",
    },
  ],
  [
    ERestoreType.WAREHOUSE,
    {
      key: ERestoreType.WAREHOUSE,
      columns: warehouseColumns as ColumnDef<TSoftDel>[],
      dataHook: useGetWarehousesByPartner,
      paramsKey: "wh",
    },
  ],
  [
    ERestoreType.PRODUCT,
    {
      key: ERestoreType.PRODUCT,
      columns: productColumns as ColumnDef<TSoftDel>[],
      dataHook: useGetProducts,
      paramsKey: "pd",
    },
  ],
  [
    ERestoreType.SALE_ORDER,
    {
      key: ERestoreType.SALE_ORDER,
      columns: orderColumns as ColumnDef<TSoftDel>[],
      dataHook: useGetOrders,
      paramsKey: "so",
    },
  ],
]);

export default function RestorePage() {
  const { mutateAsync: restorePartner } = usePutPartnerRestore();
  const { mutateAsync: restoreProject } = usePutProjectRestore();
  const { mutateAsync: restoreVehicle } = usePutVehicleRestore();
  const { mutateAsync: restoreWarehouse } = usePutWarehouseRestore();
  const { mutateAsync: restoreProduct } = usePutProductRestore();

  const { mutateAsync: deletePartnerForever } = useDeletePartnerForever();
  const { mutateAsync: deleteProjectForever } = useDeleteProjectForever();
  const { mutateAsync: deleteVehicleForever } = useDeleteVehicleForever();
  const { mutateAsync: deleteWarehouseForever } = useDeleteWarehouseForever();
  const { mutateAsync: deleteProductForever } = useDeleteProductForever();

  const [restoreType, setRestoreType] = useState<ERestoreType>(
    ERestoreType.PARTNER,
  );
  const [selectedPartner, setSelectedPartner] = useState<string>();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const defaultParams: IPagination = {
    pageNo: 0,
    pageSize: 10,
    sortBy: "",
    sortDir: "asc",
    search: "",
  };

  const [partnerParams, setPartnerParams] = useState<GetPartnersDTO>({
    ...defaultParams,
    sortBy: "partnerName",
  });

  const {
    data: infinitePartners,
    fetchNextPage: fetchNextPagePartners,
    isFetchingNextPage: isPartnersLoading,
  } = useGetInfinitePartners({
    params: partnerParams,
  });

  const partners = useMemo(() => {
    const lastPage =
      infinitePartners?.pages?.[infinitePartners.pages.length - 1] ??
      DEFAULT_PAGINATION_RESPONSE;
    return {
      ...lastPage,
      content: infinitePartners?.pages
        ? infinitePartners.pages.map((page) => page.content).flat()
        : [],
    };
  }, [infinitePartners]);

  const showPartnerSearch =
    restoreType === ERestoreType.PROJECT ||
    restoreType === ERestoreType.VEHICLE ||
    restoreType === ERestoreType.WAREHOUSE;

  const action = mapRestoreTypeToAction.get(restoreType) ?? {
    key: ERestoreType.PARTNER,
    columns: partnerColumn as ColumnDef<TSoftDel>[],
    dataHook: useGetPartners,
    paramsKey: "pn",
  };

  const tableActions: TTableActionsProps<TSoftDel>[] = [
    {
      action: EBaseActions.EDIT,
      icon: <Upload className="h-4 w-4" />,
      onClick: (row) => {
        const id = row.getValue("id") as string;
        const partnerId = selectedPartner ?? "";

        switch (restoreType) {
          case ERestoreType.PARTNER:
            restorePartner({ id });
            break;
          case ERestoreType.PROJECT:
            restoreProject({ partnerId, id });
            break;
          case ERestoreType.VEHICLE:
            restoreVehicle({ partnerId, id });
            break;
          case ERestoreType.WAREHOUSE:
            restoreWarehouse({ partnerId, id });
            break;
          case ERestoreType.PRODUCT:
            restoreProduct({ id });
            break;
          default:
            console.warn("Unknown restore type:", restoreType);
        }
        console.log("Restore action clicked for row:", row);
      },
    },
    {
      action: EBaseActions.DELETE,
      icon: <Trash className="h-4 w-4" />,
      onClick: (row) => {
        const id = row.getValue("id") as string;
        const partnerId = selectedPartner ?? "";

        switch (restoreType) {
          case ERestoreType.PARTNER:
            deletePartnerForever({ partnerId: id });
            break;
          case ERestoreType.PROJECT:
            deleteProjectForever({ partnerId, projectId: id });
            break;
          case ERestoreType.VEHICLE:
            deleteVehicleForever({ partnerId, vehicleId: id });
            break;
          case ERestoreType.WAREHOUSE:
            deleteWarehouseForever({ partnerId, warehouseId: id });
            break;
          case ERestoreType.PRODUCT:
            deleteProductForever(id);
            break;
          default:
            console.warn("Unknown delete type:", restoreType);
        }
        console.log("Delete action clicked for row:", row);
      },
    },
  ];

  return (
    <>
      {/* <RestoreDeleteModal
        isOpen={openDeleteId ?? false}
        onClose={() => setOpenDeleteId(undefined)}
        deleteId={openDeleteId}
      /> */}
      <div className="flex h-full flex-col gap-3 pt-3">
        <div className="flex justify-start gap-2">
          <Input
            placeholder="Search restore"
            className="min-w-64"
            onChange={(e) => {
              debouncedSearch(e.currentTarget.value);
            }}
          />

          <div className="w-64">
            <Dropdown
              placeholder="Partner"
              options={mapArrayToTDropdown(
                Object.entries(ERestoreType).map(([, value]) => ({
                  label: value,
                  value: value,
                })),
                "label",
                "value",
              )}
              onItemSelect={(item) => {
                console.log("Selected restore type:", item);
                setRestoreType(item.value as ERestoreType);
              }}
            />
          </div>
          {showPartnerSearch && (
            <div className="w-64">
              <InputSearch
                placeholder="Search partner"
                options={mapArrayToTDropdown(
                  partners?.content ?? [],
                  "partnerName",
                  "id",
                )}
                paginationInfo={partners}
                onSearch={(label) => {
                  setPartnerParams((prev) => ({
                    ...prev,
                    search: label,
                    pageNo: 0,
                  }));
                }}
                onPageChange={() => {
                  fetchNextPagePartners();
                }}
                onItemSelect={(item) => {
                  setSelectedPartner(item.value);
                }}
                required
                isLoading={isPartnersLoading}
              />
            </div>
          )}
        </div>
        <Suspense>
          <TableFilter
            key={restoreType + selectedPartner}
            numberTitle="Number of items: "
            columns={action.columns}
            dataHook={action.dataHook}
            search={search}
            onRowClick={() => {}}
            actions={tableActions}
            softDel={true}
            paramsDefault={{
              ...DEFAULT_PAGINATION_PARAMS,
              partnerId: selectedPartner,
            }}
            paramsKey={action.paramsKey}
          />
        </Suspense>
      </div>
    </>
  );
}
