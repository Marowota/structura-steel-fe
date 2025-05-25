import {
  ETableSort,
  MainTable,
  TTableActionsProps,
} from "@/components/elements";
import { GetProductsDTO, TProduct, useGetProducts } from "../api/getProducts";
import { useLinkParams } from "@/hooks/useLinkParams";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useEffect } from "react";
import { DEFAULT_PAGINATION_PARAMS } from "@/types/IPagination";

export const ProductTable = ({
  onRowClick,
  actions,
  search = "",
}: {
  onRowClick: (row: Row<TProduct>) => void;
  actions?: TTableActionsProps<TProduct>[];
  search?: string;
}) => {
  const paramsDefault: GetProductsDTO = DEFAULT_PAGINATION_PARAMS;
  const { params, setNewParams } = useLinkParams<GetProductsDTO>(paramsDefault);

  const { data } = useGetProducts({ params });

  useEffect(() => {
    setNewParams({ ...params, search });
  }, [search]);

  return (
    <MainTable
      columns={productColumns}
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

export const productColumns: ColumnDef<TProduct>[] = [
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
];
