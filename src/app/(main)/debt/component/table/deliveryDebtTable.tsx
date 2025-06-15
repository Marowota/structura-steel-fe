import { ColumnDef } from "@tanstack/react-table";
import { TDeliveryDebt } from "../../api/deliveryDebt/getDeliveryDebt";

export const deliveryDebtColumns: ColumnDef<TDeliveryDebt>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 100,
  },
  {
    accessorKey: "deliveryOrderId",
    header: "Delivery Order ID",
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
