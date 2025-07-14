import { useState, useCallback, useEffect } from "react";
import { type User } from "@/types/user";
import useUsersApi from "@/api/client";
import { useUrlState } from "../shared/useUrlState";

type ModalState = {
  isOpen: boolean;
  mode: "create" | "edit";
  user: User | null;
};

export const useUserModal = () => {
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

  // Modal actions
  const openCreateModal = useCallback(() => {
    setModalState({ isOpen: true, mode: "create", user: null });
  }, []);

  const openEditModal = useCallback((user: User) => {
    setModalState({ isOpen: true, mode: "edit", user });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ isOpen: false, mode: "create", user: null });
  }, []);

  useModalUrlSync(modalState.isOpen, modalState.mode, openCreateModal);

  // Submit handler
  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        if ("id" in data) {
          await updateMutation.mutateAsync(data);
        } else {
          await createMutation.mutateAsync(data);
        }
        closeModal();
      } catch (error) {
        throw error;
      }
    },
    [createMutation, updateMutation, closeModal]
  );

  return {
    // State
    modalState,
    isSubmitting: createMutation.isPending || updateMutation.isPending,

    // Actions
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
  };
};

function useModalUrlSync(isOpen: boolean, mode: string, onRestore: () => void) {
  const { setUrlParam, removeUrlParam, getUrlParam } = useUrlState();

  useEffect(() => {
    const modal = getUrlParam("modal");
    if (modal === "create") {
      onRestore();
    }
  }, []);

  useEffect(() => {
    if (isOpen && mode === "create") {
      setUrlParam("modal", "create");
    } else if (!isOpen) {
      removeUrlParam("modal");
    }
  }, [isOpen, mode, setUrlParam, removeUrlParam]);

  return {
    setUrlParam,
    removeUrlParam,
  };
}
