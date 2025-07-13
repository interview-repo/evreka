import React from "react";
import styled, { keyframes } from "styled-components";

interface IProps {
  message?: string;
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
  animation-delay: 0.1s;
  animation-fill-mode: both;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid #9333ea;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.span`
  color: #374151;
  font-weight: 500;
  font-size: 14px;
`;

export const Loading: React.FC<IProps> = ({ message = "Loading..." }) => (
  <LoadingOverlay>
    <LoadingCard>
      <LoadingContent>
        <Spinner />
        <LoadingText>{message}</LoadingText>
      </LoadingContent>
    </LoadingCard>
  </LoadingOverlay>
);