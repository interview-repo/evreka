import calculatePasswordStrength from "@/utils/passwordStrength";
import { useMemo } from "react";
import styled, { keyframes } from "styled-components";

const strengthFill = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

const StrengthContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StrengthBars = styled.div`
  display: flex;
  gap: 4px;
`;

const StrengthBar = styled.div<{ active: boolean; level: string }>`
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background: ${({ active, level }) => {
    if (!active) return "#e5e7eb";

    switch (level) {
      case "weak":
        return "#ef4444";
      case "medium":
        return "#eab308";
      case "strong":
        return "#22c55e";
      case "very-strong":
        return "#10b981";
      default:
        return "#e5e7eb";
    }
  }};
  transition: all 0.2s ease;

  ${({ active }) =>
    active &&
    `
    animation: ${strengthFill} 0.3s ease-out;
  `}
`;

const StrengthInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`;

const StrengthLabel = styled.span`
  color: #4b5563;
  font-weight: 500;
`;

const ChecksContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const CheckItem = styled.span<{ passed: boolean }>`
  color: ${({ passed }) => (passed ? "#059669" : "#9ca3af")};
  transition: color 0.2s ease;
`;

// Password Strength Configuration
const strengthConfig = {
  weak: { label: "Weak" },
  medium: { label: "Medium" },
  strong: { label: "Strong" },
  "very-strong": { label: "Very Strong" },
};

const checkLabels = {
  length: "8+",
  lowercase: "a-z",
  uppercase: "A-Z",
  numbers: "0-9",
  special: "!@#",
};

export const PasswordStrength: React.FC<{
  password?: string;
}> = ({ password }) => {
  const strength = useMemo(
    () => (password ? calculatePasswordStrength(password) : null),
    [password]
  );

  if (!password || !strength) return null;

  return (
    <StrengthContainer>
      <StrengthBars>
        {Array.from({ length: 5 }, (_, i) => (
          <StrengthBar
            key={i}
            active={i < strength.strength}
            level={strength.level}
          />
        ))}
      </StrengthBars>
      <StrengthInfo>
        <StrengthLabel>{strengthConfig[strength.level].label}</StrengthLabel>
        <ChecksContainer>
          {Object.entries(strength.checks).map(([key, passed]) => (
            <CheckItem key={key} passed={passed}>
              {checkLabels[key as keyof typeof checkLabels]}
            </CheckItem>
          ))}
        </ChecksContainer>
      </StrengthInfo>
    </StrengthContainer>
  );
};
