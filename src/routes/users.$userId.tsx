import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useUsersApi, { usersApi } from "@/api/client";
import { UserDetailPage } from "@/components/user/detail";
import { ActionButton } from "@/components/shared/button";
import { Icon } from "@/components/shared/Icon";
import {
  UserModalProvider,
  useUserModalContext,
} from "@/contexts/UserModalContext";
import { Layout } from "@/layout";

export const Route = createFileRoute("/users/$userId")({
  component: () => (
    <UserModalProvider>
      <UserDetail />
    </UserModalProvider>
  ),
  loader: async ({ context, params }) => {
    const { queryClient } = context;
    const { userId } = params;

    await queryClient.ensureQueryData({
      queryKey: ["users", userId],
      queryFn: () => usersApi.get(userId),
      staleTime: 10 * 60 * 1000,
    });
  },
});

function UserDetail() {
  const navigate = useNavigate();
  const { userId } = Route.useParams();
  const usersApi = useUsersApi();

  const { data: userResponse, isLoading, error } = usersApi.useDetail(userId);
  const userModal = useUserModalContext();

  const handleGoBack = () => {
    navigate({ to: "/" });
  };

  return (
    <Layout
      title={`User: ${userResponse?.data?.name || "Loading..."}`}
      description="User details and management"
      error={error}
      onRetry={() => window.location.reload()}
      actionButton={
        <ActionButton onClick={handleGoBack}>
          <Icon name="ArrowLeftIcon" />
          Go Back
        </ActionButton>
      }
    >
      <UserDetailPage
        user={userResponse?.data}
        isLoading={isLoading}
        error={error}
        onBack={handleGoBack}
        onEdit={userModal.openEditModal}
      />
    </Layout>
  );
}
