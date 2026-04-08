"use client";

import clsx from "clsx";

interface PaginationSummaryProps {
  start: number;
  end: number;
  total: number;
  size?: "sm" | "md";
  className?: string;
}

export default function PaginationSummary({
  start,
  end,
  total,
  size = "md",
  className,
}: PaginationSummaryProps) {
  if (!total) return null;

  return (
    <span
      className={clsx(
        "text-[var(--gp-text-muted)]",
        size === "sm" ? "text-xs" : "text-sm",
        className
      )}
    >
      Showing {start} – {end} of {total.toLocaleString()}
    </span>
  );
}