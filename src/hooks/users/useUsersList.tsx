// src/hooks/users/useUsersList.ts
import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { type User } from "@/types/user";
import { useUsersTable } from "./useUsersTable";
import { filterOptions } from "@/constants";
import { UserGrid } from "@/components/user/grid";

export const useUsersList = () => {
  const navigate = useNavigate();

  const handleViewUser = useCallback(
    ({ id }: User) => {
      navigate({ to: `/user/${id}` });
    },
    [navigate]
  );

  const table = useUsersTable({
    onViewUser: handleViewUser,
  });

  const handleClearAllFilters = useCallback(() => {
    table.actions.clearFilters();
  }, [table.actions]);

  const renderGrid = useCallback(
    (user: User, onEdit?: (user: User) => void) => (
      <UserGrid user={user} onView={handleViewUser} onEdit={onEdit} />
    ),
    [handleViewUser]
  );

  const hasActiveFilters =
    Object.values(table.state.filters).some((v) => v !== undefined) ||
    !!table.state.search;

  const filters = [
    {
      value: String(table.state.filters.role || "all"),
      onChange: (value: string) =>
        table.actions.updateFilter("role", value === "all" ? undefined : value),
      options: filterOptions.role,
    },
    {
      value:
        table.state.filters.active === undefined
          ? "all"
          : String(table.state.filters.active),
      onChange: (value: string) => {
        table.actions.updateFilter(
          "active",
          value === "all" ? undefined : value === "true"
        );
      },
      options: filterOptions.active,
    },
  ];

  return {
    // Table
    table,
    // Loading state
    isLoading: table.state.isLoading,

    // Computed state
    hasActiveFilters,

    // Configuration
    filters,

    // Event handlers
    handleViewUser,
    handleClearFilters: handleClearAllFilters,

    // Render functions
    renderGrid,
  };
};
