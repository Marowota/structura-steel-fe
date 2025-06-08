import { TImport } from "../api/getImports";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const importColumns: ColumnDef<TImport>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "supplierName",
    header: "Supplier",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "projectName",
    header: "Project",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: (info) =>
      dayjs(info.getValue() as string).format("DD/MM/YYYY HH:mm:ss") ?? "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "confirmationFromSupplier",
    header: "Confirmation From Supplier",
    cell: (info) => info.getValue() ?? "-",
  },
];
