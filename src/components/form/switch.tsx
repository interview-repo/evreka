import React from "react";
import styled, { css } from "styled-components";

interface IProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger";
}

const sizeConfig = {
  sm: { width: 32, height: 20, thumb: 12, translate: 12 },
  md: { width: 40, height: 24, thumb: 16, translate: 16 },
  lg: { width: 48, height: 28, thumb: 20, translate: 20 },
};

const variantConfig = {
  default: { checked: "#2563eb", unchecked: "#e5e7eb" }, // blue-600 / gray-200
  success: { checked: "#16a34a", unchecked: "#e5e7eb" }, // green-600 / gray-200
  warning: { checked: "#ca8a04", unchecked: "#e5e7eb" }, // yellow-600 / gray-200
  danger: { checked: "#dc2626", unchecked: "#e5e7eb" }, // red-600 / gray-200
};

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.div`
  flex: 1;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Description = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 2px;
`;

const SwitchBtn = styled.button<{
  $checked: boolean;
  $disabled: boolean;
  $size: "sm" | "md" | "lg";
  $variant: "default" | "success" | "warning" | "danger";
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  border: none;
  outline: none;
  padding: 2px;
  border-radius: 9999px;
  cursor: pointer;
  transition:
    background 0.2s,
    opacity 0.2s;
  background: ${({ $checked, $variant }) =>
    $checked
      ? variantConfig[$variant].checked
      : variantConfig[$variant].unchecked};

  width: ${({ $size }) => sizeConfig[$size].width}px;
  height: ${({ $size }) => sizeConfig[$size].height}px;

  &:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); /* blue-500 */
  }
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      background: #e5e7eb;
    `}
`;

const Thumb = styled.div<{
  $checked: boolean;
  $size: "sm" | "md" | "lg";
}>`
  position: absolute;
  top: 50%;
  left: 2px;
  transform: ${({ $checked, $size }) =>
    $checked
      ? `translateX(${sizeConfig[$size].translate}px) translateY(-50%)`
      : `translateX(0) translateY(-50%)`};
  width: ${({ $size }) => sizeConfig[$size].thumb}px;
  height: ${({ $size }) => sizeConfig[$size].thumb}px;
  background: #fff;
  border-radius: 9999px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  transition: transform 0.2s ease-in-out;
`;

export const ToggleSwitch: React.FC<IProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  size = "md",
  variant = "default",
}) => {
  return (
    <SwitchContainer>
      <Info>
        <Label>{label}</Label>
        {description && <Description>{description}</Description>}
      </Info>
      <SwitchBtn
        type="button"
        role="switch"
        aria-checked={checked}
        $checked={checked}
        $disabled={disabled}
        $size={size}
        $variant={variant}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
      >
        <Thumb $checked={checked} $size={size} />
      </SwitchBtn>
    </SwitchContainer>
  );
};
