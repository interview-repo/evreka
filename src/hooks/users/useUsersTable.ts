import { useApiTable } from "@/hooks/shared/useApiTable";
import useUsersApi from "@/api/client";
import { userTableColumns } from "@/components/user/table";
import type { User } from "@/types/user";
import type { TableAction } from "@/components/table/types";

interface UseUsersTableConfig {
  onViewUser?: (user: User) => void;
  onEditUser?: (user: User) => void;
}

export const useUsersTable = ({
  onViewUser,
  onEditUser,
}: UseUsersTableConfig = {}) => {
  const actions: TableAction<User>[] = [];

  if (onViewUser) {
    actions.push({
      key: "view",
      label: "View",
      onClick: onViewUser,
    });
  }

  if (onEditUser) {
    actions.push({
      key: "edit",
      label: "Edit",
      onClick: onEditUser,
    });
  }

  return useApiTable<User>({
    api: useUsersApi,
    columns: userTableColumns,
    actions,
    baseFilters: {
      _sort: "createdAt",
      _order: "desc",
    },
  });
};
