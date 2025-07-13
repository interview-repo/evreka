import styled from "styled-components";

const EmptyContainer = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(229, 231, 235, 0.5);
`;

const EmptyContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 256px;
  color: #6b7280;
`;

const EmptyTextContainer = styled.div`
  text-align: center;
  animation: fadeInUp 0.6s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const EmptyTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
`;

const EmptySubtitle = styled.div`
  font-size: 14px;
  color: #6b7280;
  opacity: 0.8;
`;

export function EmptyData() {
  return (
    <EmptyContainer>
      <EmptyContent>
        <EmptyTextContainer>
          <EmptyTitle>No Data Found</EmptyTitle>
          <EmptySubtitle>Try adjusting your search or filters</EmptySubtitle>
        </EmptyTextContainer>
      </EmptyContent>
    </EmptyContainer>
  );
}