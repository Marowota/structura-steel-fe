import { ColumnDef } from "@tanstack/react-table";
import { TProject } from "../../api/getProjectsByPartner";

export const projectColumns: ColumnDef<TProject>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "projectCode",
    header: "Project Code",
    cell: (data) => (
      <div className="max-w-[150px]">
        {(data.renderValue() as string) ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "projectName",
    header: "Project Name",
    cell: (data) => (
      <div className="min-w-[300px]">
        {(data.renderValue() as string) ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "projectAddress",
    header: "Project Address",
    cell: (data) => (
      <div className="min-w-[200px]">
        {(data.renderValue() as string) ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "projectRepresentative",
    header: "Project Representative",
    cell: (data) => (
      <div className="min-w-[150px]">
        {(data.renderValue() as string) ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "projectRepresentativePhone",
    header: "Representative Phone",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "contactPerson",
    header: "Contact Person",
    cell: (data) => (
      <div className="min-w-[150px]">
        {(data.renderValue() as string) ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "contactPersonPhone",
    header: "Contact Phone",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "address",
    header: "Contact Address",
    cell: (data) => (
      <div className="min-w-[200px]">
        {(data.renderValue() as string) ?? "-"}
      </div>
    ),
  },
];
