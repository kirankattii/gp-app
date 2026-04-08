import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import clsx from "clsx";

interface TableSkeletonLoaderProps {
  cols: number;
  rows?: number;
}

const TableSkeletonLoader: React.FC<TableSkeletonLoaderProps> = ({
  cols,
  rows = 5,
}) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={`skeleton-row-${rowIndex}`}>
        {Array.from({ length: cols }).map((_, colIndex) => (
          <TableCell
            key={`skeleton-cell-${rowIndex}-${colIndex}`}
            className="text-center"
          >
            <div
              className={clsx(
                "h-4 w-full rounded-md bg-[var(--gp-surface-soft)] animate-pulse"
              )}
            />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export default TableSkeletonLoader;