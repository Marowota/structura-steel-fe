"use client";

import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const MainTable = <T,>({
  columns,
  data,
  currentPage,
  totalPage,
}: {
  columns: ColumnDef<T>[];
  data: T[];
  currentPage?: number;
  totalPage?: number;
}) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log("table", table.getRowModel().rows);

  return (
    <div className="border-brand-300 flex h-[80vh] w-full flex-col rounded-md border py-2">
      <div className="text-md-bold flex px-3 pb-2">
        <div>Numbers of product: aaa</div>
        <div className="ml-auto">filter:</div>
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
      <div className="flex items-center px-3 pt-2">
        <div>
          Page {currentPage} of {totalPage}
        </div>
      </div>
    </div>
  );
};
