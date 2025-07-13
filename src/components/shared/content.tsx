import React from "react";
import styled from "styled-components";
import type { JSX } from "react";
import { EmptyData } from "./not-found";
import type { ViewMode } from "../table/types";

interface IProps<T = any> {
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
  gridCols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
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
  height: calc(100vh - 40rem);
`;

const GridContainer = styled.div`
  height: calc(100vh - 40rem);
  overflow: auto;
`;

const GridContent = styled.div<{
  gridCols: { sm?: number; md?: number; lg?: number; xl?: number };
}>`
  display: grid;
  gap: 24px;
  padding: 24px;

  grid-template-columns: repeat(${(props) => props.gridCols.sm || 1}, 1fr);

  @media (min-width: 768px) {
    grid-template-columns: repeat(${(props) => props.gridCols.md || 2}, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(${(props) => props.gridCols.lg || 3}, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(${(props) => props.gridCols.xl || 4}, 1fr);
  }
`;

const GridItem = styled.div`
  width: 100%;
`;

export const ContentArea = <T extends { id: string }>({
  viewMode,
  data,
  renderTable,
  renderGrid,
  className = "",
  gridCols = { sm: 1, md: 2, lg: 3, xl: 4 },
}: IProps<T>) => {
  const renderContent = () => {
    if (data.length === 0) {
      return <EmptyData />;
    }

    switch (viewMode) {
      case "table":
        return <TableContainer>{renderTable?.({})}</TableContainer>;

      case "grid":
        return (
          <GridContainer>
            <GridContent gridCols={gridCols}>
              {data.map((item) => (
                <GridItem key={item.id}>{renderGrid?.(item)}</GridItem>
              ))}
            </GridContent>
          </GridContainer>
        );

      default:
        return null;
    }
  };

  return (
    <ContentContainer className={className}>
      <ContentWrapper>{renderContent()}</ContentWrapper>
    </ContentContainer>
  );
};
