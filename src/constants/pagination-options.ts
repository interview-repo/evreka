import type { IconName } from "@/components/shared/Icon";

export const paginationOptions: {
  value: boolean;
  icon: IconName;
  label: string;
  title: string;
}[] = [
  {
    value: true,
    icon: "DocumentTextIcon",
    label: "Pages",
    title: "Paginated View",
  },
  {
    value: false,
    icon: "ArrowPathIcon",
    label: "Infinite",
    title: "Infinite Scroll",
  },
];
