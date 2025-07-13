import type { IconName } from "@/components/shared/Icon";
import { UserRoleOptions, type UserRole } from "@/types/user";

export const roleOptions: { value: UserRole; label: string; icon: IconName }[] =
  UserRoleOptions.map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1),
    icon:
      role === "admin"
        ? "ShieldCheckIcon"
        : role === "manager"
          ? "UserGroupIcon"
          : "UserIcon",
  }));
