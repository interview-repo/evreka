import React from "react";
import styled from "styled-components";

interface IProps {
  name: string;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  showStatus?: boolean;
}

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const AvatarCircle = styled.div<{ size: "sm" | "md" | "lg" }>`
  background: linear-gradient(to bottom right, #8b5cf6, #a855f7, #6366f1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.25);
  transition: all 0.3s ease;

  ${({ size }) => {
    switch (size) {
      case "sm":
        return `
          width: 32px;
          height: 32px;
          font-size: 12px;
        `;
      case "md":
        return `
          width: 36px;
          height: 36px;
          font-size: 14px;
        `;
      case "lg":
        return `
          width: 48px;
          height: 48px;
          font-size: 16px;
        `;
      default:
        return `
          width: 36px;
          height: 36px;
          font-size: 14px;
        `;
    }
  }}

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 35px -5px rgba(168, 85, 247, 0.4);
  }
`;

const StatusIndicator = styled.div<{
  size: "sm" | "md" | "lg";
  isActive: boolean;
}>`
  position: absolute;
  bottom: -2px;
  right: -2px;
  border: 2px solid white;
  border-radius: 50%;
  background: ${({ isActive }) => (isActive ? "#34d399" : "#f87171")};
  transition: all 0.3s ease;

  ${({ size }) => {
    switch (size) {
      case "sm":
        return `
          width: 8px;
          height: 8px;
        `;
      case "md":
        return `
          width: 12px;
          height: 12px;
        `;
      case "lg":
        return `
          width: 16px;
          height: 16px;
        `;
      default:
        return `
          width: 12px;
          height: 12px;
        `;
    }
  }}

  &:hover {
    transform: scale(1.1);
  }
`;

const AvatarInitial = styled.span`
  user-select: none;
  letter-spacing: 0.5px;
`;

export const Avatar: React.FC<IProps> = ({
  name,
  size = "md",
  isActive = true,
  showStatus = true,
}) => {
  return (
    <AvatarContainer>
      <AvatarCircle size={size}>
        <AvatarInitial>{name[0]?.toUpperCase()}</AvatarInitial>
      </AvatarCircle>

      {showStatus && <StatusIndicator size={size} isActive={isActive} />}
    </AvatarContainer>
  );
};
