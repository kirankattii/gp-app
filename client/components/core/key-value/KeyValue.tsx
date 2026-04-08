"use client";

import clsx from "clsx";
import React from "react";

type Size = "sm" | "md" | "lg";

const labelSizeMap: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const valueSizeMap: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

interface KeyValueProps {
  label: React.ReactNode;
  children: React.ReactNode;
  size?: Size;
  horizontal?: boolean;
  icon?: React.ComponentType<any>;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export function KeyValue({
  label,
  children,
  size = "md",
  horizontal = false,
  icon,
  className,
  labelClassName,
  valueClassName,
}: KeyValueProps) {
  return (
    <div className={clsx("flex", className, horizontal ? "items-center gap-2" : "flex-col")}>
      <div
        className={clsx(
          "text-gray-600 flex items-center gap-1",
          labelSizeMap[size],
          labelClassName
        )}
      >
        {icon && React.createElement(icon, { size: 14 })}
        {label}
      </div>

      <div className={clsx(valueSizeMap[size], valueClassName)}>{children}</div>
    </div>
  );
}

export default KeyValue;