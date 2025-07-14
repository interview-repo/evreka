import { createFileRoute } from "@tanstack/react-router";
import { useUsersList } from "@/hooks/users/useUsersList";
import { ControlPanel } from "@/components/shared/control-panel";
import { ContentArea } from "@/components/shared/content";
import { Pagination } from "@/components/table/pagination";
import { Icon } from "@/components/shared/Icon";
import { ActionButton } from "@/components/shared/button";
import {
  UserModalProvider,
  useUserModalContext,
} from "@/contexts/UserModalContext";
import { Layout } from "@/layout";

export const Route = createFileRoute("/")({
  component: () => (
    <UserModalProvider>
      <UsersPage />
    </UserModalProvider>
  ),
});

function UsersPage() {
  const { table, filters, renderGrid, hasActiveFilters, handleClearFilters } =
    useUsersList();

  const userModal = useUserModalContext();

  return (
    <Layout
      title="Users CRM"
      description="Manage your team and their roles"
      error={table.state.error}
      onRetry={() => window.location.reload()}
      actionButton={
        <ActionButton
          onClick={userModal.openCreateModal}
          disabled={userModal.isSubmitting}
        >
          <Icon name="PlusIcon" />
          Add User
        </ActionButton>
      }
    >
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

      <ContentArea
        viewMode={table.state.viewMode}
        data={table.data.display}
        isLoading={table.state.isLoading}
        error={table.state.error}
        renderTable={({ onRowClick }) => (
          <table.Table onRowClick={onRowClick} />
        )}
        renderGrid={(user) => renderGrid(user, userModal.openEditModal)}
        gridConfig={{
          itemsPerRow: 4,
          itemMinWidth: 280,
          gap: 24,
        }}
      />

      {table.state.isPaginated && table.data.stats.totalPages > 1 && (
        <Pagination
          currentPage={table.state.currentPage}
          totalPages={table.data.stats.totalPages}
          totalItems={table.data.stats.total}
          itemsPerPage={table.data.stats.perPage}
          onPrevious={table.actions.prevPage}
          onNext={table.actions.nextPage}
          onPerPageChange={table.actions.setPageSize}
        />
      )}
    </Layout>
  );
}
