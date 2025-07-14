import React from "react";
import styled from "styled-components";
import { Icon } from "../shared/Icon";
import { getPagination } from "@/utils/getPagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  perPageOptions?: number[];
  onPrevious: () => void;
  onNext: () => void;
  onPerPageChange?: (perPage: number) => void;
}

const PaginationContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(229, 231, 235, 0.6);
  box-shadow: 0 -25px 50px -12px rgba(17, 24, 39, 0.05);
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(139, 92, 246, 0.05),
    rgba(168, 85, 247, 0.05),
    rgba(99, 102, 241, 0.05)
  );
  filter: blur(24px);
`;

const PaginationButton = styled.button<{
  $variant?: "primary" | "secondary" | "ghost";
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid;
  transition: all 0.2s ease;
  transform: scale(1);

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return `
          color: white;
          background: linear-gradient(to right, #9333ea, #6366f1);
          border-color: transparent;
          box-shadow: 0 10px 25px -5px rgba(147, 51, 234, 0.25);
          
          &:hover:not(:disabled) {
            background: linear-gradient(to right, #7c3aed, #4f46e5);
          }
        `;
      case "secondary":
        return `
          color: #4b5563;
          background: white;
          border-color: #e5e7eb;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          
          &:hover:not(:disabled) {
            color: #111827;
            background: #f9fafb;
            border-color: #d1d5db;
          }
        `;
      default:
        return `
          color: #4b5563;
          background: white;
          border-color: #e5e7eb;
          
          &:hover:not(:disabled) {
            color: #111827;
            background: #f9fafb;
            border-color: #d1d5db;
          }
        `;
    }
  }}
`;

const SmallButton = styled(PaginationButton)`
  padding: 8px 12px;
  font-size: 12px;
`;

const PageNumberButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  transform: scale(1);

  &:hover {
    transform: scale(1.05);
  }

  ${({ $isActive }) =>
    $isActive
      ? `
        color: white;
        background: linear-gradient(to right, #9333ea, #6366f1);
        border: none;
        box-shadow: 0 10px 25px -5px rgba(147, 51, 234, 0.25);
      `
      : `
        color: #374151;
        background: white;
        border: 1px solid #e5e7eb;
        
        &:hover {
          color: #111827;
          background: #f9fafb;
          border-color: #d1d5db;
        }
      `}
`;

const InfoBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
  background: #f9fafb;
  padding: 6px 12px;
  border-radius: 9999px;
`;

const PerPageSelect = styled.select`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  background: #f9fafb;
  border: none;
  border-radius: 9999px;
  padding: 6px 12px;
  padding-right: 28px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    color: #374151;
    background: #e5e7eb;
  }

  &:focus {
    outline: none;
    color: #374151;
    background: #e5e7eb;
  }

  option {
    background: white;
    color: #374151;
  }
`;

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  perPageOptions = [10, 20, 50, 100],
  onPrevious,
  onNext,
  onPerPageChange,
}) => {
  const pagination = getPagination({
    page: currentPage,
    perPage: itemsPerPage,
    total: totalItems,
    maxVisible: 7,
  });

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number.parseInt(e.target.value);
    onPerPageChange?.(newPerPage);
  };

  return (
    <PaginationContainer>
      <GradientOverlay />

      <div className="relative max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-700 font-medium">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {pagination.start}
              </span>{" "}
              -{" "}
              <span className="font-bold text-gray-900">{pagination.end}</span>{" "}
              of{" "}
              <span className="font-bold text-purple-600">
                {totalItems.toLocaleString()}
              </span>{" "}
              items
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <InfoBadge>
                <Icon name="DocumentTextIcon" className="size-3" />
                Page {currentPage} of {totalPages}
              </InfoBadge>

              {onPerPageChange && (
                <InfoBadge>
                  <Icon name="RectangleStackIcon" className="size-3" />
                  <PerPageSelect
                    value={itemsPerPage}
                    onChange={handlePerPageChange}
                  >
                    {perPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </PerPageSelect>
                  per page
                </InfoBadge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SmallButton
              onClick={() => pagination.goTo(1, onPrevious, onNext)}
              disabled={!pagination.canFirst}
              $variant="ghost"
              className="hidden sm:flex"
              title="First page"
            >
              <Icon name="ChevronDoubleLeftIcon" className="size-3" />
              First
            </SmallButton>

            <PaginationButton
              onClick={onPrevious}
              disabled={!pagination.canPrev}
              $variant="secondary"
            >
              <Icon name="ChevronLeftIcon" className="size-4" />
              <span className="hidden sm:inline">Previous</span>
            </PaginationButton>

            <div className="hidden md:flex items-center gap-1 mx-2">
              {pagination.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <span className="flex items-center justify-center w-10 h-10 text-gray-400 text-sm">
                      <Icon name="EllipsisHorizontalIcon" className="size-4" />
                    </span>
                  ) : (
                    <PageNumberButton
                      onClick={() =>
                        pagination.goTo(page as number, onPrevious, onNext)
                      }
                      $isActive={page === currentPage}
                    >
                      {page}
                    </PageNumberButton>
                  )}
                </React.Fragment>
              ))}
            </div>

            <PaginationButton
              onClick={onNext}
              disabled={!pagination.canNext}
              $variant="primary"
            >
              <span className="hidden sm:inline">Next</span>
              <Icon name="ChevronRightIcon" className="size-4" />
            </PaginationButton>

            <SmallButton
              onClick={() => pagination.goTo(totalPages, onPrevious, onNext)}
              disabled={!pagination.canLast}
              $variant="ghost"
              className="hidden sm:flex"
              title="Last page"
            >
              Last
              <Icon name="ChevronDoubleRightIcon" className="size-3" />
            </SmallButton>
          </div>
        </div>

        {/* Mobile page info */}
        <div className="md:hidden mt-3 flex items-center justify-center gap-3">
          <InfoBadge>
            <Icon name="DocumentTextIcon" className="size-3" />
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <span>•</span>
            <span>{totalItems.toLocaleString()} total</span>
          </InfoBadge>

          {onPerPageChange && (
            <InfoBadge>
              <Icon name="RectangleStackIcon" className="size-3" />
              <PerPageSelect
                value={itemsPerPage}
                onChange={handlePerPageChange}
              >
                {perPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </PerPageSelect>
              per page
            </InfoBadge>
          )}
        </div>
      </div>
    </PaginationContainer>
  );
};
