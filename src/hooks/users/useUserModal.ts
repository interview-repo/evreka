import { useState, useCallback, useEffect } from "react";
import { type User } from "@/types/user";
import useUsersApi from "@/api/client";
import { useUrlState } from "../shared/useUrlState";

type ModalState = {
  isOpen: boolean;
  mode: "create" | "edit";
  user: User | null;
};

function createModalActions(
  setState: React.Dispatch<React.SetStateAction<ModalState>>
) {
  return {
    openCreateModal: () =>
      setState({ isOpen: true, mode: "create", user: null }),
    openEditModal: (user: User) =>
      setState({ isOpen: true, mode: "edit", user }),
    closeModal: () => setState({ isOpen: false, mode: "create", user: null }),
  };
}

export const useUserModal = () => {
  const usersApi = useUsersApi();
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: "create",
    user: null,
  });

  const actions = createModalActions(setModalState);

  const createMutation = usersApi.useCreate();
  const updateMutation = usersApi.useUpdate();

  // URL sync
  useModalUrlSync(modalState.isOpen, modalState.mode, actions.openCreateModal);

  // Submit handler
  const handleSubmit = useCallback(
    async (data: any) => {
      const mutation = "id" in data ? updateMutation : createMutation;
      await mutation.mutateAsync(data);
      actions.closeModal();
    },
    [createMutation, updateMutation, actions.closeModal]
  );

  return {
    modalState,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    ...actions,
    handleSubmit,
  };
};

// URL sync
function useModalUrlSync(isOpen: boolean, mode: string, onRestore: () => void) {
  const { setUrlParam, removeUrlParam, getUrlParam } = useUrlState();

  useEffect(() => {
    const modal = getUrlParam("modal");
    if (modal === "create") onRestore();
  }, []);

  useEffect(() => {
    if (isOpen && mode === "create") {
      setUrlParam("modal", "create");
    } else if (!isOpen) {
      removeUrlParam("modal");
    }
  }, [isOpen, mode, setUrlParam, removeUrlParam]);
}
