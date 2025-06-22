"use client";

import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown } from "lucide-react";
import { ReactNode } from "react";
import ReactPaginate from "react-paginate";
import { Button } from "./button";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    actions: TTableActionsProps<TData>[];
  }
}

export enum ETableSort {
  ASC = "asc",
  DESC = "desc",
}

export enum EBaseActions {
  EDIT = "Edit",
  DELETE = "Delete",
  VIEW = "View",
  CONFIRM = "Confirm",
  CHANGE_PASSWORD = "Change Password",
}

export type TTablePaginateProps = {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  onPageChange?: (page: number) => void;
};

export type TTableFilterProps = {
  sortBy: string;
  sortDir: ETableSort;
  onFilterChange?: (filter: TTableFilterProps) => void;
  noFilterHeaderIds?: string[];
};

export type TTableActionsProps<T> = {
  onClick: (row: Row<T>) => void;
  icon: ReactNode;
  action: EBaseActions;
  disableRule?: (row: Row<T>) => boolean;
  hiddenRule?: (row: Row<T>) => boolean;
};

export const MainTable = <T,>(
  {
    columns,
    data,
    heading,
    filter,
    paginateProps,
    filterProps,
    onRowClick,
    actions,
    containerClassName,
  }: {
    columns: ColumnDef<T>[];
    data: T[];
    heading?: ReactNode;
    filter?: ReactNode;
    paginateProps?: TTablePaginateProps;
    filterProps?: TTableFilterProps;
    onRowClick?: (row: Row<T>) => void;
    actions?: TTableActionsProps<T>[];
    containerClassName?: string;
  } = {
    columns: [],
    data: [],
    heading: null,
    filter: null,
    paginateProps: {
      pageNo: 0,
      pageSize: 0,
      totalElements: 0,
      totalPages: 0,
      last: true,
      onPageChange: () => {},
    },
    actions: [],
  },
) => {
  columns = columns.concat(
    actions?.length
      ? [
          {
            accessorKey: "action",
            header: "Action",
            cell: (data) => {
              return (
                <div className="flex gap-2">
                  {data.table.options.meta?.actions.map((action) => {
                    const hidden = action.hiddenRule
                      ? action.hiddenRule(data.row)
                      : false;
                    return (
                      !hidden && (
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
                      )
                    );
                  })}
                </div>
              );
            },
          },
        ]
      : [],
  );

  if (filterProps) {
    filterProps.noFilterHeaderIds = [
      ...(filterProps.noFilterHeaderIds ?? []),
      "action",
    ];
  }

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      actions: actions ?? [],
    },
  });

  return (
    <div
      className={cn(
        "border-brand-300 flex h-[78vh] w-full flex-col rounded-md border py-2",
        containerClassName,
      )}
    >
      <div className="text-md-bold flex items-center px-3 pb-2">
        <div>{heading}</div>
        <div className="ml-auto">{filter}</div>
      </div>
      <div className="bg-brand-300 h-[1px]" />

      <div className="h-full w-full overflow-auto">
        <table
          className="text-md-regular w-full border-separate text-left"
          cellSpacing="0"
          cellPadding="0"
        >
          <thead className="w-full">
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <tr className="bg-info-100" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className={cn(
                        "sticky top-0 z-10 border-0 bg-inherit px-3 py-2",
                        (actions?.length ?? 0) > 0 &&
                          "last:border-brand-200 last:right-0 last:z-20 last:border-l",
                      )}
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={() =>
                        filterProps &&
                        !filterProps.noFilterHeaderIds?.includes(header.id) &&
                        filterProps?.onFilterChange?.({
                          ...filterProps,
                          sortBy: header.id,
                          sortDir:
                            header.id === filterProps?.sortBy
                              ? filterProps?.sortDir === ETableSort.DESC
                                ? ETableSort.ASC
                                : ETableSort.DESC
                              : filterProps?.sortDir,
                        })
                      }
                    >
                      <div
                        className={cn(
                          "group flex items-center gap-1",
                          filterProps &&
                            !filterProps.noFilterHeaderIds?.includes(header.id)
                            ? "cursor-pointer"
                            : "",
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {filterProps &&
                          !filterProps.noFilterHeaderIds?.includes(
                            header.id,
                          ) && (
                            <ArrowDown
                              className={cn(
                                "h-4 min-h-4 w-4 min-w-4 text-gray-500 group-hover:text-gray-900",
                                header.id === filterProps?.sortBy
                                  ? ""
                                  : "opacity-0 group-hover:opacity-100",
                                filterProps?.sortDir === ETableSort.DESC
                                  ? ""
                                  : "rotate-180",
                              )}
                            />
                          )}
                      </div>
                    </th>
                  ))}
                </tr>
              );
            })}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => {
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "hover:bg-info-50 cursor-pointer",
                    index % 2 ? "bg-brand-50" : "bg-white",
                  )}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        className={cn(
                          "px-3 py-4 break-words",
                          (actions?.length ?? 0) > 0 &&
                            "last:border-brand-200 border-0 last:sticky last:right-0 last:z-10 last:border-l last:bg-inherit",
                        )}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-brand-300 h-[1px]" />
      <div className="flex items-center gap-3 px-3 pt-2">
        {paginateProps ? (
          <>
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={(props) => {
                paginateProps?.onPageChange?.(props.selected);
              }}
              forcePage={(paginateProps?.pageNo ?? 1) - 1}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              pageCount={paginateProps?.totalPages ?? 0}
              previousLabel="<"
              renderOnZeroPageCount={null}
              containerClassName="flex items-center justify-center gap-4 select-none"
              pageClassName="cursor-pointer hover:bg-info-50 rounded-full text-center"
              pageLinkClassName="block w-6 h-6 rounded-full"
              activeClassName="bg-brand-50 border border-brand-200"
              previousClassName="cursor-pointer hover:bg-info-50 rounded-full text-center border border-brand-200"
              previousLinkClassName="block w-6 h-6 rounded-full"
              nextClassName="cursor-pointer hover:bg-info-50 rounded-full text-center border border-brand-200"
              nextLinkClassName="block w-6 h-6 rounded-full"
            />
            <div>
              Page {paginateProps?.pageNo ?? 0} of{" "}
              {paginateProps?.totalPages ?? 0}
            </div>
          </>
        ) : (
          <div className="invisible">0</div>
        )}
      </div>
    </div>
  );
};
