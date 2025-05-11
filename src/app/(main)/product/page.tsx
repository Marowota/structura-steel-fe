"use client";

import { Button, Input } from "@/components/elements";
import { Row } from "@tanstack/react-table";
import { TProduct } from "./api/getProducts";

import { Suspense, useState } from "react";
import { NewProductModal } from "./component/productModal";
import { ProductDetailModal } from "./component/productDetailModal";
import { ProductTable } from "./component/productTable";

export default function ProductPage() {
  const onRowClick = (row: Row<TProduct>) => {
    console.log(row.getValue("id"));
    setOpenDetailId(row.getValue("id"));
    // router.push(`/product/${row.getValue("id")}`);
  };

  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [openDetailId, setOpenDetailId] = useState();

  return (
    <>
      <NewProductModal isOpen={isOpenCreate} setIsOpen={setIsOpenCreate} />
      <ProductDetailModal
        isOpen={openDetailId ?? false}
        onClose={() => setOpenDetailId(undefined)}
        id={openDetailId}
      />
      <div className="flex h-full flex-col gap-3 pt-3">
        <div className="flex">
          <Input placeholder="Search product" className="min-w-64" />
          <div className="ml-auto">
            <Button size={"md"} onClick={() => setIsOpenCreate(true)}>
              New product
            </Button>
          </div>
        </div>
        <Suspense>
          <ProductTable onRowClick={onRowClick} />
        </Suspense>
      </div>
    </>
  );
}
