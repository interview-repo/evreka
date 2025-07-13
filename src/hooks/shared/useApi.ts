import type { BaseEntity } from "@/types/base";
import type { Filter, Response } from "@/types/response";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";

export type CreateData<T extends BaseEntity> = Omit<T, keyof BaseEntity>;
type UpdatePayload<T extends BaseEntity> = { id: string; data: T };

// API Client
const api = {
  async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: `HTTP ${response.status}`,
      }));
      throw new Error(error.error || "Request failed");
    }

    return response.status === 204 ? ({} as T) : response.json();
  },

  get: <T>(url: string) => api.request<T>(url),
  post: <T>(url: string, data: unknown) =>
    api.request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: <T>(url: string, data: unknown) =>
    api.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  patch: <T>(url: string, data: unknown) =>
    api.request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (url: string) => api.request<void>(url, { method: "DELETE" }),
};

// URL Builder
function buildUrl<T>(resource: string, id?: string, filters?: Filter<T>) {
  let url = `/${resource}`;
  if (id) url += `/${id}`;

  if (filters) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
    if (params.size) url += `?${params}`;
  }

  return url;
}

export const useApi = <T extends BaseEntity, F extends Filter<T> = Filter<T>>(
  resource: string
) => {
  const queryClient = useQueryClient();

  // Query Keys
  const keys = {
    all: [resource] as const,
    lists: () => [...keys.all, "list"] as const,
    list: (filters?: F) => [...keys.lists(), filters] as const,
    details: () => [...keys.all, "detail"] as const,
    detail: (id: string) => [...keys.details(), id] as const,
  };

  // Invalidation
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: keys.all });

  // List Query
  const useList = <R = Response<T[]>>(
    filters?: F,
    options?: Partial<UseQueryOptions<R, Error, R>>
  ) => {
    return useQuery({
      queryKey: keys.list(filters),
      queryFn: () => api.get<R>(buildUrl(resource, undefined, filters)),
      staleTime: 5 * 60 * 1000,
      ...options,
    });
  };

  // Detail Query
  const useDetail = (
    id?: string,
    options?: Partial<UseQueryOptions<Response<T>, Error, Response<T>>>
  ) => {
    return useQuery({
      queryKey: keys.detail(id!),
      queryFn: () => api.get<Response<T>>(buildUrl(resource, id)),
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
      ...options,
    });
  };

  // Create Mutation
  const useCreate = (
    options?: Partial<UseMutationOptions<Response<T>, Error, CreateData<T>>>
  ) => {
    return useMutation({
      mutationFn: (data: CreateData<T>) =>
        api.post<Response<T>>(buildUrl(resource), data),
      onSuccess: (...args) => {
        invalidate();
        options?.onSuccess?.(...args);
      },
      ...options,
    });
  };

  // Update Mutation
  const useUpdate = (
    options?: Partial<UseMutationOptions<Response<T>, Error, UpdatePayload<T>>>
  ) => {
    return useMutation({
      mutationFn: ({ id, data }: UpdatePayload<T>) =>
        api.put<Response<T>>(buildUrl(resource, id), data),
      onSuccess: (result, { id }, ...args) => {
        queryClient.setQueryData(keys.detail(id), result);
        invalidate();
        options?.onSuccess?.(result, { id, data: result.data }, ...args);
      },
      ...options,
    });
  };

  // Patch Mutation
  const usePatch = (
    options?: Partial<UseMutationOptions<Response<T>, Error, UpdatePayload<T>>>
  ) => {
    return useMutation({
      mutationFn: ({ id, data }: UpdatePayload<T>) =>
        api.patch<Response<T>>(buildUrl(resource, id), data),
      onSuccess: (result, { id }, ...args) => {
        queryClient.setQueryData(keys.detail(id), result);
        invalidate();
        options?.onSuccess?.(result, { id, data: result.data }, ...args);
      },
      ...options,
    });
  };

  // Delete Mutation
  const useDelete = (
    options?: Partial<UseMutationOptions<void, Error, string>>
  ) => {
    return useMutation({
      mutationFn: (id: string) => api.delete(buildUrl(resource, id)),
      onSuccess: (result, id, ...args) => {
        queryClient.removeQueries({ queryKey: keys.detail(id) });
        invalidate();
        options?.onSuccess?.(result, id, ...args);
      },
      ...options,
    });
  };

  return {
    // Queries
    useList,
    useDetail,

    // Mutations
    useCreate,
    useUpdate,
    usePatch,
    useDelete,

    // Utilities
    invalidate,
    keys,

    // Direct API
    api: {
      get: (id?: string, filters?: F) =>
        api.get<Response<T>>(buildUrl(resource, id, filters)),
      list: (filters?: F) =>
        api.get<Response<T>>(buildUrl(resource, undefined, filters)),
    },
  };
};

// Factory
export const createApi = <
  T extends BaseEntity,
  F extends Filter<T> = Filter<T>,
>(
  resource: string
) => {
  return () => useApi<T, F>(resource);
};

export { api };
