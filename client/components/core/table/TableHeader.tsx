import React from "react";
import { TableHead, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import AppPopover from "../popover/AppPopover";
import clsx from "clsx";
import type { SortValue, TableHeaderItem } from "@/types/CommonTypes";

interface TableHeaderProps {
  headers: TableHeaderItem[];
  onSort?: (data: { key: string; value: SortValue }) => void;
  className?: string;
  sortValue?: SortValue;
  sortKey?: string;
  noBg?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  headers,
  onSort,
  className = "",
  sortValue,
  sortKey,
  noBg = false,
}) => {

  const handleSort = (item: TableHeaderItem) => {
    if (!item.enableSort || !onSort) return;

    const newValue =
      item.key === sortKey && sortValue === "asc" ? "desc" : "asc";

    onSort({
      key: item.key || "",
      value: newValue,
    });
  };

  const renderInfo = (info?: React.ReactNode) =>
    info ? (
      <AppPopover
        triggerContent={
          <Info className="w-4 h-4 text-[var(--gp-text-muted)]" />
        }
      >
        <div className="text-sm text-[var(--gp-text-muted)]">{info}</div>
      </AppPopover>
    ) : null;

  const cellClass = (center?: boolean) =>
    clsx("flex items-center gap-1", center && "justify-center");

  return (
    <TableRow className={className}>
      {headers.map((header, index) => (
        <TableHead
          key={index}
          colSpan={header.colSpan}
          style={{ width: header.width }}
          onClick={() => handleSort(header)}
          className={clsx(
            !noBg && "bg-[var(--gp-surface-soft)]",
            header.isCentered && "text-center",
            header.enableSort && "cursor-pointer select-none"
          )}
        >
          <div className={cellClass(header.isCentered)}>
            {/* LABEL */}
            {header.label}
            {renderInfo(header.info)}

            {/* SORT ICONS */}
            {header.enableSort && (
              <div className="flex flex-col self-center mt-1">
                <ChevronUp
                  size={14}
                  className={clsx(
                    header.key === sortKey && sortValue === "asc"
                      ? "text-[var(--gp-primary)]"
                      : "text-[var(--gp-text-muted)]"
                  )}
                />
                <ChevronDown
                  size={14}
                  className={clsx(
                    "-mt-1",
                    header.key === sortKey && sortValue === "desc"
                      ? "text-[var(--gp-primary)]"
                      : "text-[var(--gp-text-muted)]"
                  )}
                />
              </div>
            )}
          </div>
        </TableHead>
      ))}
    </TableRow>
  );
};

export default TableHeader;