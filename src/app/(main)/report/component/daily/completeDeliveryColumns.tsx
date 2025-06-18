import { ColumnDef } from "@tanstack/react-table";
import { TCompletedDeliveryItem } from "../../api/getDailyReport";
import dayjs from "dayjs";

export const completeDeliveryColumns: ColumnDef<TCompletedDeliveryItem>[] = [
  {
    accessorKey: "deliveryCode",
    header: "Delivery Code",
  },
  {
    accessorKey: "originalOrderCode",
    header: "Original Order Code",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "deliveryAddress",
    header: "Delivery Address",
  },
  {
    accessorKey: "completionTime",
    header: "Completion Time",
    cell: (info) =>
      dayjs(info.getValue() as string).format("DD/MM/YYYY HH:mm:ss"),
  },
];
