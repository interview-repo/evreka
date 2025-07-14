import type { IconName } from "@/components/shared/Icon";
import { UserRoleOptions, type UserRole } from "@/types/user";

const roleConfig: Record<UserRole, { label: string; icon: IconName }> = {
  admin: { label: "Admin", icon: "ShieldCheckIcon" },
  manager: { label: "Manager", icon: "UserGroupIcon" },
  user: { label: "User", icon: "UserIcon" },
};

export const roleOptions = UserRoleOptions.map((role) => ({
  value: role,
  ...roleConfig[role],
}));
