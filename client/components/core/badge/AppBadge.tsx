"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

type GpBadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "outline"
  | "neutral";

interface AppBadgeProps {
  children: React.ReactNode;
  variant?: GpBadgeVariant;
  className?: string;
  showClose?: boolean;
  onClose?: () => void;
}

const colors: Record<GpBadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700 border-gray-200",
  neutral: "bg-gray-200 text-gray-800",

  primary: "bg-gp-green-light/10 text-gp-green",
  success: "bg-gp-success-soft text-gp-success border-gp-success/20",
  warning: "bg-gp-warning-soft text-gp-warning border-gp-warning/20",
  danger: "bg-gp-error-soft text-gp-error border-gp-error/20",

  outline: "bg-transparent border border-gp-border text-gp-black",
};

export default function AppBadge({
  children,
  variant = "default",
  className,
  showClose,
  onClose,
}: AppBadgeProps) {
  return (
    <Badge
      className={clsx(
        "px-2 py-0.5 flex items-center gap-1 text-sm rounded-md",
        colors[variant],
        className
      )}
    >
      {children}

      {showClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="ml-1 hover:opacity-70 transition"
          aria-label="Remove"
          type="button"
        >
          <X size={12} />
        </button>      )}
    </Badge>
  );
}