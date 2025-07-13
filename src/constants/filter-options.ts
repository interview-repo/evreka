import type { IconName } from "@/components/shared/Icon";
import { roleOptions } from "./role-options";

export const filterOptions: Record<
  string,
  { value: string; label: string; icon: IconName }[]
> = {
  role: [
    { value: "all", label: "All Roles", icon: "UsersIcon" },
    ...roleOptions,
  ],
  active: [
    { value: "all", label: "All Status", icon: "CircleStackIcon" },
    { value: "true", label: "Active", icon: "CheckCircleIcon" },
    { value: "false", label: "Inactive", icon: "XCircleIcon" },
  ],
};
