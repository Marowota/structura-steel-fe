import { ColumnDef } from "@tanstack/react-table";
import { TWarehouse } from "../../api/getWarehouseByPartner";
import dayjs from "dayjs";

export const warehouseColumns: ColumnDef<TWarehouse>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "warehouseName",
    header: "Warehouse Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "warehouseCode",
    header: "Warehouse Code",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "warehouseAddress",
    header: "Warehouse Address",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (data) =>
      dayjs(data.renderValue() as string | undefined).format(
        "HH:mm:ss - DD/MM/YYYY",
      ) ?? "-",
  },
];
