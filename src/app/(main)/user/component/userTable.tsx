import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { EUserRole, EUserRoleLabel, TUser } from "../api/getUsers";

export const userColumns: ColumnDef<TUser>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (data) => (
      <div className="max-w-[150px]">
        {(data.renderValue() as string) ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "realmRole",
    header: "Role",
    cell: (info) => EUserRoleLabel.get(info.getValue() as EUserRole) ?? "-",
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
