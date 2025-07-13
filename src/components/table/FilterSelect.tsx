import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Icon } from "../shared/Icon";
import { type Option } from "../form/select";

interface IProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label?: string;
  placeholder?: string;
  className?: string;
}

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const SelectContainer = styled.div`
  position: relative;
`;

const SelectButton = styled.button<{
  $isOpen: boolean;
  $hasSelection: boolean;
}>`
  position: relative;
  width: 100%;
  height: 48px;
  padding: 0 16px 0 16px;
  padding-right: 40px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: rgba(139, 92, 246, 0.2);
    border-color: #a78bfa;
  }

  ${({ $isOpen }) =>
    $isOpen &&
    `
    ring: 2px;
    ring-color: rgba(139, 92, 246, 0.2);
    border-color: #a78bfa;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  `}

  ${({ $hasSelection }) =>
    $hasSelection &&
    `
    border-color: #c4b5fd;
    background: rgba(243, 232, 255, 0.5);
  `}
`;

const SelectContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SelectText = styled.span<{ $hasSelection: boolean }>`
  color: ${({ $hasSelection }) => ($hasSelection ? "#111827" : "#6b7280")};
`;

const ActiveBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 32px;
  width: 8px;
  height: 8px;
  background: #8b5cf6;
  border-radius: 50%;
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const ChevronWrapper = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding-right: 16px;

  svg {
    width: 16px;
    height: 16px;
    color: ${({ $isOpen }) => ($isOpen ? "#8b5cf6" : "#9ca3af")};
    transition: all 0.3s ease;
    transform: ${({ $isOpen }) =>
      $isOpen ? "rotate(180deg)" : "rotate(0deg)"};
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
`;

const DropdownPanel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  z-index: 40;
`;

const DropdownContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(17, 24, 39, 0.1);
  padding: 8px 0;
  max-height: 256px;
  overflow: auto;
`;

const OptionButton = styled.button<{
  $isSelected: boolean;
  disabled?: boolean;
}>`
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: none;
  background: transparent;
  transition: all 0.2s ease;

  ${({ disabled }) =>
    disabled
      ? `
    color: #9ca3af;
    cursor: not-allowed;
  `
      : `
    color: #374151;
    cursor: pointer;
    
    &:hover {
      background: #f9fafb;
    }
  `}

  ${({ $isSelected, disabled }) =>
    $isSelected &&
    !disabled &&
    `
    background: #f3f4f6;
    color: #7c3aed;
    font-weight: 500;
  `}
`;

const OptionIcon = styled.div<{ $isSelected: boolean; disabled?: boolean }>`
  svg {
    width: 16px;
    height: 16px;
    color: ${({ disabled, $isSelected }) =>
      disabled ? "#9ca3af" : $isSelected ? "#8b5cf6" : "#6b7280"};
  }
`;

const OptionText = styled.span`
  flex: 1;
`;

export const FilterSelect: React.FC<IProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = "Filter",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const hasSelection = value && value !== "all";

  return (
    <SelectContainer className={className}>
      {label && (
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative">
        <SelectButton
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          $isOpen={isOpen}
          $hasSelection={!!hasSelection}
        >
          <SelectContent>
            {selectedOption?.icon && (
              <Icon
                name={selectedOption.icon as any}
                className={`size-4 ${
                  hasSelection ? "text-violet-600" : "text-gray-500"
                }`}
              />
            )}
            <SelectText $hasSelection={!!hasSelection}>
              {selectedOption ? selectedOption.label : placeholder}
            </SelectText>
          </SelectContent>

          {hasSelection && <ActiveBadge />}

          <ChevronWrapper $isOpen={isOpen}>
            <Icon name="ChevronDownIcon" />
          </ChevronWrapper>
        </SelectButton>

        {isOpen && (
          <>
            <Backdrop onClick={() => setIsOpen(false)} />

            <DropdownPanel>
              <DropdownContent>
                {options.map((option) => (
                  <OptionButton
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    disabled={option.disabled}
                    $isSelected={option.value === value}
                  >
                    {option.icon && (
                      <OptionIcon
                        $isSelected={option.value === value}
                        disabled={option.disabled}
                      >
                        <Icon name={option.icon as any} />
                      </OptionIcon>
                    )}
                    <OptionText>{option.label}</OptionText>
                    {option.value === value && (
                      <Icon
                        name="CheckIcon"
                        className="size-4 text-violet-600"
                      />
                    )}
                  </OptionButton>
                ))}
              </DropdownContent>
            </DropdownPanel>
          </>
        )}
      </div>
    </SelectContainer>
  );
};
