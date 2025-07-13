import React, { useState } from "react";
import styled from "styled-components";
import { Icon } from "./Icon";

interface IProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchContainer = styled.div`
  position: relative;

  &:hover {
    .search-icon {
      color: #4b5563;
    }
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  padding-left: 16px;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 10;
`;

const SearchIcon = styled.div<{ isFocused: boolean; hasValue: boolean }>`
  transition: all 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
    color: ${({ isFocused, hasValue }) =>
      isFocused || hasValue ? "#8b5cf6" : "#9ca3af"};
    transform: ${({ isFocused, hasValue }) =>
      isFocused || hasValue ? "scale(1.1)" : "scale(1)"};
  }
`;

const SearchInputField = styled.input<{ isFocused: boolean }>`
  width: 100%;
  height: 48px;
  padding-left: 48px;
  padding-right: 48px;
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    ring: 2px;
    ring-color: rgba(139, 92, 246, 0.2);
    border-color: #a78bfa;
    background: white;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  ${({ isFocused }) =>
    isFocused &&
    `
    transform: scale(1.02);
  `}
`;

const ClearButtonWrapper = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  padding-right: 16px;
  display: flex;
  align-items: center;
  z-index: 10;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const ClearButton = styled.div`
  padding: 4px;
  border-radius: 50%;
  background: #f3f4f6;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }

  svg {
    width: 12px;
    height: 12px;
    color: #6b7280;
  }

  ${ClearButtonWrapper}:hover & {
    svg {
      color: #374151;
    }
  }
`;

const FocusOverlay = styled.div<{ isFocused: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: 16px;
  transition: opacity 0.3s ease;
  pointer-events: none;
  background: linear-gradient(
    to right,
    rgba(139, 92, 246, 0.05),
    rgba(99, 102, 241, 0.05)
  );
  opacity: ${({ isFocused }) => (isFocused ? 1 : 0)};
`;

export const SearchInput: React.FC<IProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <SearchContainer className={className}>
      {/* Search Icon */}
      <SearchIconWrapper>
        <SearchIcon
          isFocused={isFocused}
          hasValue={!!value}
          className="search-icon"
        >
          <Icon name="MagnifyingGlassIcon" />
        </SearchIcon>
      </SearchIconWrapper>

      {/* Input Field */}
      <SearchInputField
        type="text"
        name="search-text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        isFocused={isFocused}
      />

      {/* Clear Button */}
      {value && (
        <ClearButtonWrapper onClick={() => onChange("")}>
          <ClearButton>
            <Icon name="XMarkIcon" />
          </ClearButton>
        </ClearButtonWrapper>
      )}

      {/* Focus Overlay */}
      <FocusOverlay isFocused={isFocused} />
    </SearchContainer>
  );
};
