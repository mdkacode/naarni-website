// Device Table Component using Ant Design
import React from "react";
import { Tag } from "antd";
import type { VehicleDevice } from "../types/device";
import { formatDate } from "../utils/formatters";
import { DataTable, type DataTableColumn } from "./DataTable";

interface DeviceTableProps {
  devices: VehicleDevice[];
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

const getDeviceColumns = (): DataTableColumn<VehicleDevice>[] => [
  {
    key: "id",
    title: "ID",
    dataIndex: "id",
    render: (id) => `#${id || "N/A"}`,
    sorter: (a, b) => (a.id || 0) - (b.id || 0),
  },
  {
    key: "deviceUuid",
    title: "Device UUID",
    dataIndex: "deviceUuid",
    render: (value) => value || "N/A",
  },
  {
    key: "vehicle",
    title: "Vehicle",
    render: (_, record) => record.vehicleNumber || `Vehicle ID: ${record.vehicleId || "N/A"}`,
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
    key: "installedAt",
    title: "Installed At",
    dataIndex: "installedAt",
    render: (value) => formatDate(value),
    sorter: (a, b) => {
      const aTime = typeof a.installedAt === "number" ? a.installedAt : new Date(a.installedAt || 0).getTime();
      const bTime = typeof b.installedAt === "number" ? b.installedAt : new Date(b.installedAt || 0).getTime();
      return aTime - bTime;
    },
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

export const DeviceTable: React.FC<DeviceTableProps> = ({ devices, loading = false }) => {
  return (
    <div className="hidden md:block">
      <DataTable<VehicleDevice>
        data={devices}
        columns={getDeviceColumns()}
        loading={loading}
        scroll={{ x: "max-content" }}
        rowKey="id"
      />
    </div>
  );
};

