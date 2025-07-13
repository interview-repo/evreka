import React, { useMemo } from "react";
import styled from "styled-components";
import { Virtuoso } from "react-virtuoso";
import type { BaseEntity } from "@/types/base";
import { EmptyData } from "../shared/not-found";

interface VirtualizedGridProps<T extends BaseEntity> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  height?: string;
  itemsPerRow?: number;
  itemMinWidth?: number;
  gap?: number;
}

const GridContainer = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(229, 231, 235, 0.5);
  overflow: hidden;
`;

const GridRow = styled.div<{
  $itemsPerRow: number;
  $gap: number;
  $itemMinWidth: number;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${({ $itemsPerRow }) => $itemsPerRow},
    minmax(${({ $itemMinWidth }) => $itemMinWidth}px, 1fr)
  );
  gap: ${({ $gap }) => $gap}px;
  padding: 0 ${({ $gap }) => $gap}px;
  width: 100%;

  /* Responsive breakpoints */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1025px) and (max-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const GridItem = styled.div`
  width: 100%;
  min-height: 200px; /* Consistent height for virtualization */
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #9333ea;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export function VirtualizedGrid<T extends BaseEntity>({
  data,
  renderItem,
  isLoading = false,
  error = null,
  height = "calc(100vh - 23rem)",
  itemsPerRow = 4,
  itemMinWidth = 280,
  gap = 24,
}: VirtualizedGridProps<T>) {
  const gridRows = useMemo(() => {
    const rows: T[][] = [];
    for (let i = 0; i < data.length; i += itemsPerRow) {
      rows.push(data.slice(i, i + itemsPerRow));
    }
    return rows;
  }, [data, itemsPerRow]);

  // Loading state
  if (isLoading) {
    return (
      <GridContainer>
        <LoadingState>
          <Spinner />
          <span>Loading...</span>
        </LoadingState>
      </GridContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <GridContainer>
        <div className="flex items-center justify-center h-64 text-red-500">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Error Loading Data</div>
            <div className="text-sm text-gray-600">{error.message}</div>
          </div>
        </div>
      </GridContainer>
    );
  }

  // Empty state
  if (data.length === 0) <EmptyData />;

  return (
    <GridContainer>
      <Virtuoso
        style={{ height }}
        totalCount={gridRows.length}
        itemContent={(index) => {
          const row = gridRows[index];
          return (
            <div
              style={{ paddingTop: index === 0 ? gap : 0, paddingBottom: gap }}
            >
              <GridRow
                $itemsPerRow={itemsPerRow}
                $gap={gap}
                $itemMinWidth={itemMinWidth}
              >
                {row.map((item) => (
                  <GridItem key={item.id}>{renderItem(item)}</GridItem>
                ))}
                {row.length < itemsPerRow &&
                  Array.from({ length: itemsPerRow - row.length }).map(
                    (_, emptyIndex) => (
                      <GridItem key={`empty-${index}-${emptyIndex}`} />
                    )
                  )}
              </GridRow>
            </div>
          );
        }}
        components={{
          Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
            <div {...props} ref={ref} />
          )),
        }}
      />
    </GridContainer>
  );
}
