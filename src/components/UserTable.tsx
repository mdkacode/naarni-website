// User Table Component using Ant Design
import React from "react";
import { Tag, Button } from "antd";
import type { User } from "../types/user";
import { formatDate } from "../utils/formatters";
import { DataTable, type DataTableColumn } from "./DataTable";

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onEdit?: (user: User) => void;
}

const getVerificationTags = (user: User) => {
  const isPhoneVerified = user.account?.isPhoneVerified || user.isPhoneVerified;
  const isEmailVerified = user.account?.isEmailVerified || user.isEmailVerified;
  return (
    <div className="flex gap-2">
      {isPhoneVerified && <Tag color="green">Phone</Tag>}
      {isEmailVerified && <Tag color="green">Email</Tag>}
      {!isPhoneVerified && !isEmailVerified && <Tag color="default">Not Verified</Tag>}
    </div>
  );
};

const getUserColumns = (onEdit?: (user: User) => void): DataTableColumn<User>[] => [
  {
    key: "name",
    title: "Name",
    render: (_, record) => {
      const profile = record.profile || {};
      const firstName = profile.firstName || record.firstName || "";
      const lastName = profile.lastName || record.lastName || "";
      const name = `${firstName} ${lastName}`.trim();
      return name || "Unnamed";
    },
  },
  {
    key: "phone",
    title: "Phone",
    render: (_, record) => {
      const phone = record.account?.phone || record.phone;
      return phone || "N/A";
    },
  },
  {
    key: "organization",
    title: "Organization",
    render: (_, record) => {
      const orgId = record.account?.organizationId || record.organizationId;
      return record.organizationName || (orgId ? `Org ID: ${orgId}` : "N/A");
    },
  },
  {
    key: "status",
    title: "Status",
    render: (_, record) => {
      const status = record.account?.userStatus || record.userStatus;
      const statusMap: Record<string, { color: string; text: string }> = {
        ACTIVE: { color: "green", text: "Active" },
        INACTIVE: { color: "red", text: "Inactive" },
      };
      const statusInfo = statusMap[status || ""] || { color: "default", text: status || "Unknown" };
      return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
    },
    filters: [
      { text: "Active", value: "ACTIVE" },
      { text: "Inactive", value: "INACTIVE" },
    ],
    onFilter: (value, record) => {
      const status = record.account?.userStatus || record.userStatus;
      return status === value;
    },
  },
  {
    key: "verification",
    title: "Verification",
    render: (_, record) => getVerificationTags(record),
  },
  {
    key: "createdAt",
    title: "Created At",
    render: (_, record) => {
      const createdAt = record.account?.createdAt || record.createdAt;
      return formatDate(createdAt);
    },
    sorter: (a, b) => {
      const aCreatedAt = a.account?.createdAt || a.createdAt;
      const bCreatedAt = b.account?.createdAt || b.createdAt;
      const aTime = typeof aCreatedAt === "number" 
        ? aCreatedAt 
        : new Date(aCreatedAt || 0).getTime();
      const bTime = typeof bCreatedAt === "number" 
        ? bCreatedAt 
        : new Date(bCreatedAt || 0).getTime();
      return (aTime || 0) - (bTime || 0);
    },
  },
  {
    key: "actions",
    title: "Actions",
    render: (_, record) => (
      <Button type="link" onClick={() => onEdit?.(record)}>
        Edit
      </Button>
    ),
    width: 100,
  },
];

export const UserTable: React.FC<UserTableProps> = ({ users, loading = false, onEdit }) => {
  return (
    <div className="hidden md:block w-full">
      <DataTable<User>
        data={users}
        columns={getUserColumns(onEdit)}
        loading={loading}
        rowKey={(record) => record.account?.uuid || record.uuid || record.id || ""}
        size="middle"
      />
    </div>
  );
};

