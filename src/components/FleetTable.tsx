// Fleet Table Component using Ant Design
import React from "react";
import { Tag } from "antd";
import type { Fleet } from "../types/fleet";
import { formatDate } from "../utils/formatters";
import { DataTable, type DataTableColumn } from "./DataTable";

interface FleetTableProps {
  fleets: Fleet[];
  loading?: boolean;
}

const getStatusTag = (status?: string) => {
  const statusMap: Record<string, { color: string; text: string }> = {
    ACTIVE: { color: "green", text: "Active" },
    INACTIVE: { color: "red", text: "Inactive" },
  };
  
  const statusInfo = statusMap[status || ""] || { color: "default", text: status || "Unknown" };
  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
};

const getFleetColumns = (): DataTableColumn<Fleet>[] => [
  {
    key: "id",
    title: "ID",
    dataIndex: "id",
    render: (id) => `#${id}`,
    sorter: (a, b) => a.id - b.id,
  },
  {
    key: "name",
    title: "Name",
    dataIndex: "name",
    render: (value) => value || "N/A",
  },
  {
    key: "organization",
    title: "Organization",
    render: (_, record) => record.organizationName || `Org ID: ${record.organizationId || "N/A"}`,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (status) => getStatusTag(status),
    filters: [
      { text: "Active", value: "ACTIVE" },
      { text: "Inactive", value: "INACTIVE" },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    key: "vehicleCount",
    title: "Vehicles",
    dataIndex: "vehicleCount",
    render: (value) => value ?? "N/A",
    sorter: (a, b) => (a.vehicleCount || 0) - (b.vehicleCount || 0),
  },
  {
    key: "createdAt",
    title: "Created At",
    dataIndex: "createdAt",
    render: (value) => formatDate(value),
    sorter: (a, b) => {
      const aTime = typeof a.createdAt === "number" ? a.createdAt : new Date(a.createdAt || 0).getTime();
      const bTime = typeof b.createdAt === "number" ? b.createdAt : new Date(b.createdAt || 0).getTime();
      return aTime - bTime;
    },
  },
];

export const FleetTable: React.FC<FleetTableProps> = ({ fleets, loading = false }) => {
  return (
    <div className="hidden md:block">
      <DataTable<Fleet>
        data={fleets}
        columns={getFleetColumns()}
        loading={loading}
        scroll={{ x: "max-content" }}
        rowKey="id"
      />
    </div>
  );
};

