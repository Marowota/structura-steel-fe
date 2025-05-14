import {
  Button,
  ETableSort,
  MainTable,
  TTableActionsProps,
} from "@/components/elements";
import { GetProductsDTO, TProduct, useGetProducts } from "../api/getProducts";
import { useLinkParams } from "@/hooks/useLinkParams";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useEffect } from "react";

export const ProductTable = ({
  onRowClick,
  actions,
  search = "",
}: {
  onRowClick: (row: Row<TProduct>) => void;
  actions?: TTableActionsProps<TProduct>[];
  search?: string;
}) => {
  const paramsDefault: GetProductsDTO = {
    pageNo: 0,
    pageSize: 10,
    sortBy: "id",
    sortDir: "asc",
    search: "",
  };

  const { params, setNewParams } = useLinkParams<GetProductsDTO>(paramsDefault);

  const { data } = useGetProducts({ params });

  useEffect(() => {
    setNewParams({ ...params, search });
  }, [search]);

  return (
    <MainTable
      columns={columns}
      data={data?.content ?? []}
      heading={"Number of Products: " + data?.totalElements}
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

const columns: ColumnDef<TProduct>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "length",
    header: "Length",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "width",
    header: "Width",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "height",
    header: "Height",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "unitWeight",
    header: "Unit Weight",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "thickness",
    header: "Thickness",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "diameter",
    header: "Diameter",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "standard",
    header: "Standard",
    cell: (data) => data.renderValue() ?? "-",
  },
  {
    accessorKey: "action",
    header: "",
    cell: (data) => {
      return (
        <div className="flex gap-2">
          {data.table.options.meta?.actions.map((action) => {
            return (
              <Button
                key={action.action}
                variant={"secondary"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick?.(data.row);
                }}
              >
                {action.icon}
              </Button>
            );
          })}
        </div>
      );
    },
  },
];
