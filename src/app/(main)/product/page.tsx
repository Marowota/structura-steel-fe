"use client";

import {
  Button,
  EBaseActions,
  Input,
  TTableActionsProps,
} from "@/components/elements";
import { Row } from "@tanstack/react-table";
import { TProduct } from "./api/getProducts";

import { Suspense, useState } from "react";
import { NewProductModal } from "./component/productModal";
import { ProductDetailModal } from "./component/productDetailModal";
import { ProductTable } from "./component/productTable";
import { Edit, Trash } from "lucide-react";
import { ProductDeleteModal } from "./component/productDeleteModal";

export default function ProductPage() {
  const onRowClick = (row: Row<TProduct>) => {
    console.log(row.getValue("id"));
    setOpenDetailId(row.getValue("id"));
    // router.push(`/product/${row.getValue("id")}`);
  };

  const onEdit = (row: Row<TProduct>) => {
    setIsOpenCreate({
      isOpen: true,
      editId: row.getValue("id"),
    });
  };

  const onDelete = (row: Row<TProduct>) => {
    setOpenDeleteId(row.getValue("id"));
  };

  const [isOpenCreate, setIsOpenCreate] = useState({
    isOpen: false,
    editId: undefined,
  });
  const [openDetailId, setOpenDetailId] = useState();
  const [openDeleteId, setOpenDeleteId] = useState();

  const tableActions: TTableActionsProps<TProduct>[] = [
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
      <NewProductModal
        isOpen={isOpenCreate.isOpen}
        onClose={() =>
          setIsOpenCreate({
            isOpen: false,
            editId: undefined,
          })
        }
        editId={isOpenCreate.editId}
      />
      <ProductDetailModal
        isOpen={openDetailId ?? false}
        onClose={() => setOpenDetailId(undefined)}
        id={openDetailId}
      />
      <ProductDeleteModal
        isOpen={openDeleteId ?? false}
        onClose={() => setOpenDeleteId(undefined)}
        deleteId={openDeleteId}
      />
      <div className="flex h-full flex-col gap-3 pt-3">
        <div className="flex">
          <Input placeholder="Search product" className="min-w-64" />
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
              New product
            </Button>
          </div>
        </div>
        <Suspense>
          <ProductTable onRowClick={onRowClick} actions={tableActions} />
        </Suspense>
      </div>
    </>
  );
}
