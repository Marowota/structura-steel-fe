import { ColumnDef } from "@tanstack/react-table";
import { TImportDebt } from "../../api/importDebt/getImportDebt";

export const importDebtColumns: ColumnDef<TImportDebt>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 100,
  },
  {
    accessorKey: "purchaseOrderId",
    header: "Import Order ID",
    size: 150,
  },
  {
    accessorKey: "originalAmount",
    header: "Original Amount",
    size: 150,
  },
  {
    accessorKey: "remainingAmount",
    header: "Remaining Amount",
    size: 150,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    size: 200,
  },
  {
    accessorKey: "debtNote",
    header: "Debt Note",
    size: 200,
  },
];
