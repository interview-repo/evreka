import { createApi, api } from "@/hooks/shared/useApi";
import type { BaseEntity } from "@/types/base";
import type { Response } from "@/types/response";

export const createApiClient = <T extends BaseEntity>(resource: string) => {
  const useApi = createApi<T>(resource);

  const directApi = {
    get: (id: string) => api.get<Response<T>>(`/${resource}/${id}`),

    list: (filters?: Record<string, unknown>) => {
      const url = `/${resource}`;
      if (!filters) return api.get<Response<T[]>>(url);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });

      return api.get<Response<T[]>>(`${url}?${params}`);
    },

    create: (data: Omit<T, keyof BaseEntity>) =>
      api.post<Response<T>>(`/${resource}`, data),

    update: (id: string, data: Partial<Omit<T, keyof BaseEntity>>) =>
      api.put<Response<T>>(`/${resource}/${id}`, data),

    patch: (id: string, data: Partial<Omit<T, keyof BaseEntity>>) =>
      api.patch<Response<T>>(`/${resource}/${id}`, data),

    delete: (id: string) => api.delete(`/${resource}/${id}`),
  };

  return {
    useApi, // Hook
    api: directApi, // Direct API
  };
};
