"use client";
import {
  Button,
  EBaseActions,
  Input,
  TTableActionsProps,
} from "@/components/elements";
import { Suspense, useState } from "react";
import { Row } from "@tanstack/react-table";
import { TImport, useGetImports } from "./api/getImports";
import { PackageCheck, Trash } from "lucide-react";
import { TableFilter } from "@/components/elements/tableFilter";
import { useDebouncedCallback } from "use-debounce";
import { importColumns } from "./component/importTable";
import { ImportCreateModal } from "./component/importCreateModal";
import { ImportDetailModal } from "./component/importDetailModal";
import { ImportCancelModal } from "./component/importCancelModal";
import { ImportConfirmModal } from "./component/importConfirmModal";

export default function ImportPage() {
  const [isOpenCreate, setIsOpenCreate] = useState({
    isOpen: false,
    editId: undefined,
  });
  const [openDetailId, setOpenDetailId] = useState();
  const [openConfirmId, setOpenConfirmId] = useState();
  const [openCancelId, setOpenCancelId] = useState();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const onRowClick = (row: Row<TImport>) => {
    setOpenDetailId(row.getValue("id"));
  };

  // const onEdit = (row: Row<TImport>) => {
  //   setIsOpenCreate({
  //     isOpen: true,
  //     editId: row.getValue("id"),
  //   });
  // };

  const onCancel = (row: Row<TImport>) => {
    setOpenCancelId(row.getValue("id"));
  };

  const onConfirm = (row: Row<TImport>) => {
    setOpenConfirmId(row.getValue("id"));
  };

  const tableActions: TTableActionsProps<TImport>[] = [
    {
      action: EBaseActions.CONFIRM,
      icon: <PackageCheck className="h-4 w-4" />,
      onClick: onConfirm,
    },
    // {
    //   action: EBaseActions.EDIT,
    //   icon: <Edit className="h-4 w-4" />,
    //   onClick: onEdit,
    // },
    {
      action: EBaseActions.DELETE,
      icon: <Trash className="h-4 w-4" />,
      onClick: onCancel,
    },
  ];
  return (
    <>
      <ImportCreateModal
        isOpen={isOpenCreate.isOpen}
        onClose={() => setIsOpenCreate({ isOpen: false, editId: undefined })}
        editId={isOpenCreate.editId}
        key={isOpenCreate.editId ? isOpenCreate.editId : "new-import"}
      />
      <ImportDetailModal
        isOpen={!!openDetailId}
        onClose={() => setOpenDetailId(undefined)}
        id={openDetailId}
      />
      <ImportCancelModal
        isOpen={!!openCancelId}
        onClose={() => setOpenCancelId(undefined)}
        cancelId={openCancelId}
      />
      <ImportConfirmModal
        isOpen={!!openConfirmId}
        onClose={() => setOpenConfirmId(undefined)}
        confirmId={openConfirmId}
      />
      <div className="flex h-full flex-col gap-3 pt-3">
        <div className="flex">
          <Input
            placeholder="Search import"
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
              New import
            </Button>
          </div>
        </div>
        <Suspense>
          <TableFilter
            numberTitle="Total imports: "
            columns={importColumns}
            dataHook={useGetImports}
            search={search}
            onRowClick={onRowClick}
            actions={tableActions}
            paramsDefault={{ sortBy: "createdAt", sortDir: "desc" }}
          />
        </Suspense>
      </div>
    </>
  );
}
