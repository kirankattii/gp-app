import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";

interface AppTableProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  hover?: boolean;
  striped?: boolean;
  responsive?: boolean;
  size?: "sm" | "md" | "lg";
  minWidth?: string;
  fixedLayout?: boolean;
  stickyHeader?: boolean;
  container?: boolean;
  containerStyle?: React.CSSProperties;
  light?: boolean;
  condensed?: boolean;
}

interface AppTableComposition {
  Header: React.FC<{
    children: React.ReactNode;
    className?: string;
    light?: boolean;
  }>;
  Body: React.FC<{ children: React.ReactNode; className?: string }>;
  Footer: React.FC<{ children: React.ReactNode; className?: string }>;
  Row: React.FC<{
    children: React.ReactNode;
    className?: string;
    id?: string;
    onClick?: () => void;
    noHover?: boolean;
  }>;
  Cell: React.FC<{
    children: React.ReactNode;
    className?: string;
    colSpan?: number;
    rowSpan?: number;
    style?: React.CSSProperties;
  }>;
}

const AppTable: React.FC<AppTableProps> & AppTableComposition = ({
  children,
  className = "",
  size = "sm",
  minWidth = "100%",
  fixedLayout = false,
  stickyHeader = false,
  container = false,
  containerStyle,
  condensed = false,
}) => {
  const tableClasses = clsx(
    size === "sm" && "text-sm",
    size === "md" && "text-base",
    size === "lg" && "text-lg",
    fixedLayout && "table-fixed",
    stickyHeader && "sticky-header",
    condensed && "leading-tight",
    className
  );

  const table = (
    <Table
      className={tableClasses}
      style={{
        minWidth,
        borderColor: "var(--gp-border)",
      }}
    >
      {children}
    </Table>
  );

  if (container) {
    return (
      <div
        className="overflow-auto thin-scrollbar"
        style={containerStyle}
      >
        {table}
      </div>
    );
  }

  return table;
};

// COMPOSITION PARTS
AppTable.Header = ({ children, className }) => (
  <TableHeader className={clsx("bg-[var(--gp-surface-soft)]", className)}>
    {children}
  </TableHeader>
);

AppTable.Body = ({ children, className }) => (
  <TableBody className={className}>{children}</TableBody>
);

AppTable.Footer = ({ children, className }) => (
  <TableFooter
    className={clsx("bg-[var(--gp-surface-soft)]", className)}
  >
    {children}
  </TableFooter>
);

AppTable.Row = ({ children, className = "", onClick, id, noHover }) => (
  <TableRow
    id={id}
    onClick={onClick}
    className={clsx(
      "transition-colors",
      !noHover && "hover:bg-[var(--gp-surface-soft)]",
      className
    )}
  >
    {children}
  </TableRow>
);

AppTable.Cell = ({ children, className = "", colSpan, rowSpan, style }) => (
  <TableCell
    className={clsx("truncate", className)}
    colSpan={colSpan}
    rowSpan={rowSpan}
    style={style}
  >
    {children}
  </TableCell>
);
export default AppTable;