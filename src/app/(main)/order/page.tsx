"use client";
import {
  Button,
  EBaseActions,
  Input,
  TTableActionsProps,
} from "@/components/elements";
import { Suspense, useState } from "react";
import { OrderTable } from "./component/orderTable";
import { Row } from "@tanstack/react-table";
import { TOrder } from "./api/getOrders";
import { Edit, Trash } from "lucide-react";
import { OrderCreateModal } from "./component/orderCreateModal";

export default function OrderPage() {
  const [isOpenCreate, setIsOpenCreate] = useState({
    isOpen: false,
    editId: undefined,
  });
  const [, setOpenDetailId] = useState();
  const [, setOpenDeleteId] = useState();

  const onRowClick = (row: Row<TOrder>) => {
    setOpenDetailId(row.getValue("id"));
    // router.push(`/product/${row.getValue("id")}`);
  };

  const onEdit = (row: Row<TOrder>) => {
    setIsOpenCreate({
      isOpen: true,
      editId: row.getValue("id"),
    });
  };

  const onDelete = (row: Row<TOrder>) => {
    setOpenDeleteId(row.getValue("id"));
  };

  const tableActions: TTableActionsProps<TOrder>[] = [
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
      <OrderCreateModal
        isOpen={isOpenCreate.isOpen}
        onClose={() => setIsOpenCreate({ isOpen: false, editId: undefined })}
        editId={isOpenCreate.editId}
      />
      <div className="flex h-full flex-col gap-3 pt-3">
        <div className="flex">
          <Input placeholder="Search order" className="min-w-64" />
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
              New order
            </Button>
          </div>
        </div>
        <Suspense>
          <OrderTable onRowClick={onRowClick} actions={tableActions} />
        </Suspense>
      </div>
    </>
  );
}
