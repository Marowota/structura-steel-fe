import { ColumnDef } from "@tanstack/react-table";
import { TReceivableDebtReport } from "../api/getReceivableDebtReport";
import dayjs from "dayjs";

export const receivableDebtColumns: ColumnDef<TReceivableDebtReport>[] = [
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "orderCode",
    header: "Order Code",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "debtDate",
    header: "Debt Date",
    cell: (info) =>
      dayjs(info.getValue() as string).format("DD/MM/YYYY HH:mm:ss"),
  },
  {
    accessorKey: "remainingAmount",
    header: "Remaining Amount",
    cell: (info) => ((info.getValue() as number) ?? 0).toLocaleString("vi-VN"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => info.getValue() ?? "-",
  },
];
