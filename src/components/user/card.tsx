import React from "react";
import styled from "styled-components";
import type { User } from "@/types/user";
import { Avatar } from "../shared/avatar";
import { RoleBadge, StatusBadge } from "../shared/badge";
import { formatDate } from "@/utils/date-format";

interface IProps {
  user: User;
  onEdit: (user: User) => void;
}

const DetailCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(229, 231, 235, 0.5);
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const UserName = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const UserEmail = styled.p`
  color: #4b5563;
  margin-bottom: 12px;
  font-size: 14px;
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #f3f4f6;
  padding-top: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailLabel = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const DetailValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
`;

const CoordinatesSection = styled.div`
  padding-top: 8px;
`;

const CoordinatesLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const CoordinatesContainer = styled.div`
  background: linear-gradient(to bottom right, #f3f4f6, #e0e7ff);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(196, 181, 253, 0.5);
`;

const CoordinateValue = styled.div`
  font-size: 12px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  color: #374151;
  line-height: 1.4;
`;

const EditButton = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 8px 16px;
  background: linear-gradient(to right, #9333ea, #6366f1);
  color: white;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(to right, #7c3aed, #4f46e5);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const UserDetailCard: React.FC<IProps> = ({ user, onEdit }) => {
  return (
    <DetailCard>
      <ProfileSection>
        <AvatarContainer>
          <Avatar name={user.name} size="lg" isActive={user.active} />
        </AvatarContainer>

        <UserName>{user.name}</UserName>
        <UserEmail>{user.email}</UserEmail>

        <BadgeContainer>
          <RoleBadge role={user.role} />
          <StatusBadge isActive={user.active} />
        </BadgeContainer>
      </ProfileSection>

      <DetailsSection>
        <DetailRow>
          <DetailLabel>User ID</DetailLabel>
          <DetailValue>{user.id}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Member Since</DetailLabel>
          <DetailValue>{formatDate(user.createdAt)}</DetailValue>
        </DetailRow>

        <CoordinatesSection>
          <CoordinatesLabel>Coordinates</CoordinatesLabel>
          <CoordinatesContainer>
            <CoordinateValue>
              Lat: {user.location.latitude.toFixed(4)}
            </CoordinateValue>
            <CoordinateValue>
              Lng: {user.location.longitude.toFixed(4)}
            </CoordinateValue>
          </CoordinatesContainer>
        </CoordinatesSection>

        <EditButton onClick={() => onEdit(user)}>Edit User</EditButton>
      </DetailsSection>
    </DetailCard>
  );
};
