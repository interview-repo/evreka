import React from "react";
import styled from "styled-components";
import { Icon } from "../shared/Icon";
import { paginationOptions } from "@/constants";

interface IProps {
  isPaginated: boolean;
  onChange: (isPaginated: boolean) => void;
  className?: string;
}

const ModeContainer = styled.div`
  position: relative;
`;

const ModeToggle = styled.div`
  position: relative;
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 6px;
  border: 1px solid rgba(229, 231, 235, 0.6);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const ActiveIndicator = styled.div<{ $isPaginated: boolean }>`
  position: absolute;
  top: 6px;
  bottom: 6px;
  width: calc(50% - 4px);
  background: linear-gradient(to right, #8b5cf6, #6366f1);
  border-radius: 12px;
  box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.39);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  left: ${({ $isPaginated }) => $isPaginated ? '8px' : 'calc(50% + 2px)'};
`;

const ModeButton = styled.button<{ $isActive: boolean }>`
  position: relative;
  z-index: 10;
  flex: 1;
  cursor: pointer;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 12px;
  border: none;
  background: transparent;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
`;

const IconWrapper = styled.div<{ $isActive: boolean }>`
  transition: all 0.3s ease;
  color: ${({ $isActive }) => $isActive ? 'white' : '#4b5563'};
  transform: ${({ $isActive }) => $isActive ? 'scale(1.1)' : 'scale(1)'};

  ${ModeButton}:hover & {
    color: ${({ $isActive }) => $isActive ? 'white' : '#1f2937'};
    transform: ${({ $isActive }) => $isActive ? 'scale(1.1)' : 'scale(1.05)'};
  }
`;

const ButtonLabel = styled.span<{ $isActive: boolean }>`
  transition: color 0.3s ease;
  color: ${({ $isActive }) => $isActive ? 'white' : '#4b5563'};

  ${ModeButton}:hover & {
    color: ${({ $isActive }) => $isActive ? 'white' : '#1f2937'};
  }
`;

const HoverOverlay = styled.div<{ $isActive: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: linear-gradient(to right, rgba(107, 114, 128, 0.05), rgba(75, 85, 99, 0.05));
  opacity: ${({ $isActive }) => $isActive ? '0' : '0'};
  transition: opacity 0.3s ease;

  ${ModeButton}:hover & {
    opacity: ${({ $isActive }) => $isActive ? '0' : '1'};
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const GlowEffect = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1));
  filter: blur(12px);
  z-index: -1;
  opacity: 0.5;
`;

export const PaginationMode: React.FC<IProps> = ({
  isPaginated,
  onChange,
  className = "",
}) => {
  return (
    <ModeContainer className={className}>
      <ModeToggle>
        <ActiveIndicator $isPaginated={isPaginated} />

        {paginationOptions.map(({ value, icon, label, title }) => {
          const isActive = isPaginated === value;

          return (
            <ModeButton
              key={String(value)}
              onClick={() => onChange(value)}
              title={title}
              $isActive={isActive}
            >
              <ButtonContent>
                <IconWrapper $isActive={isActive}>
                  <Icon name={icon} className="size-4" />
                </IconWrapper>
                <ButtonLabel $isActive={isActive}>
                  {label}
                </ButtonLabel>
              </ButtonContent>

              <HoverOverlay $isActive={isActive} />
            </ModeButton>
          );
        })}
      </ModeToggle>

      <GlowEffect />
    </ModeContainer>
  );
};