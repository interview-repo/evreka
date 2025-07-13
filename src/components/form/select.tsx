import React, { useState } from "react";
import styled from "styled-components";
import { Icon, type IconName } from "../shared/Icon";

export interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: IconName;
  disabled?: boolean;
}

interface IProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  error?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
}

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SelectContainer = styled.div`
  position: relative;
`;

const SelectButton = styled.button<{
  disabled: boolean;
  $hasError: boolean;
  $isOpen: boolean;
}>`
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  border: 1px solid;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
  background: white;

  ${({ disabled }) =>
    disabled &&
    `
    background: #f9fafb;
    color: #6b7280;
    border-color: #e5e7eb;
    cursor: not-allowed;
  `}

  ${({ $hasError, disabled }) =>
    $hasError &&
    !disabled &&
    `
    border-color: #fca5a5;
    background: #fef2f2;
    
    &:hover {
      border-color: #f87171;
    }
  `}

  ${({ $isOpen, $hasError, disabled }) =>
    $isOpen &&
    !$hasError &&
    !disabled &&
    `
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  `}

  ${({ disabled, $hasError, $isOpen }) =>
    !disabled &&
    !$hasError &&
    !$isOpen &&
    `
    border-color: #d1d5db;
    
    &:hover {
      border-color: #9ca3af;
    }
  `}
`;

const SelectContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SelectText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SelectedLabel = styled.span<{ $hasValue: boolean }>`
  color: ${({ $hasValue }) => ($hasValue ? "#111827" : "#6b7280")};
`;

const ChevronIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};

  svg {
    width: 16px;
    height: 16px;
    color: #9ca3af;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
`;

const DropdownPanel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  padding: 4px 0;
`;

const OptionButton = styled.button<{
  disabled?: boolean;
  isSelected: boolean;
}>`
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  transition: all 0.15s ease;

  ${({ disabled }) =>
    disabled
      ? `
    color: #9ca3af;
    cursor: not-allowed;
  `
      : `
    color: #111827;
    cursor: pointer;
    
    &:hover {
      background: #f9fafb;
    }
  `}

  ${({ isSelected, disabled }) =>
    isSelected &&
    !disabled &&
    `
    background: #dbeafe;
    color: #1e3a8a;
  `}
`;

const OptionIcon = styled.div<{ disabled?: boolean; isSelected: boolean }>`
  svg {
    width: 16px;
    height: 16px;
    color: ${({ disabled, isSelected }) =>
      disabled ? "#9ca3af" : isSelected ? "#2563eb" : "#6b7280"};
  }
`;

const CheckIcon = styled.div`
  margin-left: auto;

  svg {
    width: 12px;
    height: 12px;
    color: #2563eb;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #dc2626;
  font-size: 14px;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

export const FormSelect: React.FC<IProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  description,
  placeholder = "Select an option",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const hasError = !!error;

  const handleSelect = (option: Option) => {
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  return (
    <FormGroup>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Select Container */}
      <SelectContainer>
        <SelectButton
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          $hasError={hasError}
          $isOpen={isOpen}
        >
          <SelectContent>
            <SelectText>
              {selectedOption?.icon && (
                <Icon
                  name={selectedOption.icon}
                  className="size-4 text-gray-500"
                />
              )}
              <SelectedLabel $hasValue={!!selectedOption}>
                {selectedOption ? selectedOption.label : placeholder}
              </SelectedLabel>
            </SelectText>
            <ChevronIcon $isOpen={isOpen}>
              <Icon name="ChevronDownIcon" />
            </ChevronIcon>
          </SelectContent>
        </SelectButton>

        {/* Dropdown */}
        {isOpen && (
          <>
            <DropdownPanel>
              {options.map((option) => (
                <OptionButton
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  disabled={option.disabled}
                  isSelected={option.value === value}
                >
                  {option.icon && (
                    <OptionIcon
                      disabled={option.disabled}
                      isSelected={option.value === value}
                    >
                      <Icon name={option.icon} />
                    </OptionIcon>
                  )}
                  <span>{option.label}</span>
                  {option.value === value && (
                    <CheckIcon>
                      <Icon name="CheckIcon" />
                    </CheckIcon>
                  )}
                </OptionButton>
              ))}
            </DropdownPanel>

            {/* Backdrop */}
            <Backdrop onClick={() => setIsOpen(false)} />
          </>
        )}
      </SelectContainer>

      {/* Error Message */}
      {error && (
        <ErrorMessage>
          <Icon name="ExclamationTriangleIcon" />
          <span>{error}</span>
        </ErrorMessage>
      )}

      {/* Description */}
      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </FormGroup>
  );
};
