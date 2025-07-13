import type { User } from "@/types/user";
import { createApiClient } from "@/utils/createApiClient";

const { useApi: useUsersApi, api: usersApi } = createApiClient<User>("users");

export default useUsersApi;
export { usersApi };
