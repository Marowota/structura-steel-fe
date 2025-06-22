import { ColumnDef } from "@tanstack/react-table";
import { TNewOrderItem } from "../../api/getDailyReport";
import dayjs from "dayjs";

export const newOrderColumns: ColumnDef<TNewOrderItem>[] = [
  {
    accessorKey: "orderCode",
    header: "Order Code",
  },
  {
    accessorKey: "orderType",
    header: "Order Type",
  },
  {
    accessorKey: "partnerName",
    header: "Partner Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: (info) => (info.getValue() as number).toLocaleString("vi-VN"),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (info) =>
      dayjs(info.getValue() as string).format("DD/MM/YYYY HH:mm:ss"),
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
];
