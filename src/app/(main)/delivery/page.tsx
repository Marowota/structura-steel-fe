"use client";
import {
  Button,
  EBaseActions,
  Input,
  TTableActionsProps,
} from "@/components/elements";
import { Row } from "@tanstack/react-table";
import { PackageCheck, Trash } from "lucide-react";
import { Suspense, useState } from "react";
import { TableFilter } from "@/components/elements/tableFilter";
import { useDebouncedCallback } from "use-debounce";
import { TDelivery, useGetDeliveries } from "./api/getDeliveries";
import { deliveryColumns } from "./component/deliveryTable";
import { DeliveryCreateModal } from "./component/deliveryCreateModal";
import { DeliveryConfirmModal } from "./component/deliveryConfirmModal";

export default function DeliveryPage() {
  const [isOpenCreate, setIsOpenCreate] = useState({
    isOpen: false,
    editId: undefined,
  });
  const [, setOpenDeleteId] = useState();
  const [search, setSearch] = useState("");
  const [openConfirmId, setOpenConfirmId] = useState();
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const onRowClick = (row: Row<TDelivery>) => {
    console.log(row.getValue("id"));
  };

  const onConfirm = (row: Row<TDelivery>) => {
    setOpenConfirmId(row.getValue("id"));
  };

  // const onEdit = (row: Row<TDelivery>) => {
  //   setIsOpenCreate({
  //     isOpen: true,
  //     editId: row.getValue("id"),
  //   });
  // };

  const onDelete = (row: Row<TDelivery>) => {
    setOpenDeleteId(row.getValue("id"));
  };

  const tableActions: TTableActionsProps<TDelivery>[] = [
    {
      action: EBaseActions.CONFIRM,
      icon: <PackageCheck className="h-4 w-4" />,
      onClick: onConfirm,
    },
    {
      action: EBaseActions.DELETE,
      icon: <Trash className="h-4 w-4" />,
      onClick: onDelete,
    },
  ];

  return (
    <>
      <DeliveryCreateModal
        isOpen={isOpenCreate.isOpen}
        onClose={() =>
          setIsOpenCreate({
            isOpen: false,
            editId: undefined,
          })
        }
        editId={isOpenCreate.editId}
      />
      <DeliveryConfirmModal
        isOpen={!!openConfirmId}
        onClose={() => setOpenConfirmId(undefined)}
        confirmId={openConfirmId}
      />
      {/* 

      <DeliveryDeleteModal
        isOpen={openDeleteId ?? false}
        onClose={() => setOpenDeleteId(undefined)}
        deleteId={openDeleteId}
      /> */}
      <div className="flex h-full flex-col gap-3 pt-3">
        <div className="flex">
          <Input
            placeholder="Search delivery"
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
              New delivery
            </Button>
          </div>
        </div>
        <Suspense>
          <TableFilter
            numberTitle="Total delivery: "
            columns={deliveryColumns}
            dataHook={useGetDeliveries}
            search={search}
            onRowClick={onRowClick}
            actions={tableActions}
            paramsDefault={{ sortBy: "id", sortDir: "desc" }}
          />
        </Suspense>
      </div>
    </>
  );
}
