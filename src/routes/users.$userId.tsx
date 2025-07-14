import {
  createFileRoute,
  getRouteApi,
  useNavigate,
} from "@tanstack/react-router";
import { usersApi } from "@/api/client";
import { UserDetailPage } from "@/components/user/detail";
import { ActionButton } from "@/components/shared/button";
import { Icon } from "@/components/shared/Icon";
import { Loading } from "@/components/shared/loading";
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

    return await queryClient.ensureQueryData({
      queryKey: ["users", "detail", userId],
      queryFn: () => usersApi.get(userId),
      staleTime: 10 * 60 * 1000,
    });
  },
  pendingComponent: () => <Loading message="Loading user details..." />,
  errorComponent: ({ error, reset }) => (
    <Layout
      title="Error"
      description="Failed to load user"
      error={error}
      onRetry={reset}
    >
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load user details</p>
        <ActionButton onClick={reset}>Try Again</ActionButton>
      </div>
    </Layout>
  ),
});

const routeApi = getRouteApi("/users/$userId");

function UserDetail() {
  const navigate = useNavigate();
  const { data: user } = routeApi.useLoaderData();
  const userModal = useUserModalContext();

  const handleGoBack = () => {
    navigate({ to: "/" });
  };

  return (
    <Layout
      title={`User: ${user.name}`}
      description="User details and management"
      actionButton={
        <ActionButton onClick={handleGoBack}>
          <Icon name="ArrowLeftIcon" />
          Go Back
        </ActionButton>
      }
    >
      <UserDetailPage
        user={user}
        isLoading={false}
        onBack={handleGoBack}
        onEdit={userModal.openEditModal}
      />
    </Layout>
  );
}
