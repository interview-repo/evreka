import { createFileRoute } from "@tanstack/react-router";
import { useUsersList } from "@/hooks/users/useUsersList";
import { ControlPanel } from "@/components/shared/control-panel";
import { ContentArea } from "@/components/shared/content";
import { Pagination } from "@/components/table/Pagination";
import { Loading } from "@/components/shared/loading";

export const Route = createFileRoute("/")({
  component: UsersPage,
});

export default function UsersPage() {
  const {
    table,
    filters,
    isLoading,
    renderGrid,
    hasActiveFilters,
    handleClearFilters,
  } = useUsersList();

  // Error state
  if (table.state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-red-500 text-xl mb-4">Error Loading Users</div>
          <div className="text-gray-600 mb-4">{table.state.error.message}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-100">
      {/* Control Panel */}
      <ControlPanel
        search={table.state.search}
        onSearchChange={table.actions.setSearch}
        searchPlaceholder="Search by name, email, or role..."
        filters={filters}
        viewMode={table.state.viewMode}
        onViewModeChange={table.actions.setViewMode}
        isPaginated={table.state.isPaginated}
        onPaginationToggle={table.actions.setIsPaginated}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {isLoading && <Loading message="Loading users..." />}

      <ContentArea
        viewMode={table.state.viewMode}
        data={table.data.display}
        renderTable={({ onRowClick }) => (
          <table.Table onRowClick={onRowClick} />
        )}
        renderGrid={renderGrid}
      />

      {table.state.isPaginated && table.data.stats.totalPages > 1 && (
        <Pagination
          currentPage={table.state.currentPage}
          totalPages={table.data.stats.totalPages}
          totalItems={table.data.stats.total}
          itemsPerPage={table.data.stats.showing}
          onPrevious={table.actions.prevPage}
          onNext={table.actions.nextPage}
        />
      )}
    </div>
  );
}
