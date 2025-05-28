import { ColumnDef } from "@tanstack/react-table";
import {
  EVehicleType,
  EVehicleTypeLabel,
  TVehicle,
} from "../../api/getVehiclesByPartner";

export const vehicleColumns: ColumnDef<TVehicle>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "vehicleCode",
    header: "Vehicle Code",
    cell: (data) => (data.renderValue() as string) ?? "-",
  },
  {
    accessorKey: "driverName",
    header: "Driver Name",
    cell: (data) => (data.renderValue() as string) ?? "-",
  },
  {
    accessorKey: "vehicleType",
    header: "Vehicle Type",
    cell: (data) =>
      EVehicleTypeLabel.get(data.renderValue() as EVehicleType) ?? "-",
  },
  {
    accessorKey: "licensePlate",
    header: "License Plate",
    cell: (data) => (data.renderValue() as string) ?? "-",
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (data) => (data.renderValue() as string) ?? "-",
  },
];
