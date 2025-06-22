import { ColumnDef } from "@tanstack/react-table";
import { TPaymentTransactionItem } from "../../api/getDailyReport";
import dayjs from "dayjs";

export const paymentTransactionColumns: ColumnDef<TPaymentTransactionItem>[] = [
  {
    accessorKey: "transactionType",
    header: "Transaction Type",
  },
  {
    accessorKey: "partnerName",
    header: "Partner Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: (info) => (info.getValue() as number).toLocaleString("vi-VN"),
  },
  {
    accessorKey: "paymentTime",
    header: "Payment Time",
    cell: (info) =>
      dayjs(info.getValue() as string).format("DD/MM/YYYY HH:mm:ss"),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (info) =>
      dayjs(info.getValue() as string).format("DD/MM/YYYY HH:mm:ss"),
  },
];
