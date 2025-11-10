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

const getGenderTag = (gender?: string) => {
  const genderMap: Record<string, { color: string; text: string }> = {
    MALE: { color: "blue", text: "Male" },
    FEMALE: { color: "pink", text: "Female" },
    OTHER: { color: "default", text: "Other" },
  };
  
  const genderInfo = genderMap[gender || ""] || { color: "default", text: gender || "Unknown" };
  return <Tag color={genderInfo.color}>{genderInfo.text}</Tag>;
};

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
    key: "email",
    title: "Email",
    render: (_, record) => {
      const email = record.account?.email || record.email;
      return email || "N/A";
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
      const aTime = typeof (a.account?.createdAt || a.createdAt) === "number" 
        ? (a.account?.createdAt || a.createdAt) 
        : new Date(a.account?.createdAt || a.createdAt || 0).getTime();
      const bTime = typeof (b.account?.createdAt || b.createdAt) === "number" 
        ? (b.account?.createdAt || b.createdAt) 
        : new Date(b.account?.createdAt || b.createdAt || 0).getTime();
      return aTime - bTime;
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
        scroll={false}
        rowKey={(record) => record.account?.uuid || record.uuid || record.id || ""}
        size="middle"
      />
    </div>
  );
};

