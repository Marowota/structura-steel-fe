import { ColumnDef } from "@tanstack/react-table";
import { TDelivery } from "../api/getDeliveries";
import dayjs from "dayjs";

export const deliveryColumns: ColumnDef<TDelivery>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "deliveryCode",
    header: "Delivery Code",
    cell: (info) => (
      <div className="max-w-40">{(info.getValue() as string) ?? "-"}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "confirmationFromFactory",
    header: "Confirmation From Factory",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "confirmationFromReceiver",
    header: "Confirmation From Receiver",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "purchaseOrderId",
    header: "Purchase Order ID",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "deliveryDate",
    header: "Delivery Date",
    cell: (info) =>
      info.getValue()
        ? dayjs(info.getValue() as string).format("DD/MM/YYYY HH:mm:ss")
        : "-",
  },
  {
    accessorKey: "totalDeliveryFee",
    header: "Total Delivery Fee",
    cell: (info) => info.getValue() ?? "-",
  },
];
