import * as React from "react";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    initialState: {
      pagination: { pageSize: 500 },
    },
  });

  const [levelFilter, setLevelFilter] = React.useState(() => [
    "TRACE",
    "DEBUG",
    "WARN",
    "ALERT",
    "ERROR",
  ]);

  const handleLevelFilter = (newLevelFilters: string | string[]) => {
    setLevelFilter(newLevelFilters);
    table.getColumn("level")?.setFilterValue(newLevelFilters);
  };

  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Filter by source..."
          value={(table.getColumn("subject")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("subject")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <ToggleGroup
          type="multiple"
          onValueChange={handleLevelFilter}
        >
          <ToggleGroupItem
            value="TRACE"
            aria-label="Toggle TRACE"
          >
            TRACE
          </ToggleGroupItem>
          <ToggleGroupItem
            value="DEBUG"
            aria-label="Toggle DEBUG"
          >
            DEBUG
          </ToggleGroupItem>
          <ToggleGroupItem
            value="WARN"
            aria-label="Toggle WARN"
          >
            WARN
          </ToggleGroupItem>
          <ToggleGroupItem
            value="ALERT"
            aria-label="Toggle ALERT"
          >
            ALERT
          </ToggleGroupItem>
          <ToggleGroupItem
            value="ERROR"
            aria-label="Toggle ERROR"
          >
            ERROR
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="flex gap-1">
            <div>Page</div>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <div className="flex gap-1">
            {[...Array(table.getPageCount()).keys()].map((page) => (
              <Button
                key={page}
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(page)}
                // className={cn({
                //   "bg-primary text-white":
                //     page === table.getState().pagination.pageIndex,
                // })}
              >
                {page + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={"text-" + row.getValue("level")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
