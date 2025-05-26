import { ColumnDef } from "@tanstack/react-table";
import { TPartner } from "../../api/getPartners";

export const partnerColumn: ColumnDef<TPartner>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "partnerName",
    header: "Name",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "partnerCode",
    header: "Partner Code",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "taxCode",
    header: "Tax Code",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "city",
    header: "City",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (data) => data.renderValue() ?? "-",
  },
];
