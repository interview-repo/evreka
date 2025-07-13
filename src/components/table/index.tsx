import React from "react";
import styled from "styled-components";
import { TableVirtuoso } from "react-virtuoso";
import type { TableColumn, TableAction } from "./types";
import type { BaseEntity } from "@/types/base";

interface TableProps<T extends BaseEntity> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  isLoading?: boolean;
  error?: Error | null;
  sortBy?: keyof T | null;
  sortOrder?: "asc" | "desc";
  onSort?: (key: keyof T) => void;
  onRowClick?: (row: T) => void;
  height?: string;
}

const TableContainer = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(229, 231, 235, 0.5);
`;

const StyledTable = styled.table`
  table-layout: fixed;
  width: 100%;
`;

const TableHeaderCell = styled.th`
  padding: 16px 24px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-right: 1px solid rgba(229, 231, 235, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    border-right: none;
  }

  &:hover {
    color: #111827;
    background: rgba(255, 255, 255, 0.5);
  }
`;

const TableCell = styled.td`
  padding: 12px 24px;
  border-right: 1px solid rgba(229, 231, 235, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    border-right: none;
  }

  tr:hover & {
    background: linear-gradient(
      to right,
      rgba(243, 232, 255, 0.3),
      rgba(238, 242, 255, 0.2)
    );
  }
`;

const ActionButton = styled.button<{
  variant?: "danger" | "success" | "default";
}>`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid;

  ${({ variant }) => {
    switch (variant) {
      case "danger":
        return `
          background: #fef2f2;
          color: #b91c1c;
          border-color: #fecaca;
          &:hover {
            background: #fee2e2;
          }
        `;
      case "success":
        return `
          background: #f0fdf4;
          color: #15803d;
          border-color: #bbf7d0;
          &:hover {
            background: #dcfce7;
          }
        `;
      default:
        return `
          background: #f9fafb;
          color: #374151;
          border-color: #e5e7eb;
          &:hover {
            background: #f3f4f6;
          }
        `;
    }
  }}
`;

export function Table<T extends BaseEntity>({
  data,
  columns,
  actions = [],
  isLoading = false,
  error = null,
  sortBy = null,
  sortOrder = "asc",
  onSort,
  onRowClick,
  height = "65vh",
}: TableProps<T>) {
  // Loading
  if (isLoading) {
    return (
      <TableContainer>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading...</span>
          </div>
        </div>
      </TableContainer>
    );
  }

  // Error
  if (error) {
    return (
      <TableContainer>
        <div className="flex items-center justify-center h-64 text-red-500">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Error Loading Data</div>
            <div className="text-sm text-gray-600">{error.message}</div>
          </div>
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <TableVirtuoso
        style={{ height }}
        data={data}
        components={{
          Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
            <div {...props} ref={ref} />
          )),
          Table: (props) => <StyledTable {...props} />,
          TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
            <thead {...props} ref={ref} />
          )),
          TableRow: ({ item: _item, ...props }) => <tr {...props} />,
          TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
            <tbody {...props} ref={ref} />
          )),
        }}
        fixedHeaderContent={() => (
          <tr className="bg-gradient-to-r from-gray-50/80 to-purple-50/30">
            {columns.map((col) => (
              <TableHeaderCell
                key={String(col.key)}
                onClick={() => onSort?.(col.key)}
              >
                <div className="flex items-center gap-2">
                  {col.header}
                  {sortBy === col.key && (
                    <span className="text-purple-600 font-bold">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHeaderCell>
            ))}
            {actions.length > 0 && (
              <th className="px-6 py-4 text-right font-semibold text-gray-700">
                Actions
              </th>
            )}
          </tr>
        )}
        itemContent={(_index, row) => (
          <>
            {columns.map((col) => (
              <TableCell
                key={String(col.key)}
                onClick={() => onRowClick?.(row)}
              >
                {col.cell
                  ? col.cell(row[col.key], row)
                  : String(row[col.key] || "")}
              </TableCell>
            ))}
            {actions.length > 0 && (
              <td className="px-6 py-3">
                <div className="flex gap-2 justify-end">
                  {actions.map((action) => (
                    <ActionButton
                      key={action.key}
                      variant={action.variant}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(row);
                      }}
                    >
                      {action.label}
                    </ActionButton>
                  ))}
                </div>
              </td>
            )}
          </>
        )}
      />
    </TableContainer>
  );
}
