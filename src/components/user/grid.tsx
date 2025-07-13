import React from "react";
import styled from "styled-components";
import type { User } from "@/types/user";
import { Avatar } from "../shared/avatar";
import { RoleBadge, StatusBadge } from "../shared/badge";

interface IProps {
  user: User;
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
}

const GridCard = styled.div`
  position: relative;
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.7);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.12);
    border-color: rgba(209, 213, 219, 0.8);
    transform: translateY(-4px);
  }
`;

const HoverAccent = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(
    to bottom right,
    rgba(249, 250, 251, 0.5),
    transparent
  );
  opacity: 0;
  transition: opacity 0.4s ease;

  ${GridCard}:hover & {
    opacity: 1;
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 10;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.h3`
  font-weight: 600;
  font-size: 18px;
  color: #111827;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserEmail = styled.p`
  color: #4b5563;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
  transition-delay: 75ms;

  ${GridCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ActionButton = styled.button<{ $variant: "primary" | "secondary" }>`
  flex: 1;
  padding: 10px 20px;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid;
  cursor: pointer;

  ${({ $variant }) =>
    $variant === "primary"
      ? `
        background: #111827;
        color: white;
        border-color: #111827;
        
        &:hover {
          background: #1f2937;
        }
      `
      : `
        background: transparent;
        color: #374151;
        border-color: #d1d5db;
        
        &:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
      `}

  &:active {
    transform: scale(0.98);
  }
`;

export const UserGrid: React.FC<IProps> = ({ user, onView, onEdit }) => {
  const { name, role, email, active } = user;

  return (
    <GridCard>
      <HoverAccent />

      <CardContent>
        <HeaderSection>
          <Avatar name={name} size="lg" isActive={active} />

          <UserInfo>
            <UserName>{name}</UserName>
            <UserEmail>{email}</UserEmail>
          </UserInfo>
        </HeaderSection>

        <StatusSection>
          <RoleBadge role={role} />
          <StatusBadge isActive={active} />
        </StatusSection>

        <ActionButtons>
          {onView && (
            <ActionButton $variant="primary" onClick={() => onView(user)}>
              View
            </ActionButton>
          )}
          {onEdit && (
            <ActionButton $variant="secondary" onClick={() => onEdit(user)}>
              Edit
            </ActionButton>
          )}
        </ActionButtons>
      </CardContent>
    </GridCard>
  );
};
