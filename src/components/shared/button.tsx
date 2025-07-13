import React from "react";
import styled from "styled-components";

interface IProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  className?: string;
}

const StyledButton = styled.button<{
  variant: "primary" | "secondary" | "outline";
  size: "sm" | "md" | "lg";
  disabled: boolean;
}>`
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  /* Size variants */
  ${({ size }) => {
    switch (size) {
      case "sm":
        return `
          padding: 8px 16px;
          font-size: 14px;
        `;
      case "md":
        return `
          padding: 12px 24px;
          font-size: 14px;
        `;
      case "lg":
        return `
          padding: 16px 32px;
          font-size: 16px;
        `;
      default:
        return `
          padding: 12px 24px;
          font-size: 14px;
        `;
    }
  }}

  /* Variant styles */
  ${({ variant }) => {
    switch (variant) {
      case "primary":
        return `
          background: linear-gradient(to right, #9333ea, #6366f1);
          color: white;
          box-shadow: 0 10px 25px -5px rgba(147, 51, 234, 0.25);
          
          &:hover:not(:disabled) {
            background: linear-gradient(to right, #7c3aed, #4f46e5);
            box-shadow: 0 15px 35px -5px rgba(147, 51, 234, 0.4);
            transform: translateY(-2px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 5px 15px -3px rgba(147, 51, 234, 0.3);
          }
        `;
      case "secondary":
        return `
          background: #f3f4f6;
          color: #1f2937;
          
          &:hover:not(:disabled) {
            background: #e5e7eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            background: #d1d5db;
          }
        `;
      case "outline":
        return `
          background: transparent;
          color: #374151;
          border: 1px solid #d1d5db;
          
          &:hover:not(:disabled) {
            background: #f9fafb;
            border-color: #9ca3af;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            background: #f3f4f6;
          }
        `;
      default:
        return "";
    }
  }}

  /* Disabled state */
  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  `}

  /* Focus styles */
  &:focus-visible {
    outline: 2px solid #a78bfa;
    outline-offset: 2px;
  }

  /* Ripple effect on click */
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition:
      width 0.6s ease,
      height 0.6s ease;
  }

  &:active:not(:disabled)::before {
    width: 300px;
    height: 300px;
  }
`;

const ButtonContent = styled.span`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Button: React.FC<IProps> = ({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
  className = "",
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      <ButtonContent>{children}</ButtonContent>
    </StyledButton>
  );
};

export const ActionButton = styled.button<{ disabled?: boolean }>`
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(to right, #9333ea, #6366f1);
  color: white;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 25px -5px rgba(147, 51, 234, 0.25);
  transition: all 0.2s ease;
  transform: scale(1);

  &:hover:not(:disabled) {
    background: linear-gradient(to right, #7c3aed, #4f46e5);
    box-shadow: 0 15px 35px -5px rgba(147, 51, 234, 0.4);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(1.02);
  }

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
    transform: scale(1) !important;
    box-shadow: 0 10px 25px -5px rgba(147, 51, 234, 0.25) !important;
  `}

  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) svg {
    transform: rotate(90deg);
  }
`;
