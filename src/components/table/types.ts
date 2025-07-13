import type { BaseEntity } from "@/types/base";

export type ViewMode = "table" | "grid" | "list";

export interface TableColumn<T extends BaseEntity> {
  key: keyof T;
  header: string;
  cell?: (value: any, row: T) => React.ReactNode;
}

export interface TableAction<T extends BaseEntity> {
  key: string;
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "danger" | "success";
}

export interface TableConfig<T extends BaseEntity> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  defaultViewMode?: ViewMode;
  pageSize?: number;
  virtualHeight?: number;
}
