
export type VariantColor =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"
  | "primary"
  | "light"
  | "white"
  | "danger";

export interface MenuItem {
  label: string;
  icon?: any;
  path?: string;
  allowed: string[];
  children?: MenuItem[];
  id?: string;
  description?: string;
  badge?: {
    path: keyof MenuCount;
    count?: number;
  };
  rbac?: string[];
  color?: VariantColor;
  key?: string;
  count?: number;
}

export interface MenuCount {
  b2bOrderProcess: number;
  b2bOrderApprovalPending: number;
  b2cOrderApprovalPending: number;
  b2cOrderProcess: number;
}

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
