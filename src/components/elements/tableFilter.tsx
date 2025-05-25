import { Row } from "@tanstack/react-table";
import {
  ETableSort,
  MainTable,
  TTableActionsProps,
} from "@/components/elements";
import { useLinkParams } from "@/hooks/useLinkParams";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";
import {
  DEFAULT_PAGINATION_PARAMS,
  IPagination,
  IPaginationResponse,
} from "@/types/IPagination";

export const TableFilter = <T, TDTO extends IPagination>({
  search,
  onRowClick,
  actions,
  columns,
  dataHook,
  numberTitle,
}: {
  search: string;
  onRowClick: (row: Row<T>) => void;
  actions?: TTableActionsProps<T>[];
  columns: ColumnDef<T>[];
  dataHook: ({ params }: { params: TDTO }) => {
    data: IPaginationResponse<T> | undefined;
  };
  numberTitle?: string;
}) => {
  const paramsDefault = DEFAULT_PAGINATION_PARAMS as TDTO;
  const { params, setNewParams } = useLinkParams<TDTO>(paramsDefault);
  const { data } = dataHook({ params });

  useEffect(() => {
    setNewParams({ ...params, search, pageNo: 0 });
  }, [search]);

  return (
    <MainTable
      columns={columns}
      data={data?.content ?? []}
      heading={(numberTitle ?? "") + data?.totalElements}
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
          const newParams: TDTO = {
            ...params,
            sortBy: filter.sortBy,
            sortDir: filter.sortDir,
            pageNo: 0,
          };
          setNewParams(newParams);
        },
      }}
      onRowClick={onRowClick}
      actions={actions}
    />
  );
};
