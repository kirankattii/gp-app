"use client";

import clsx from "clsx";

interface AmountProps {
  value: number | string;
  decimals?: number;
  className?: string;
  showSymbol?: boolean;
}

export function Amount({
  value,
  decimals = 2,
  className,
  showSymbol = true,
}: AmountProps) {
  const num = Number(value);

  const formatted =
    isNaN(num) ? "0.00" : num.toLocaleString("en-IN", { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  return (
    <span className={clsx("text-[var(--gp-text)] font-medium", className)}>
      {showSymbol && <span className="mr-0.5">₹</span>}
      {formatted}
    </span>
  );
}

export default Amount;