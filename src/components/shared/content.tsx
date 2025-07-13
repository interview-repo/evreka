import React from "react";
import styled from "styled-components";
import type { JSX } from "react";
import { EmptyData } from "./not-found";
import { VirtualizedGrid } from "../table/virtualized-grid";
import type { ViewMode } from "@/constants/viewmode-option";
import type { BaseEntity } from "@/types/base";

interface IProps<T extends BaseEntity> {
  viewMode: ViewMode;
  data: T[];
  renderTable?: ({
    onRowClick,
  }: {
    onRowClick?: (row: T) => void;
  }) => JSX.Element;
  renderGrid?: (item: T) => React.ReactNode;
  renderListItem?: (item: T) => React.ReactNode;
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
  gridConfig?: {
    itemsPerRow?: number;
    itemMinWidth?: number;
    gap?: number;
  };
}

const ContentContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px;
  margin-bottom: 80px;
`;

const ContentWrapper = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(17, 24, 39, 0.05);
  border: 1px solid rgba(229, 231, 235, 0.5);
  overflow: hidden;
`;

const TableContainer = styled.div`
  height: calc(100vh - 23rem);
`;

export const ContentArea = <T extends BaseEntity>({
  viewMode,
  data,
  renderTable,
  renderGrid,
  className = "",
  isLoading = false,
  error = null,
  gridConfig = {
    itemsPerRow: 4,
    itemMinWidth: 280,
    gap: 24,
  },
}: IProps<T>) => {
  const renderContent = () => {
    if (!isLoading && data.length === 0) return <EmptyData />;

    switch (viewMode) {
      case "table":
        return (
          <TableContainer>
            {renderTable?.({ onRowClick: undefined })}
          </TableContainer>
        );

      case "grid":
        if (!renderGrid) {
          return <EmptyData />;
        }

        return (
          <VirtualizedGrid
            data={data}
            renderItem={renderGrid}
            isLoading={isLoading}
            error={error}
            itemsPerRow={gridConfig.itemsPerRow}
            itemMinWidth={gridConfig.itemMinWidth}
            gap={gridConfig.gap}
          />
        );

      default:
        return <EmptyData />;
    }
  };

  return (
    <ContentContainer className={className}>
      <ContentWrapper>{renderContent()}</ContentWrapper>
    </ContentContainer>
  );
};
