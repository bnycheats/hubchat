import { cn } from '@/lib/utils';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, type TableOptions } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Spinner from './spinner';

export function DataTable<TData, TValue>({
  className,
  columns,
  data,
  emptyMessage = <NoResult />,
  isLoading,
  enableRowSelection = false,
  ...other
}: DataTableProps<TData, TValue> & Omit<TableOptions<TData>, 'data' | 'columns' | 'getCoreRowModel'>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...other,
  });

  return (
    <div className={cn('py-2 relative', className)}>
      {isLoading && <Spinner className="w-10 h-10" centered fixed={false} />}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow key={index}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function NoResult() {
  return (
    <div className="text-center">
      <div>No result.</div>
      <div>Try adjusting or removing filters.</div>
    </div>
  );
}

type DataTableProps<TData, TValue> = {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: React.ReactNode;
  isLoading?: boolean;
};

export default DataTable;
