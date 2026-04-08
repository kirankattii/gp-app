"use client";

import { format, isValid, parseISO } from "date-fns";

interface DateFormatProps {
  value: string | Date | number | null | undefined;
  formatStr?: string;
  fallback?: string;
  className?: string;
}

export const DateFormat = ({
  value,
  className,
  fallback = "",
  formatStr = "dd MMM yyyy, hh:mm a",
}: DateFormatProps) => {
  if (!value) return fallback ? <span className={className}>{fallback}</span> : null;
  let dateObj: Date;

  if (value instanceof Date) dateObj = value;
  else if (typeof value === "number") dateObj = new Date(value);
  else dateObj = parseISO(value);

  if (!isValid(dateObj)) return fallback ? <span>{fallback}</span> : null;

  return <span className={className}>{format(dateObj, formatStr)}</span>;
};

export default DateFormat;