
export interface TableHeaderItem {
  label: string;
  width?: string;
  enableSort?: boolean;
  isCentered?: boolean;
  colSpan?: number;
  key?: string;
  isSticky?: boolean;
  info?: React.ReactNode;
}
export type SortValue = "asc" | "desc" | undefined;
