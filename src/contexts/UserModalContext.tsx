import { createContext, useContext, type ReactNode } from "react";
import { useUserModal } from "@/hooks/users/useUserModal";

type UserModalContextType = ReturnType<typeof useUserModal>;

const UserModalContext = createContext<UserModalContextType | null>(null);

export function UserModalProvider({ children }: { children: ReactNode }) {
  const userModal = useUserModal();

  return (
    <UserModalContext.Provider value={userModal}>
      {children}
    </UserModalContext.Provider>
  );
}

export function useUserModalContext() {
  const context = useContext(UserModalContext);
  if (!context) {
    throw new Error(
      "useUserModalContext must be used within UserModalProvider"
    );
  }
  return context;
}
