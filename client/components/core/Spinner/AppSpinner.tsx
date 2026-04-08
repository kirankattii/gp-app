"use client";

import clsx from "clsx";

export type SpinnerSize = "xs" | "sm" | "md" | "lg";

interface GpSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

/**
 * GP Spinner — clean & theme-based
 */
export default function GpSpinner({ size = "md", className }: GpSpinnerProps) {
  const sizeMap: Record<SpinnerSize, string> = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <span
      className={clsx(
        "inline-block animate-spin rounded-full border-[3px]",
        "border-[var(--gp-green-light)]/20 border-t-[var(--gp-green)]",
        sizeMap[size],
        className
      )}
    />
  );
}