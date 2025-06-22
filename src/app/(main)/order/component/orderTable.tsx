import { TOrder } from "../api/getOrders";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const orderColumns: ColumnDef<TOrder>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "exportCode",
    header: "Code",
    cell: (info) => (
      <div className="max-w-40">{(info.getValue() as string) ?? "-"}</div>
    ),
  },
  {
    accessorKey: "partnerName",
    header: "Partner Name",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "projectName",
    header: "Project Name",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: (data) =>
      dayjs(data.renderValue() as string | undefined).format(
        "HH:mm:ss - DD/MM/YYYY",
      ) ?? "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: (info) =>
      ((info.getValue() as number) ?? 0).toLocaleString("vi-VN") ?? "-",
  },
];
