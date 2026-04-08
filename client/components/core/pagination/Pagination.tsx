"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  totalRecords: number;
  rowsPerPage: number;
  activePage?: number;
  size?: "xs" | "sm" | "default" | "lg";
  onChange?: (page: number) => void;
  maxSteps?: number; // default = 5
}

export default function Pagination({
  totalRecords,
  rowsPerPage,
  activePage = 1,
  onChange,
  size = "default",
  maxSteps = 5,
}: PaginationProps) {
  const totalPages = rowsPerPage > 0 ? Math.ceil(totalRecords / rowsPerPage) : 0;  const [page, setPage] = useState(activePage);

  useEffect(() => setPage(activePage), [activePage]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];

    const half = Math.floor(maxSteps / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxSteps - 1);

    if (end - start < maxSteps - 1) {
      start = Math.max(1, end - maxSteps + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages, maxSteps]);

  const handleChange = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    onChange?.(p);
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center gap-2">
      {/* FIRST */}
      <Button
        variant="outline"
        size={size}
        disabled={page === 1}
        onClick={() => handleChange(1)}
      >
        First
      </Button>

      {/* PREV */}
      <Button
        variant="outline"
        size={size}
        disabled={page === 1}
        onClick={() => handleChange(page - 1)}
      >
        Prev
      </Button>

      {/* PAGE NUMBERS */}
      {pageNumbers.map((num) => (
        <Button
          key={num}
          variant={num === page ? "default" : "outline"}
          size={size}
          className={clsx(
            num === page && "bg-[var(--gp-green)] text-white hover:bg-[var(--gp-green-hover)] border-transparent"
          )}
          onClick={() => handleChange(num)}
        >
          {num}
        </Button>
      ))}

      {/* NEXT */}
      <Button
        variant="outline"
        size={size}
        disabled={page === totalPages}
        onClick={() => handleChange(page + 1)}
      >
        Next
      </Button>

      {/* LAST */}
      <Button
        variant="outline"
        size={size}
        disabled={page === totalPages}
        onClick={() => handleChange(totalPages)}
      >
        Last
      </Button>
    </nav>
  );
}