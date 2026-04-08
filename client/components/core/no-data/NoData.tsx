"use client";

import { FileSearch2 } from "lucide-react";
import clsx from "clsx";

interface GpNoDataProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function GpNoData({
  children,
  title,
  description,
  icon,
  className,
}: GpNoDataProps) {

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
    >
      {children ? (
        children
      ) : (
        <div className="text-center max-w-sm">
          {/* ICON */}
          <div className="mb-4 flex justify-center">
            {icon || (
              <div className="p-4 rounded-full border border-[var(--gp-border)] bg-[var(--gp-surface-soft)]">
                <FileSearch2
                  size={32}
                  className="text-[var(--gp-text-muted)]"
                />
              </div>
            )}
          </div>

          {/* TITLE */}
          <h3 className="text-sm font-semibold text-[var(--gp-text)] mb-2">
            {title || "No Data Found"}
          </h3>
          {/* DESCRIPTION */}
          {description && (
            <p className="text-sm text-[var(--gp-text-muted)] leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}