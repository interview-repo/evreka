import React from "react";
import styled from "styled-components";
import type { Option } from "../form/select";
import { FilterSelect } from "../table/FilterSelect";
import { PaginationMode } from "../table/PaginationMode";
import { SearchInput } from "./search-input";
import { ViewModeToggle } from "../table/ViewModeToggle";
import { viewModesOptions, type ViewModeOption } from "@/constants/viewmode-option";
import { Icon } from "./Icon";

interface IProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Array<{
    value: string;
    onChange: (value: string) => void;
    options: Option[];
  }>;
  viewMode?: string;
  onViewModeChange?: (mode: ViewModeOption["mode"]) => void;
  isPaginated?: boolean;
  onPaginationToggle?: (isPaginated: boolean) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  showViewControls?: boolean;
  showPaginationToggle?: boolean;
  className?: string;
}

const PanelContainer = styled.div`
  position: sticky;
  top: 128px;
  z-index: 30;
`;

const GlassMorphBackground = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  box-shadow: 0 10px 15px -3px rgba(17, 24, 39, 0.05);
`;

const PanelContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 32px;
`;

const MainControlRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const FilterWrapper = styled.div`
  min-width: 140px;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }
`;

const SecondaryRow = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(229, 231, 235, 0.5);
`;

const SecondaryContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const ActiveFiltersSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActiveFiltersLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
`;

const FilterBadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #c4b5fd;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #7c3aed;
  transition: all 0.2s ease;

  &:hover {
    background: #ede9fe;
  }
`;

const RemoveBadgeButton = styled.button`
  padding: 2px;
  border-radius: 50%;
  border: none;
  background: transparent;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #c4b5fd;
  }

  svg {
    width: 12px;
    height: 12px;
    color: #8b5cf6;
  }
`;

const ClearAllButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #1f2937;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const AmbientGlow = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(139, 92, 246, 0.05),
    rgba(168, 85, 247, 0.05),
    rgba(99, 102, 241, 0.05)
  );
  filter: blur(24px);
  z-index: -1;
`;

export const ControlPanel: React.FC<IProps> = ({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  viewMode,
  onViewModeChange,
  isPaginated,
  onPaginationToggle,
  hasActiveFilters = false,
  onClearFilters,
  showViewControls = true,
  showPaginationToggle = true,
  className = "",
}) => {
  const activeFilterCount = filters.filter(
    (f) => f.value && f.value !== "all"
  ).length;

  return (
    <PanelContainer className={className}>
      <GlassMorphBackground>
        <PanelContent>
          {/* Main Control Row */}
          <MainControlRow>
            {/* Left Section: Search & Filters */}
            <LeftSection>
              {/* Search Input */}
              <SearchContainer>
                <SearchInput
                  value={search}
                  onChange={onSearchChange}
                  placeholder={searchPlaceholder}
                  className="w-full"
                />
              </SearchContainer>

              {/* Filters Section */}
              {filters.length > 0 && (
                <FiltersContainer>
                  {filters.map((filter, index) => (
                    <FilterWrapper key={index}>
                      <FilterSelect
                        value={filter.value}
                        onChange={filter.onChange}
                        options={filter.options}
                      />
                    </FilterWrapper>
                  ))}
                </FiltersContainer>
              )}
            </LeftSection>

            {/* Right Section: Controls */}
            <RightSection>
              {/* View Mode Toggle */}
              {showViewControls &&
                viewMode &&
                viewModesOptions.length > 0 &&
                onViewModeChange && (
                  <ViewModeToggle
                    currentMode={viewMode}
                    onChange={onViewModeChange}
                  />
                )}

              {/* Pagination Toggle */}
              {showPaginationToggle &&
                typeof isPaginated === "boolean" &&
                onPaginationToggle && (
                  <PaginationMode
                    isPaginated={isPaginated}
                    onChange={onPaginationToggle}
                  />
                )}
            </RightSection>
          </MainControlRow>

          {(hasActiveFilters || activeFilterCount > 0) && (
            <SecondaryRow>
              <SecondaryContent>
                <ActiveFiltersSection>
                  <ActiveFiltersLabel>Active Filters:</ActiveFiltersLabel>

                  <FilterBadgesContainer>
                    {filters
                      .filter((f) => f.value && f.value !== "all")
                      .map((filter, index) => {
                        const selectedOption = filter.options.find(
                          (o) => o.value === filter.value
                        );
                        return (
                          <FilterBadge key={index}>
                            {selectedOption?.icon && (
                              <Icon
                                name={selectedOption.icon}
                                className="size-3 text-violet-600"
                              />
                            )}
                            <span>{selectedOption?.label}</span>
                            <RemoveBadgeButton
                              onClick={() => filter.onChange("all")}
                            >
                              <Icon name="XMarkIcon" />
                            </RemoveBadgeButton>
                          </FilterBadge>
                        );
                      })}
                  </FilterBadgesContainer>
                </ActiveFiltersSection>

                <ClearAllButton onClick={onClearFilters || (() => {})}>
                  <Icon name="XMarkIcon" />
                  Clear All
                </ClearAllButton>
              </SecondaryContent>
            </SecondaryRow>
          )}
        </PanelContent>
      </GlassMorphBackground>

      <AmbientGlow />
    </PanelContainer>
  );
};
