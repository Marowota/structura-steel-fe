"use client";

import { MainTable } from "@/components/elements";
import { ColumnDef } from "@tanstack/react-table";
import { GetProductsDTO, TProduct, useGetProducts } from "./api/getProducts";
import { useState } from "react";

const columns: ColumnDef<TProduct>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (data) => data.renderValue(),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: (data) => data.renderValue(),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (data) => data.renderValue(),
  },
  {
    accessorKey: "unitWeight",
    header: "Unit Weight",
    cell: (data) => data.renderValue(),
  },
  {
    accessorKey: "length",
    header: "Length",
    cell: (data) => data.renderValue(),
  },
  {
    accessorKey: "width",
    header: "Width",
    cell: (data) => data.renderValue(),
  },
  {
    accessorKey: "height",
    header: "Height",
    cell: (data) => data.renderValue(),
  },
  {
    accessorKey: "thickness",
    header: "Thickness",
    cell: (data) => data.renderValue(),
  },
  {
    accessorKey: "diameter",
    header: "Diameter",
    cell: (data) => data.renderValue(),
  },
  {
    accessorKey: "standard",
    header: "Standard",
    cell: (data) => data.renderValue(),
  },
];

export default function ProductPage() {
  const [params, setParams] = useState<GetProductsDTO>({
    pageNo: 0,
    pageSize: 10,
    sortBy: "id",
    sortDir: "asc",
  });
  const { data, isLoading } = useGetProducts({ params });
  console.log("data", data);
  return (
    <div className="h-full pt-4">
      <MainTable
        columns={columns}
        data={data?.content ?? []}
        heading={"Number of Products: " + data?.totalElements}
        paginateProps={{
          pageNo: (data?.pageNo ?? -1) + 1,
          pageSize: data?.pageSize ?? 0,
          totalElements: data?.totalElements ?? 0,
          totalPages: data?.totalPages ?? -1,
          last: data?.last ?? true,
          onPageChange: (page) => {
            console.log("page", page);
            setParams((prev) => ({ ...prev, pageNo: page }));
          },
        }}
      />
    </div>
  );
}
