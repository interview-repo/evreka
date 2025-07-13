import React from "react";
import styled from "styled-components";
import { RoleBadge, StatusBadge } from "../shared/badge";
import { Avatar } from "../shared/avatar";
import type { TableColumn } from "../table/types";
import type { User, UserRole } from "@/types/user";
import { formatDate } from "@/utils/date-format";

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
`;

const UserInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 14px;
  line-height: 1.4;
`;

const UserEmail = styled.div`
  font-size: 13px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
`;

const DateCell = styled.span`
  font-size: 13px;
  color: #4b5563;
  font-weight: 500;
  letter-spacing: 0.025em;
`;

const UserCellComponent: React.FC<{ value: string; row: User }> = ({
  value,
  row,
}) => (
  <UserCell>
    <Avatar name={value} isActive={row.active} />
    <UserInfo>
      <UserName>{value}</UserName>
      <UserEmail>{row.email}</UserEmail>
    </UserInfo>
  </UserCell>
);

const RoleCellComponent: React.FC<{ value: UserRole }> = ({ value }) => (
  <RoleBadge role={value} />
);

const StatusCellComponent: React.FC<{ value: boolean }> = ({ value }) => (
  <StatusBadge isActive={value} />
);

const DateCellComponent: React.FC<{ value: string }> = ({ value }) => (
  <DateCell>{formatDate(value)}</DateCell>
);

export const userTableColumns: TableColumn<User>[] = [
  {
    key: "name",
    header: "User",
    cell: (value: string, row: User) => (
      <UserCellComponent value={value} row={row} />
    ),
  },
  {
    key: "role",
    header: "Role",
    cell: (value: UserRole) => <RoleCellComponent value={value} />,
  },
  {
    key: "active",
    header: "Status",
    cell: (value: boolean) => <StatusCellComponent value={value} />,
  },
  {
    key: "createdAt",
    header: "Joined",
    cell: (value: string) => <DateCellComponent value={value} />,
  },
];
