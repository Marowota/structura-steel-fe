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
    accessorKey: "orderType",
    header: "Order Type",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: (data) => data.renderValue() ?? "-",
  },
];
