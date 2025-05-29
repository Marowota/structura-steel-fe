"use client";

import {
  Button,
  EBaseActions,
  Input,
  TTableActionsProps,
} from "@/components/elements";
import { Row } from "@tanstack/react-table";

import { Suspense, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { TableFilter } from "@/components/elements/tableFilter";
import { useDebouncedCallback } from "use-debounce";
import {
  TWarehouse,
  useGetWarehousesByPartner,
} from "../../api/getWarehouseByPartner";
import { DEFAULT_PAGINATION_PARAMS } from "@/types/IPagination";
import { warehouseColumns } from "./warehouseTable";
import { WarehouseCreateModal } from "./warehouseCreateModal";
import { WarehouseDeleteModal } from "./warehouseDeleteModal";
import { WarehouseDetailModal } from "./warehouseDetailModa";

export default function WarehousePageComponent({
  partnerId,
  paramsKey,
}: {
  partnerId: string;
  paramsKey: string;
}) {
  const [isOpenCreate, setIsOpenCreate] = useState({
    isOpen: false,
    editId: undefined as string | undefined,
  });
  const [openDetailId, setOpenDetailId] = useState();
  const [openDeleteId, setOpenDeleteId] = useState();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const onRowClick = (row: Row<TWarehouse>) => {
    console.log(row.getValue("id"));
    setOpenDetailId(row.getValue("id"));
    // router.push(`/warehouse/${row.getValue("id")}`);
  };

  const onEdit = (row: Row<TWarehouse>) => {
    setIsOpenCreate({
      isOpen: true,
      editId: row.getValue("id"),
    });
  };

  const onDelete = (row: Row<TWarehouse>) => {
    setOpenDeleteId(row.getValue("id"));
  };

  const tableActions: TTableActionsProps<TWarehouse>[] = [
    {
      action: EBaseActions.EDIT,
      icon: <Edit className="h-4 w-4" />,
      onClick: onEdit,
    },
    {
      action: EBaseActions.DELETE,
      icon: <Trash className="h-4 w-4" />,
      onClick: onDelete,
    },
  ];

  return (
    <>
      <WarehouseCreateModal
        isOpen={isOpenCreate.isOpen}
        onClose={() =>
          setIsOpenCreate({
            isOpen: false,
            editId: undefined,
          })
        }
        editId={isOpenCreate.editId}
        partnerId={partnerId}
      />
      <WarehouseDetailModal
        isOpen={openDetailId ?? false}
        onClose={() => setOpenDetailId(undefined)}
        id={openDetailId}
        partnerId={partnerId}
      />
      <WarehouseDeleteModal
        isOpen={openDeleteId ?? false}
        onClose={() => setOpenDeleteId(undefined)}
        deleteId={openDeleteId}
        partnerId={partnerId}
      />

      <div className="flex flex-col gap-3 pt-3">
        <div className="flex">
          <Input
            placeholder="Search warehouse"
            className="min-w-64"
            onChange={(e) => {
              debouncedSearch(e.currentTarget.value);
            }}
          />
          <div className="ml-auto">
            <Button
              size={"md"}
              onClick={() =>
                setIsOpenCreate({
                  isOpen: true,
                  editId: undefined,
                })
              }
            >
              New warehouse
            </Button>
          </div>
        </div>
        <Suspense>
          <TableFilter
            numberTitle="Total warehouses: "
            columns={warehouseColumns}
            dataHook={useGetWarehousesByPartner}
            search={search}
            paramsDefault={{
              ...DEFAULT_PAGINATION_PARAMS,
              partnerId: partnerId,
            }}
            paramsKey={paramsKey}
            onRowClick={onRowClick}
            actions={tableActions}
          />
        </Suspense>
      </div>
    </>
  );
}
