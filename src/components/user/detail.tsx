import styled, { keyframes, css } from "styled-components";
import type { User } from "@/types/user";
import { Icon } from "../shared/Icon";
import { UserDetailCard } from "./card";
import { UserLocationMap } from "../location/user-location";

interface IProps {
  user?: User;
  isLoading: boolean;
  error?: Error | null;
  onBack: () => void;
  onEdit: (user: User) => void;
}

// Keyframes
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100%;
  background: linear-gradient(
    to bottom right,
    #f8fafc,
    rgba(219, 234, 254, 0.3),
    rgba(224, 231, 255, 0.5)
  );
`;

const MainContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 1280px) {
    grid-template-columns: repeat(12, 1fr);
  }
`;

const ProfileSection = styled.div`
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;

  @media (min-width: 1280px) {
    grid-column: span 4;
  }
`;

const MapSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.2s;

  @media (min-width: 1280px) {
    grid-column: span 8;
  }
`;

// Loading Components
const LoaderContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    to bottom right,
    #f8fafc,
    rgba(219, 234, 254, 0.3),
    rgba(224, 231, 255, 0.5)
  );
`;

const SkeletonHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
`;

const SkeletonElement = styled.div<{ width?: string; height?: string }>`
  background: #e5e7eb;
  border-radius: 8px;
  ${css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "20px"};
`;

const SkeletonAvatar = styled(SkeletonElement)`
  width: 96px;
  height: 96px;
  border-radius: 50%;
`;

// Error Components
const ErrorContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    to bottom right,
    #f8fafc,
    rgba(219, 234, 254, 0.3),
    rgba(224, 231, 255, 0.5)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ErrorCard = styled.div`
  max-width: 448px;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(229, 231, 235, 0.6);
  padding: 32px;
  text-align: center;
  ${css`
    animation: ${fadeInUp} 0.6s ease-out;
  `}
`;

const ErrorIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  background: #fef2f2;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 32px;
    height: 32px;
    color: #ef4444;
  }
`;

const ErrorTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
`;

const ErrorMessage = styled.p`
  color: #4b5563;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const ActionButton = styled.button<{ variant?: "primary" | "secondary" }>`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid;
  cursor: pointer;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  ${({ variant }) =>
    variant === "primary"
      ? `
        background: linear-gradient(to right, #2563eb, #6366f1);
        color: white;
        border-color: transparent;
        box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.25);
        
        &:hover {
          background: linear-gradient(to right, #1d4ed8, #4f46e5);
          box-shadow: 0 15px 35px -5px rgba(37, 99, 235, 0.4);
          transform: scale(1.02);
        }
      `
      : `
        background: white;
        color: #374151;
        border-color: #e5e7eb;
        
        &:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }
      `}

  svg {
    width: 16px;
    height: 16px;
  }
`;

const BackgroundEffects = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: -1;
`;

const FloatingElement = styled.div<{ delay?: number }>`
  position: absolute;
  border-radius: 50%;
  filter: blur(24px);
  ${css`
    animation: ${float} 6s ease-in-out infinite;
  `}
  animation-delay: ${({ delay }) => delay || 0}s;
`;

const BlueOrb = styled(FloatingElement)`
  top: 25%;
  left: 25%;
  width: 256px;
  height: 256px;
  background: rgba(59, 130, 246, 0.1);
`;

const IndigoOrb = styled(FloatingElement)`
  bottom: 25%;
  right: 25%;
  width: 384px;
  height: 384px;
  background: rgba(99, 102, 241, 0.1);
`;

const DetailPageLoader: React.FC = () => (
  <LoaderContainer>
    <SkeletonHeader>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4">
          <SkeletonElement width="40px" height="40px" />
          <div className="space-y-2">
            <SkeletonElement width="128px" height="24px" />
            <SkeletonElement width="192px" height="16px" />
          </div>
        </div>
      </div>
    </SkeletonHeader>

    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 p-8">
            <div className="flex flex-col items-center space-y-4">
              <SkeletonAvatar />
              <SkeletonElement width="128px" height="24px" />
              <SkeletonElement width="192px" height="16px" />
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <SkeletonElement height="600px" />
        </div>
      </div>
    </div>
  </LoaderContainer>
);

const DetailPageError: React.FC<{
  error?: Error | null;
  onBack: () => void;
}> = ({ error, onBack }) => (
  <ErrorContainer>
    <ErrorCard>
      <ErrorIcon>
        <Icon name="ExclamationTriangleIcon" />
      </ErrorIcon>

      <ErrorTitle>Unable to Load User</ErrorTitle>
      <ErrorMessage>
        {error?.message ||
          "The user you're looking for doesn't exist or there was an error loading their information."}
      </ErrorMessage>

      <div>
        <ActionButton variant="primary" onClick={onBack}>
          <Icon name="ArrowLeftIcon" />
          Return to Users
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={() => window.location.reload()}
        >
          <Icon name="ArrowPathIcon" />
          Try Again
        </ActionButton>
      </div>
    </ErrorCard>
  </ErrorContainer>
);

export const UserDetailPage: React.FC<IProps> = ({
  user,
  isLoading,
  error,
  onBack,
  onEdit,
}) => {
  if (isLoading) return <DetailPageLoader />;

  if (error || !user) {
    return <DetailPageError error={error} onBack={onBack} />;
  }

  return (
    <PageContainer>
      <MainContent>
        <GridContainer>
          <ProfileSection>
            <UserDetailCard user={user} onEdit={onEdit} />
          </ProfileSection>

          <MapSection>
            <UserLocationMap user={user} />
          </MapSection>
        </GridContainer>
      </MainContent>

      <BackgroundEffects>
        <BlueOrb delay={0} />
        <IndigoOrb delay={1} />
      </BackgroundEffects>
    </PageContainer>
  );
};
