import type { UserRole } from "@/types/user";
import React from "react";
import styled from "styled-components";

interface RoleBadgeProps {
  role: UserRole;
  size?: "sm" | "md";
}

interface StatusBadgeProps {
  isActive: boolean;
  size?: "sm" | "md";
}

const BadgeBase = styled.div<{ $size: "sm" | "md" }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  font-weight: 500;
  border: 1px solid;
  transition: all 0.2s ease;

  ${({ $size }) =>
    $size === "sm"
      ? `
        padding: 4px 8px;
        font-size: 12px;
      `
      : `
        padding: 6px 12px;
        font-size: 14px;
      `}

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const RoleBadgeStyled = styled(BadgeBase)<{
  $role: "admin" | "manager" | "user";
}>`
  ${({ $role }) => {
    switch ($role) {
      case "admin":
        return `
          background: #fef2f2;
          color: #b91c1c;
          border-color: #fecaca;
        `;
      case "manager":
        return `
          background: #eff6ff;
          color: #1d4ed8;
          border-color: #bfdbfe;
        `;
      case "user":
        return `
          background: #ecfdf5;
          color: #059669;
          border-color: #a7f3d0;
        `;
      default:
        return `
          background: #f9fafb;
          color: #374151;
          border-color: #e5e7eb;
        `;
    }
  }}
`;

const StatusBadgeStyled = styled(BadgeBase)<{ $isActive: boolean }>`
  ${({ $isActive }) =>
    $isActive
      ? `
        background: #ecfdf5;
        color: #059669;
        border-color: #a7f3d0;
      `
      : `
        background: #f9fafb;
        color: #4b5563;
        border-color: #e5e7eb;
      `}
`;

const DotIndicator = styled.div<{
  $variant: "admin" | "manager" | "user" | "active" | "inactive";
}>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;

  ${({ $variant }) => {
    switch ($variant) {
      case "admin":
        return `background: #ef4444;`;
      case "manager":
        return `background: #3b82f6;`;
      case "user":
        return `background: #10b981;`;
      case "active":
        return `background: #10b981;`;
      case "inactive":
        return `background: #9ca3af;`;
      default:
        return `background: #9ca3af;`;
    }
  }}
`;

const BadgeText = styled.span`
  text-transform: capitalize;
  letter-spacing: 0.025em;
`;

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = "md" }) => {
  return (
    <RoleBadgeStyled $role={role} $size={size}>
      <DotIndicator $variant={role} />
      <BadgeText>{role}</BadgeText>
    </RoleBadgeStyled>
  );
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  isActive,
  size = "md",
}) => {
  return (
    <StatusBadgeStyled $isActive={isActive} $size={size}>
      <DotIndicator $variant={isActive ? "active" : "inactive"} />
      <BadgeText>{isActive ? "Active" : "Inactive"}</BadgeText>
    </StatusBadgeStyled>
  );
};
