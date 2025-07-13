import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useUsersApi, { usersApi } from "@/api/client";
import { UserDetailPage } from "@/components/user/detail";
import { useUserModal } from "@/hooks/users/useUserModal";
import { UserModal } from "@/components/user/modal";

export const Route = createFileRoute("/users/$userId")({
  component: UserDetail,

  loader: async ({ context, params }) => {
    const { queryClient } = context;
    const { userId } = params;

    await queryClient.ensureQueryData({
      queryKey: ["users", userId],
      queryFn: () => usersApi.get(userId), // Clean & simple!
      staleTime: 10 * 60 * 1000,
    });
  },
});
function UserDetail() {
  const navigate = useNavigate();
  const { userId } = Route.useParams();
  const usersApi = useUsersApi();

  const { data: userResponse, isLoading, error } = usersApi.useDetail(userId);

  const userModal = useUserModal();

  const handleGoBack = () => {
    navigate({ to: "/" });
  };

  return (
    <div>
      <UserDetailPage
        user={userResponse?.data}
        isLoading={isLoading}
        error={error}
        onBack={handleGoBack}
        onEdit={userModal.openEditModal}
      />
      
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
