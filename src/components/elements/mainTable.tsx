"use client";

import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown } from "lucide-react";
import { ReactNode } from "react";
import ReactPaginate from "react-paginate";

export enum ETableSort {
  ASC = "asc",
  DESC = "desc",
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
  }: {
    columns: ColumnDef<T>[];
    data: T[];
    heading?: ReactNode;
    filter?: ReactNode;
    paginateProps?: TTablePaginateProps;
    filterProps?: TTableFilterProps;
    onRowClick?: (row: Row<T>) => void;
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
  },
) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });
  console.log(filterProps?.sortBy, filterProps?.sortDir);

  return (
    <div className="border-brand-300 flex h-[78vh] w-full flex-col rounded-md border py-2">
      <div className="text-md-bold flex items-center px-3 pb-2">
        <div>{heading}</div>
        <div className="ml-auto">{filter}</div>
      </div>
      <div className="bg-brand-300 h-[1px]" />

      <div className="h-full w-full overflow-auto">
        <table className="text-md-regular w-full text-left">
          <thead className="bg-info-100 sticky top-0 z-10 w-full">
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className="px-3 py-2"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <ArrowDown
                          className={cn(
                            "h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-900",
                            header.id === filterProps?.sortBy
                              ? ""
                              : "opacity-0 hover:opacity-100",
                            filterProps?.sortDir === ETableSort.DESC
                              ? ""
                              : "rotate-180",
                          )}
                          onClick={() =>
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
                        />
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
                      <td className="px-3 py-4" key={cell.id}>
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
          Page {paginateProps?.pageNo ?? 0} of {paginateProps?.totalPages ?? 0}
        </div>
      </div>
    </div>
  );
};
