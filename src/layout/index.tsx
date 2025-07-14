import { Header } from "@/components/shared/header";
import { UserModal } from "@/components/user/modal";
import { useUserModalContext } from "@/contexts/UserModalContext";
import type { ReactNode } from "react";

interface LayoutProps {
  title: string;
  description: string;
  actionButton?: ReactNode;
  children: ReactNode;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

export function Layout({
  title,
  description,
  actionButton,
  children,
  error,
  onRetry,
  className = "",
}: LayoutProps) {
  const userModal = useUserModalContext();

  // Global error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <div className="text-red-500 text-xl mb-4">Error Loading Data</div>
          <div className="text-gray-600 mb-4">{error.message}</div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-100 ${className}`}
    >
      <Header
        title={title}
        description={description}
        actionButton={actionButton}
      />

      <main className="mx-auto px-4 pb-8">{children}</main>

      <UserModal
        isOpen={userModal.modalState.isOpen}
        mode={userModal.modalState.mode}
        user={userModal.modalState.user}
        onClose={userModal.closeModal}
        onSubmit={userModal.handleSubmit}
        isLoading={userModal.isSubmitting}
      />
    </div>
  );
}
