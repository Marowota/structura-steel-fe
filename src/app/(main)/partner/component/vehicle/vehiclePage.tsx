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
  TVehicle,
  useGetVehiclesByPartner,
} from "../../api/getVehiclesByPartner";
import { vehicleColumns } from "./vehicleTable";
import { DEFAULT_PAGINATION_PARAMS } from "@/types/IPagination";
import { VehicleCreateModal } from "./vehicleCreateModal";
import { VehicleDeleteModal } from "./vehicleDeleteModal";
import { VehicleDetailModal } from "./VehicleDetailModal";

export default function VehiclePageComponent({
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

  const onRowClick = (row: Row<TVehicle>) => {
    console.log(row.getValue("id"));
    setOpenDetailId(row.getValue("id"));
    // router.push(`/vehicle/${row.getValue("id")}`);
  };

  const onEdit = (row: Row<TVehicle>) => {
    setIsOpenCreate({
      isOpen: true,
      editId: row.getValue("id"),
    });
  };

  const onDelete = (row: Row<TVehicle>) => {
    setOpenDeleteId(row.getValue("id"));
  };

  const tableActions: TTableActionsProps<TVehicle>[] = [
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
      <VehicleCreateModal
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
      <VehicleDetailModal
        isOpen={openDetailId ?? false}
        onClose={() => setOpenDetailId(undefined)}
        id={openDetailId}
        partnerId={partnerId}
      />
      <VehicleDeleteModal
        isOpen={openDeleteId ?? false}
        onClose={() => setOpenDeleteId(undefined)}
        deleteId={openDeleteId}
        partnerId={partnerId}
      />
      <div className="flex flex-col gap-3 pt-3">
        <div className="flex">
          <Input
            placeholder="Search vehicle"
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
              New vehicle
            </Button>
          </div>
        </div>
        <Suspense>
          <TableFilter
            numberTitle="Total vehicles: "
            columns={vehicleColumns}
            dataHook={useGetVehiclesByPartner}
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
