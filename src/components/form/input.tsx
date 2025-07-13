import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Icon, type IconName } from "../shared/Icon";

interface IProps {
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  description?: string;
  icon?: IconName;
  disabled?: boolean;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151; /* text-gray-700 */
  margin-bottom: 2px;
`;

const Required = styled.span`
  color: #ef4444; /* text-red-500 */
  margin-left: 0.25rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const IconLeft = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
`;

const InputBase = styled.input<{
  hasIcon?: boolean;
  isPassword?: boolean;
  hasError?: boolean;
  isFocused?: boolean;
  disabled?: boolean;
}>`
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.5rem;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  background: #fff;
  color: #374151;

  ${(props) =>
    props.hasIcon &&
    css`
      padding-left: 2.5rem;
    `}
  ${(props) =>
    props.isPassword &&
    css`
      padding-right: 2.5rem;
    `}
  ${(props) =>
    props.disabled &&
    css`
      background: #f9fafb; /* bg-gray-50 */
      color: #6b7280; /* text-gray-500 */
      border-color: #e5e7eb; /* border-gray-200 */
      cursor: not-allowed;
    `}
  ${(props) =>
    props.hasError &&
    css`
      border-color: #fca5a5; /* border-red-300 */
      background: #fef2f2; /* bg-red-50 */
      &:focus {
        border-color: #ef4444; /* border-red-500 */
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
      }
    `}
  ${(props) =>
    !props.hasError &&
    props.isFocused &&
    css`
      border-color: #3b82f6; /* border-blue-500 */
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    `}
  ${(props) =>
    !props.hasError &&
    !props.isFocused &&
    !props.disabled &&
    css`
      &:hover {
        border-color: #9ca3af; /* border-gray-400 */
      }
    `}
`;

const PasswordToggle = styled.button<{ disabled?: boolean }>`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  color: #9ca3af; /* text-gray-400 */
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    color: #4b5563; /* text-gray-600 */
  }

  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
      color: #d1d5db;
    `}
`;

const ErrorMsg = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #dc2626; /* text-red-600 */
  font-size: 0.875rem;
`;

const Description = styled.p`
  font-size: 0.75rem;
  color: #6b7280; /* text-gray-500 */
`;

export const FormInput: React.FC<IProps> = ({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  description,
  icon,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!error;
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <Wrapper>
      <Label>
        {label}
        {required && <Required>*</Required>}
      </Label>
      <InputContainer>
        {icon && (
          <IconLeft>
            <Icon name={icon} className="size-4" style={{ color: "#9ca3af" }} />
          </IconLeft>
        )}
        <InputBase
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          hasIcon={!!icon}
          isPassword={isPassword}
          hasError={hasError}
          isFocused={isFocused}
        />
        {isPassword && (
          <PasswordToggle
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={disabled}
          >
            <Icon
              name={showPassword ? "EyeSlashIcon" : "EyeIcon"}
              className="size-4"
            />
          </PasswordToggle>
        )}
      </InputContainer>
      {error && (
        <ErrorMsg>
          <Icon
            name="ExclamationTriangleIcon"
            className="size-3.5 flex-shrink-0"
            style={{ color: "#dc2626" }}
          />
          <span>{error}</span>
        </ErrorMsg>
      )}
      {description && !error && <Description>{description}</Description>}
    </Wrapper>
  );
};
