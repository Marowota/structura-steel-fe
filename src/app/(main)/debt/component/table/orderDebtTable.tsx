import { ColumnDef } from "@tanstack/react-table";
import { TOrderDebt } from "../../api/orderDebt/getOrderDebt";

export const orderDebtColumns: ColumnDef<TOrderDebt>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 100,
  },
  {
    accessorKey: "saleOrderId",
    header: "Sale Order ID",
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
