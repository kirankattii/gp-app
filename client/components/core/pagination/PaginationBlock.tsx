"use client";

import clsx from "clsx";
import PaginationSummary from "./PaginationSummary";
import Pagination from "./Pagination";

interface PaginationBlockProps {
  totalRecords: number;
  rowsPerPage: number;
  activePage: number;
  onChange: (page: number) => void;
  showSummary?: boolean;
  size?: "xs" | "sm" | "default" | "lg";
  className?: string;
}

export default function PaginationBlock({
  totalRecords,
  rowsPerPage,
  activePage,
  onChange,
  showSummary = true,
  size = "default",
  className,
}: PaginationBlockProps) {
  const start = (activePage - 1) * rowsPerPage + 1;
  const end = Math.min(activePage * rowsPerPage, totalRecords);

  if (totalRecords <= rowsPerPage) return null;

  return (
    <div className={clsx("flex items-center justify-between", className)}>
      {showSummary && (
        <PaginationSummary
          start={start}
          end={end}
          total={totalRecords}
          size={size === "sm" ? "sm" : "md"}
        />
      )}

      <Pagination
        totalRecords={totalRecords}
        rowsPerPage={rowsPerPage}
        activePage={activePage}
        size={size}
        onChange={onChange}
      />
    </div>
  );
}