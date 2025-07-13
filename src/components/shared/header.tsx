import React from "react";
import styled from "styled-components";

interface IProps {
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const HeaderTitle = styled.h1`
  font-size: 30px;
  font-weight: 700;
  background: linear-gradient(to right, #111827, #374151);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const HeaderDescription = styled.p`
  color: #4b5563;
  margin-top: 4px;
  margin-bottom: 0;
  font-size: 16px;
`;

const ActionContainer = styled.div`
  margin-left: 16px;
`;

export const Header: React.FC<IProps> = ({
  title,
  description,
  actionButton,
}) => (
  <HeaderContainer>
    <HeaderContent>
      <HeaderRow>
        <HeaderLeft>
          <HeaderTitle>{title}</HeaderTitle>
          <HeaderDescription>{description}</HeaderDescription>
        </HeaderLeft>

        {actionButton && <ActionContainer>{actionButton}</ActionContainer>}
      </HeaderRow>
    </HeaderContent>
  </HeaderContainer>
);
