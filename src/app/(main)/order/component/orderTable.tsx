import { Row } from "@tanstack/react-table";
import { GetOrdersDTO, TOrder, useGetOrders } from "../api/getOrders";
import {
  ETableSort,
  MainTable,
  TTableActionsProps,
} from "@/components/elements";
import { useLinkParams } from "@/hooks/useLinkParams";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const OrderTable = ({
  onRowClick,
  actions,
}: {
  onRowClick: (row: Row<TOrder>) => void;
  actions?: TTableActionsProps<TOrder>[];
}) => {
  const paramsDefault: GetOrdersDTO = {
    pageNo: 0,
    pageSize: 10,
    sortBy: "id",
    sortDir: "asc",
    search: "",
  };

  const { params, setNewParams } = useLinkParams<GetOrdersDTO>(paramsDefault);

  const { data } = useGetOrders({ params });

  return (
    <MainTable
      columns={columns}
      data={data?.content ?? []}
      heading={"Number of Orders: " + data?.totalElements}
      paginateProps={{
        pageNo: (data?.pageNo ?? -1) + 1,
        pageSize: data?.pageSize ?? 0,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? -1,
        last: data?.last ?? true,
        onPageChange: (page) => {
          const newParams = { ...params, pageNo: page };
          setNewParams(newParams);
        },
      }}
      filterProps={{
        sortBy: params.sortBy,
        sortDir: params.sortDir as ETableSort,
        onFilterChange: (filter) => {
          const newParams = {
            ...params,
            sortBy: filter.sortBy,
            sortDir: filter.sortDir,
          };
          setNewParams(newParams);
        },
      }}
      onRowClick={onRowClick}
      actions={actions}
    />
  );
};

const columns: ColumnDef<TOrder>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "partnerId",
    header: "Partner ID",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "projectId",
    header: "Project ID",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: (data) =>
      dayjs(data.renderValue() as string | undefined).format(
        "HH:mm:ss - DD/MM/YYYY",
      ) ?? "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "orderType",
    header: "Order Type",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: (data) => data.renderValue() ?? "-",
  },
];
