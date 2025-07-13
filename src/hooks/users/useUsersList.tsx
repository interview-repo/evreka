import { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { type User } from "@/types/user";
import { useUsersTable } from "./useUsersTable";
import useUsersApi from "@/api/client";
import { filterOptions } from "@/constants";
import { UserGrid } from "@/components/user/grid";

type ModalState = {
  isOpen: boolean;
  mode: "create" | "edit";
  user: User | null;
};

export const useUsersList = () => {
  const navigate = useNavigate();
  const usersApi = useUsersApi();

  // API mutations
  const createMutation = usersApi.useCreate();
  const updateMutation = usersApi.useUpdate();

  // Modal state
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: "create",
    user: null,
  });

  // Event handlers
  const handleViewUser = useCallback(
    ({ id }: User) => {
      navigate({ to: `/user/${id}` });
    },
    [navigate]
  );

  const handleEditUser = useCallback((user: User) => {
    setModalState({ isOpen: true, mode: "edit", user });
  }, []);

  const table = useUsersTable({
    onViewUser: handleViewUser,
    onEditUser: handleEditUser,
  });

  const handleCreateUser = useCallback(() => {
    setModalState({ isOpen: true, mode: "create", user: null });
  }, []);

  const handleModalClose = useCallback(() => {
    setModalState({ isOpen: false, mode: "create", user: null });
  }, []);

  const handleModalSubmit = useCallback(
    async (data: any) => {
      try {
        if ("id" in data) {
          await updateMutation.mutateAsync(data);
        } else {
          await createMutation.mutateAsync(data);
        }
        handleModalClose();
      } catch (error) {
        throw error;
      }
    },
    [createMutation, updateMutation, handleModalClose]
  );

  const handleClearAllFilters = useCallback(() => {
    table.actions.clearFilters();
  }, [table.actions]);

  // Render functions
  const renderGrid = useCallback(
    (user: User) => (
      <UserGrid user={user} onView={handleViewUser} onEdit={handleEditUser} />
    ),
    [handleViewUser, handleEditUser]
  );

  // Computed values
  const isLoading = table.state.isLoading;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const hasActiveFilters =
    Object.values(table.state.filters).some((v) => v !== undefined) ||
    !!table.state.search;

  // Filters for ControlPanel
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
        console.log("🔍 Active filter onChange:", {
          value,
          converted: value === "all" ? undefined : value === "true",
        });
        table.actions.updateFilter(
          "active",
          value === "all" ? undefined : value === "true"
        );
      },
      options: filterOptions.active,
    },
  ];

  return {
    // State
    modalState,
    isLoading,
    isSubmitting,
    hasActiveFilters,

    // Table data and actions
    table,
    filters,

    // Event handlers
    handleCreateUser,
    handleModalClose,
    handleModalSubmit,
    handleClearFilters: handleClearAllFilters,

    // Render
    renderGrid,
  };
};
