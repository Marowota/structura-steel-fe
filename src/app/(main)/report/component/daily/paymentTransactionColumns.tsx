import { ColumnDef } from "@tanstack/react-table";
import { TPaymentTransactionItem } from "../../api/getDailyReport";
import dayjs from "dayjs";

export const paymentTransactionColumns: ColumnDef<TPaymentTransactionItem>[] = [
  {
    accessorKey: "transactionCode",
    header: "Transaction Code",
  },
  {
    accessorKey: "partnerName",
    header: "Partner Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: (info) => (info.getValue() as number).toLocaleString("en-US"),
  },
  {
    accessorKey: "transactionDate",
    header: "Transaction Date",
    cell: (info) =>
      dayjs(info.getValue() as string).format("DD/MM/YYYY HH:mm:ss"),
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
];
