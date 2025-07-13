import type { BaseEntity } from "@/types/base";

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
  pageSize?: number;
  virtualHeight?: number;
}
