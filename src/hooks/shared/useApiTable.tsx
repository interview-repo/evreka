import { useState, useMemo, useCallback } from "react";
import { Table } from "@/components/table";
import type { createApi } from "./useApi";
import type { TableColumn, TableAction } from "@/components/table/types";
import type { ViewMode } from "@/constants/viewmode-option";
import type { BaseEntity } from "@/types/base";
import type { Filter } from "@/types/response";

interface UseApiTableConfig<T extends BaseEntity> {
  api: ReturnType<typeof createApi<T>>;
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  defaultViewMode?: ViewMode;
  pageSize?: number;
  baseFilters?: Record<string, unknown>;
}

export function useApiTable<T extends BaseEntity>({
  api,
  columns,
  actions = [],
  defaultViewMode = "table",
  pageSize = 25,
  baseFilters = {},
}: UseApiTableConfig<T>) {
  const apiHook = api();

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaginated, setIsPaginated] = useState(true);
  const [filters, setFilters] = useState<Filter<T>>({});

  const queryFilters = useMemo(() => {
    const apiFilters: Filter<T> = {
      ...baseFilters,
      ...filters,
    };

    if (search.trim()) {
      apiFilters._search = search.trim();
    }

    if (sortBy) {
      apiFilters._sort = String(sortBy);
      apiFilters._order = sortOrder;
    }

    if (isPaginated) {
      apiFilters._page = currentPage;
      apiFilters._limit = pageSize;
    } else {
      apiFilters._all = true;
    }

    return apiFilters;
  }, [
    baseFilters,
    filters,
    search,
    sortBy,
    sortOrder,
    currentPage,
    isPaginated,
    pageSize,
  ]);

  const { data: response, isLoading, error } = apiHook.useList(queryFilters);

  // Handlers
  const handleSort = useCallback(
    (key: keyof T) => {
      if (sortBy === key) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(key);
        setSortOrder("asc");
      }
      setCurrentPage(1);
    },
    [sortBy, sortOrder]
  );

  const updateFilter = useCallback((key: string, value: unknown) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (value === undefined || value === null || value === "all") {
        delete newFilters[key as keyof T];
      } else {
        (newFilters as any)[key] = value;
      }
      return newFilters;
    });
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearch("");
    setSortBy(null);
    setCurrentPage(1);
  }, []);

  const TableComponent = useCallback(
    ({ onRowClick }: { onRowClick?: (row: T) => void }) => {
      return (
        <Table
          data={response?.data || []}
          columns={columns}
          actions={actions}
          isLoading={isLoading}
          error={error}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRowClick={onRowClick}
        />
      );
    },
    [
      response?.data,
      columns,
      actions,
      isLoading,
      error,
      sortBy,
      sortOrder,
      handleSort,
    ]
  );

  const stats = useMemo(() => {
    const total = response?.meta?.total || 0;
    const showing = response?.data?.length || 0;
    const apiPage = response?.meta?.page || currentPage;
    const totalPages = response?.meta?.totalPages || 0;

    return {
      total,
      showing,
      currentPage: apiPage,
      totalPages,
      hasNextPage: apiPage < totalPages,
      hasPrevPage: apiPage > 1,
    };
  }, [response, currentPage]);

  // Actions
  const actions_obj = {
    setViewMode,
    setSearch,
    setIsPaginated,
    setCurrentPage,
    updateFilter,
    clearFilters,
    nextPage: () =>
      setCurrentPage((prev) => Math.min(prev + 1, stats.totalPages)),
    prevPage: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
  };

  // State
  const state = {
    viewMode,
    search,
    sortBy,
    sortOrder,
    currentPage,
    isPaginated,
    filters,
    isLoading,
    error,
  };

  return {
    state,
    actions: actions_obj,
    data: {
      display: response?.data || [],
      stats,
    },
    Table: TableComponent,
  };
}
