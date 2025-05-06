"use client";

import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode } from "react";
import ReactPaginate from "react-paginate";

export type TTablePaginateProps = {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  onPageChange?: (page: number) => void;
};

export const MainTable = <T,>(
  {
    columns,
    data,
    heading,
    filter,
    paginateProps,
  }: {
    columns: ColumnDef<T>[];
    data: T[];
    heading?: ReactNode;
    filter?: ReactNode;
    paginateProps?: TTablePaginateProps;
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

  console.log("table", table.getRowModel().rows);
  const renderHeader = heading || filter;

  return (
    <div className="border-brand-300 flex h-[80vh] w-full flex-col rounded-md border py-2">
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
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
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
                    "hover:bg-info-50",
                    index % 2 ? "bg-brand-50" : "bg-white",
                  )}
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
          pageRangeDisplayed={5}
          pageCount={paginateProps?.totalPages ?? 0}
          previousLabel="<"
          renderOnZeroPageCount={null}
          containerClassName="flex items-center justify-center gap-4"
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
