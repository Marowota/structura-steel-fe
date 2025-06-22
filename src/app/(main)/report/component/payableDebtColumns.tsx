import { ColumnDef } from "@tanstack/react-table";
import { TPayableDebtReport } from "../api/getPayableDebtReport";

export const payableDebtColumns: ColumnDef<TPayableDebtReport>[] = [
  {
    accessorKey: "partnerName",
    header: "Partner Name",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "debtType",
    header: "Debt Type",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "referenceCode",
    header: "Reference Code",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "debtDate",
    header: "Debt Date",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "remainingAmount",
    header: "Remaining Amount",
    cell: (info) => (info.getValue() as number).toLocaleString("vi-VN"),
  },
];
