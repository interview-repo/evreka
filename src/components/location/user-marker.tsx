import React from "react";
import styled from "styled-components";
import { Marker, Popup } from "react-leaflet";
import type { User } from "@/types/user";
import "./map.css";

const PopupCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: none;
  overflow: hidden;
`;

const PopupHeader = styled.div`
  background: linear-gradient(to right, #3b82f6, #6366f1);
  padding: 16px;
  color: white;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h4`
  font-weight: 600;
  font-size: 14px;
  margin: 0;
`;

const UserEmail = styled.p`
  color: #bfdbfe;
  font-size: 12px;
  opacity: 0.9;
  margin: 0;
`;

const StatusDot = styled.div<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#4ade80" : "#d1d5db")};
`;

const PopupBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CoordinatesContainer = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
`;

const CoordinatesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 12px;
`;

const CoordinateItem = styled.div``;

const CoordinateLabel = styled.span`
  color: #6b7280;
  font-weight: 500;
  display: block;
`;

const CoordinateValue = styled.p`
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  color: #111827;
  margin-top: 2px;
  margin-bottom: 0;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatusLabel = styled.span`
  color: #4b5563;
  font-size: 14px;
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;

  ${({ $active }) =>
    $active
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

const StatusBadgeDot = styled.div<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#10b981" : "#9ca3af")};
`;

const DirectionsButton = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 10px 0;
  background: linear-gradient(to right, #2563eb, #6366f1);
  color: white;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(to right, #1d4ed8, #4f46e5);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const UserMarker: React.FC<{
  position: [number, number];
  user: User;
}> = ({ position, user }) => {
  return (
    <Marker position={position}>
      <Popup>
        <PopupCard>
          <PopupHeader>
            <HeaderContent>
              <Avatar>{user.name[0]?.toUpperCase()}</Avatar>
              <UserInfo>
                <UserName>{user.name}</UserName>
                <UserEmail>{user.email}</UserEmail>
              </UserInfo>
              <StatusDot $active={user.active} />
            </HeaderContent>
          </PopupHeader>

          <PopupBody>
            <CoordinatesContainer>
              <CoordinatesGrid>
                <CoordinateItem>
                  <CoordinateLabel>Latitude</CoordinateLabel>
                  <CoordinateValue>
                    {user.location.latitude.toFixed(6)}
                  </CoordinateValue>
                </CoordinateItem>
                <CoordinateItem>
                  <CoordinateLabel>Longitude</CoordinateLabel>
                  <CoordinateValue>
                    {user.location.longitude.toFixed(6)}
                  </CoordinateValue>
                </CoordinateItem>
              </CoordinatesGrid>
            </CoordinatesContainer>

            <StatusRow>
              <StatusLabel>Status</StatusLabel>
              <StatusBadge $active={user.active}>
                <StatusBadgeDot $active={user.active} />
                {user.active ? "Active" : "Inactive"}
              </StatusBadge>
            </StatusRow>

            <DirectionsButton>Get Directions</DirectionsButton>
          </PopupBody>
        </PopupCard>
      </Popup>
    </Marker>
  );
};
