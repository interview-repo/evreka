import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useUsersApi, { usersApi } from "@/api/client";
import { UserDetailPage } from "@/components/user/detail";

export const Route = createFileRoute("/user/$userId")({
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

  const handleGoBack = () => {
    navigate({ to: "/" });
  };

  const handleEdit = () => {
    navigate({
      to: "/",
      search: { editUser: userId },
    });
  };

  return (
    <UserDetailPage
      user={userResponse?.data}
      isLoading={isLoading}
      error={error}
      onBack={handleGoBack}
      onEdit={handleEdit}
    />
  );
}
