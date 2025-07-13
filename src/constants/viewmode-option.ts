import type { IconName } from "@/components/shared/Icon";

export type ViewMode = "table" | "grid"

export interface ViewModeOption {
  mode: ViewMode;
  icon: IconName;
  label: string;
}

export const viewModesOptions: ViewModeOption[] = [
  { mode: "table", icon: "TableCellsIcon", label: "Table" },
  { mode: "grid", icon: "Squares2X2Icon", label: "Cards" },
];
