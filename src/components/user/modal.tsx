import React, { useEffect } from "react";
import styled, { keyframes, css } from "styled-components"; // Add css import
import { roleOptions } from "@/constants";
import type { User } from "@/types/user";
import { Icon } from "../shared/Icon";
import { PasswordStrength } from "../shared/password-strength";
import { FormSelect } from "../form/select";
import { Button } from "../shared/button";
import { useUserForm } from "@/hooks/users/useUserForm";
import { FormInput } from "../form/input";
import { ToggleSwitch } from "../form/switch";
import type { CreateData } from "@/hooks/shared/useApi";

interface UserModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  user?: User | null;
  onClose: () => void;
  onSubmit: (data: CreateData<User>) => Promise<void>;
  isLoading?: boolean;
}

// Keyframes
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  ${css`
    animation: ${fadeIn} 0.2s ease-out;
  `}// Wrap in css helper
`;

const Backdrop = styled.div<{ disabled?: boolean }>`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 512px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  ${css`
    animation: ${slideUp} 0.3s ease-out;
  `}// Wrap in css helper
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #f3e8ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    color: #9333ea;
  }
`;

const HeaderInfo = styled.div``;

const HeaderTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const HeaderSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const CloseButton = styled.button<{ disabled?: boolean }>`
  width: 32px;
  height: 32px;
  color: #9ca3af;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    color: #4b5563;
    background: #f3f4f6;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
`;

const ErrorContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
    color: #dc2626;
  }

  p {
    font-size: 14px;
    color: #b91c1c;
    margin: 0;
  }
`;

const PasswordContainer = styled.div``;

const PasswordStrengthWrapper = styled.div`
  margin-top: 12px;
`;

const StatusContainer = styled.div`
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const LoadingContent = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  ${css`
    animation: ${spin} 1s linear infinite;
  `}// Wrap in css helper
`;

// Main UserModal Component
export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  mode,
  user,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { formData, errors, isValid, updateField, blurField, handleSubmit } =
    useUserForm({
      mode,
      user,
      onSubmit: async (data) => {
        await onSubmit(data);
        onClose();
      },
    });

  const isEdit = mode === "edit";

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <Backdrop
        disabled={isLoading}
        onClick={!isLoading ? onClose : undefined}
      />

      <ModalContainer>
        {/* Header */}
        <ModalHeader>
          <HeaderLeft>
            <HeaderIcon>
              <Icon name={isEdit ? "PencilSquareIcon" : "UserPlusIcon"} />
            </HeaderIcon>
            <HeaderInfo>
              <HeaderTitle>{isEdit ? "Edit User" : "Add User"}</HeaderTitle>
              <HeaderSubtitle>
                {isEdit
                  ? "Update user information"
                  : "Create a new user account"}
              </HeaderSubtitle>
            </HeaderInfo>
          </HeaderLeft>

          <CloseButton onClick={onClose} disabled={isLoading}>
            <Icon name="XMarkIcon" />
          </CloseButton>
        </ModalHeader>

        {/* Content */}
        <ModalContent>
          {/* Error Message */}
          {errors.submit && (
            <ErrorMessage>
              <ErrorContent>
                <Icon name="ExclamationTriangleIcon" />
                <p>{errors.submit}</p>
              </ErrorContent>
            </ErrorMessage>
          )}

          {/* Name */}
          <FormInput
            label="Full Name"
            value={formData.name}
            onChange={(value) => updateField("name", value)}
            onBlur={() => blurField("name")}
            placeholder="Enter full name"
            required
            error={errors.name}
            icon="UserIcon"
          />

          {/* Email */}
          <FormInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => updateField("email", value)}
            onBlur={() => blurField("email")}
            placeholder="Enter email address"
            required
            error={errors.email}
            icon="EnvelopeIcon"
          />

          {/* Password */}
          <PasswordContainer>
            <FormInput
              label={isEdit ? "New Password (Optional)" : "Password"}
              type="password"
              value={formData.password}
              onChange={(value) => updateField("password", value)}
              onBlur={() => blurField("password")}
              placeholder={
                isEdit
                  ? "Leave empty to keep current password"
                  : "Create a secure password"
              }
              required={false}
              error={errors.password}
              icon="LockClosedIcon"
            />
            {formData.password && (
              <PasswordStrengthWrapper>
                <PasswordStrength password={formData.password} />
              </PasswordStrengthWrapper>
            )}
          </PasswordContainer>

          {/* Role */}
          <FormSelect
            label="Role"
            value={formData.role}
            onChange={(value) => updateField("role", value)}
            options={roleOptions}
            required
          />

          {/* Active Status */}
          <StatusContainer>
            <ToggleSwitch
              label="Active"
              description="User can sign in and access the system"
              checked={formData.active}
              onChange={(checked) => updateField("active", checked)}
              variant="success"
              size="sm"
            />
          </StatusContainer>
        </ModalContent>

        {/* Footer */}
        <ModalFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading || !isValid}
          >
            {isLoading ? (
              <LoadingContent>
                <LoadingSpinner />
                {isEdit ? "Saving..." : "Creating..."}
              </LoadingContent>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create User"
            )}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};
