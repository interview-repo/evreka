import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { MapContainer, TileLayer } from "react-leaflet";
import type { User } from "@/types/user";
import { MapController } from "./map-controller";
import { UserMarker } from "./user-marker";
import "leaflet/dist/leaflet.css";
import { Icon } from "../shared/Icon";
import { mapStyles } from "@/constants";

interface IProps {
  user: User;
}

const MapWrapper = styled.div<{ isFullscreen: boolean }>`
  position: relative;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: ${({ isFullscreen }) => (isFullscreen ? "0" : "16px")};
  border: 1px solid rgba(229, 231, 235, 0.6);
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(17, 24, 39, 0.05);
  transition: all 0.5s ease;

  &:hover {
    box-shadow: 0 25px 50px -12px rgba(17, 24, 39, 0.1);
  }
`;

const MapHeader = styled.div`
  position: relative;
  padding: 24px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  background: linear-gradient(
    to right,
    rgba(219, 234, 254, 0.8),
    rgba(224, 231, 255, 0.8)
  );
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(to bottom right, #3b82f6, #6366f1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.25);

  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
`;

const HeaderInfo = styled.div``;

const HeaderTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const HeaderSubtitle = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin: 0;
`;

const StyleControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyleToggleContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(229, 231, 235, 0.6);
`;

const StyleButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  ${({ active }) =>
    active
      ? `
        background: #2563eb;
        color: white;
        box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
      `
      : `
        background: transparent;
        color: #4b5563;
        
        &:hover {
          color: #1f2937;
          background: #f9fafb;
        }
      `}
`;

const MapStats = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 16px;
  font-size: 14px;
`;

const StatItem = styled.div<{ variant?: "status" }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ variant }) => (variant === "status" ? "inherit" : "#4b5563")};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StatusDot = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ active }) => (active ? "#10b981" : "#9ca3af")};
`;

const MapContainer_Styled = styled.div<{ isFullscreen: boolean }>`
  position: relative;
  height: ${({ isFullscreen }) => (isFullscreen ? "100vh" : "600px")};
`;

const MapControls = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ControlGroup = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(229, 231, 235, 0.6);
  overflow: hidden;
`;

const ControlButton = styled.button<{ hasBottomBorder?: boolean }>`
  display: block;
  width: 100%;
  padding: 12px;
  color: #374151;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: ${({ hasBottomBorder }) =>
    hasBottomBorder ? "1px solid #f3f4f6" : "none"};

  &:hover {
    background: #f9fafb;
    color: #111827;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(249, 250, 251, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingContent = styled.div`
  text-align: center;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #2563eb;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 14px;
  color: #4b5563;
  font-weight: 500;
  margin: 0;
`;

const MapBranding = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 1000;
`;

const BrandingTag = styled.div`
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 500;
`;

const MapFooter = styled.div`
  padding: 16px;
  background: linear-gradient(
    to right,
    rgba(249, 250, 251, 0.8),
    rgba(219, 234, 254, 0.8)
  );
  border-top: 1px solid rgba(229, 231, 235, 0.6);
`;

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: #4b5563;
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FooterButton = styled.button<{ variant?: "primary" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant }) =>
    variant === "primary"
      ? `
        background: #2563eb;
        color: white;
        border-color: #2563eb;
        
        &:hover {
          background: #1d4ed8;
        }
      `
      : `
        background: rgba(255, 255, 255, 0.8);
        color: #374151;
        border-color: rgba(229, 231, 235, 0.6);
        
        &:hover {
          background: white;
          border-color: #d1d5db;
        }
      `}

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const UserLocationMap: React.FC<IProps> = ({ user }) => {
  const [mapReady, setMapReady] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(13);
  const [mapStyle, setMapStyle] = useState("light");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMapReady = (map: any) => {
    mapRef.current = map;
    setMapReady(true);

    map.on("zoomend", () => {
      setCurrentZoom(map.getZoom());
    });
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setView(
        [user.location.latitude, user.location.longitude],
        13
      );
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <MapWrapper ref={containerRef} isFullscreen={isFullscreen}>
      <MapHeader>
        <HeaderTop>
          <HeaderLeft>
            <IconContainer>
              <Icon name="MapPinIcon" />
            </IconContainer>
            <HeaderInfo>
              <HeaderTitle>Location Overview</HeaderTitle>
              <HeaderSubtitle>
                Interactive map with real-time data
              </HeaderSubtitle>
            </HeaderInfo>
          </HeaderLeft>

          <StyleControls>
            <StyleToggleContainer>
              {Object.entries(mapStyles).map(([style, _]) => (
                <StyleButton
                  key={style}
                  active={mapStyle === style}
                  onClick={() => setMapStyle(style)}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </StyleButton>
              ))}
            </StyleToggleContainer>
          </StyleControls>
        </HeaderTop>

        <MapStats>
          <StatItem>
            <Icon name="EyeIcon" />
            <span>Zoom: {currentZoom}</span>
          </StatItem>
          <StatItem>
            <Icon name="GlobeAltIcon" />
            <span>
              Coordinates: {user.location.latitude.toFixed(4)},{" "}
              {user.location.longitude.toFixed(4)}
            </span>
          </StatItem>
          <StatItem
            variant="status"
            style={{ color: user.active ? "#059669" : "#6b7280" }}
          >
            <StatusDot active={user.active} />
            <span>{user.active ? "User Active" : "User Inactive"}</span>
          </StatItem>
        </MapStats>
      </MapHeader>

      <MapContainer_Styled isFullscreen={isFullscreen}>
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          className="map-container"
        >
          <TileLayer url={mapStyles[mapStyle as keyof typeof mapStyles]} />

          <MapController
            center={[user.location.latitude, user.location.longitude]}
            zoom={currentZoom}
            onMapReady={handleMapReady}
          />

          <UserMarker
            position={[user.location.latitude, user.location.longitude]}
            user={user}
          />
        </MapContainer>

        <MapControls>
          <ControlGroup>
            <ControlButton onClick={handleZoomIn} hasBottomBorder>
              <Icon name="PlusIcon" />
            </ControlButton>
            <ControlButton onClick={handleZoomOut}>
              <Icon name="MinusIcon" />
            </ControlButton>
          </ControlGroup>

          <ControlGroup>
            <ControlButton
              onClick={handleRecenter}
              hasBottomBorder
              title="Recenter on user"
            >
              <Icon name="ArrowPathIcon" />
            </ControlButton>
            <ControlButton
              onClick={handleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Icon
                name={
                  isFullscreen
                    ? "ArrowsPointingInIcon"
                    : "ArrowsPointingOutIcon"
                }
              />
            </ControlButton>
          </ControlGroup>
        </MapControls>

        {!mapReady && (
          <LoadingOverlay>
            <LoadingContent>
              <Spinner />
              <LoadingText>Loading map...</LoadingText>
            </LoadingContent>
          </LoadingOverlay>
        )}

        <MapBranding>
          <BrandingTag>Interactive Map</BrandingTag>
        </MapBranding>
      </MapContainer_Styled>

      <MapFooter>
        <FooterContent>
          <FooterLeft>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <span>Accuracy: ±10 meters</span>
          </FooterLeft>
          <FooterRight>
            <FooterButton>
              <Icon name="ShareIcon" />
              Share Location
            </FooterButton>
            <FooterButton variant="primary">
              <Icon name="ArrowTopRightOnSquareIcon" />
              Open in Maps
            </FooterButton>
          </FooterRight>
        </FooterContent>
      </MapFooter>
    </MapWrapper>
  );
};
