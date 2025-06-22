import { ColumnDef } from "@tanstack/react-table";
import { TProfitLossReport } from "../api/getProfitLossReport";
import dayjs from "dayjs";

export const profitLossColumns: ColumnDef<TProfitLossReport>[] = [
  {
    accessorKey: "saleOrderCode",
    header: "Sale Order Code",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "completionDate",
    header: "Completion Date",
    cell: (info) =>
      dayjs(info.getValue() as string).format("DD/MM/YYYY HH:mm:ss"),
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: (info) => ((info.getValue() as number) ?? 0).toLocaleString("vi-VN"),
  },
  {
    accessorKey: "costOfGoods",
    header: "Cost of Goods",
    cell: (info) => ((info.getValue() as number) ?? 0).toLocaleString("vi-VN"),
  },
  {
    accessorKey: "deliveryCost",
    header: "Delivery Cost",
    cell: (info) => ((info.getValue() as number) ?? 0).toLocaleString("vi-VN"),
  },
  {
    accessorKey: "grossProfit",
    header: "Gross Profit",
    cell: (info) => ((info.getValue() as number) ?? 0).toLocaleString("vi-VN"),
  },
];
