import { ColumnDef } from "@tanstack/react-table";
import {
  EPartnerType,
  EPartnerTypeLabel,
  TPartner,
} from "../../api/getPartners";
import dayjs from "dayjs";

export const partnerColumn: ColumnDef<TPartner>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "partnerName",
    header: "Partner Name",
    cell: (info) => <div className="min-w-60">{info.getValue() as string}</div>,
  },
  {
    accessorKey: "partnerType",
    header: "Partner Type",
    cell: (info) =>
      EPartnerTypeLabel.get(
        (info.getValue() as EPartnerType) ?? EPartnerType.UNKNOWN,
      ),
  },
  {
    accessorKey: "partnerCode",
    header: "Partner Code",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "taxCode",
    header: "Tax Code",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "legalRepresentative",
    header: "Legal Representative",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "legalRepresentativePhone",
    header: "Legal Representative Phone",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "contactPerson",
    header: "Contact Person",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "contactPersonPhone",
    header: "Contact Person Phone",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "bankName",
    header: "Bank Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "bankAccountNumber",
    header: "Bank Account Number",
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
