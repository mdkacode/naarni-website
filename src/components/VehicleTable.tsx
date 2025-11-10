// Vehicle Table Component using Ant Design
import React from "react";
import { Tag, Button } from "antd";
import type { Vehicle } from "../types/vehicle";
import { formatDate } from "../utils/formatters";
import { DataTable, type DataTableColumn } from "./DataTable";

interface VehicleTableProps {
  vehicles: Vehicle[];
  loading?: boolean;
  onViewDetails?: (vehicle: Vehicle) => void;
}

const getStatusTag = (status?: string) => {
  const statusMap: Record<string, { color: string; text: string }> = {
    MOVING: { color: "green", text: "Moving" },
    NOT_MOVING: { color: "orange", text: "Not Moving" },
    MAINTENANCE: { color: "red", text: "Maintenance" },
    INACTIVE: { color: "default", text: "Inactive" },
  };
  
  const statusInfo = statusMap[status || ""] || { color: "default", text: status?.replace("_", " ") || "Unknown" };
  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
};

const getVehicleColumns = (
  onViewDetails?: (vehicle: Vehicle) => void
): DataTableColumn<Vehicle>[] => [
  {
    key: "id",
    title: "ID",
    dataIndex: "id",
    render: (id) => `#${id || "N/A"}`,
    sorter: (a, b) => (a.id || 0) - (b.id || 0),
  },
  {
    key: "registrationNumber",
    title: "Registration",
    dataIndex: "registrationNumber",
    render: (value) => value || "N/A",
  },
  {
    key: "makeModel",
    title: "Make/Model",
    render: (_, record) => `${record.make || "N/A"} ${record.model || ""}`.trim(),
  },
  {
    key: "year",
    title: "Year",
    dataIndex: "year",
    render: (value) => value || "N/A",
    sorter: (a, b) => (a.year || 0) - (b.year || 0),
  },
  {
    key: "vehicleType",
    title: "Type",
    dataIndex: "vehicleType",
    render: (value) => value || "N/A",
  },
  {
    key: "capacity",
    title: "Capacity",
    dataIndex: "capacity",
    render: (value) => value || "N/A",
    sorter: (a, b) => (a.capacity || 0) - (b.capacity || 0),
  },
  {
    key: "fleetId",
    title: "Fleet",
    dataIndex: "fleetId",
    render: (value, record) => {
      // Check if fleet object exists with name
      if (record.fleet?.name) {
        return record.fleet.name;
      }
      // Fallback to fleetId if name not available
      return value ? `Fleet ID: ${value}` : "N/A";
    },
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (status) => getStatusTag(status),
    filters: [
      { text: "Moving", value: "MOVING" },
      { text: "Not Moving", value: "NOT_MOVING" },
      { text: "Maintenance", value: "MAINTENANCE" },
      { text: "Inactive", value: "INACTIVE" },
    ],
    onFilter: (value, record) => record.status === value,
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
  {
    key: "actions",
    title: "Actions",
    render: (_, record) => (
      <Button
        type="link"
        size="small"
        onClick={() => onViewDetails?.(record)}
      >
        View Details
      </Button>
    ),
    width: 120,
  },
];

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  loading = false,
  onViewDetails,
}) => {
  return (
    <div className="hidden md:block">
      <DataTable<Vehicle>
        data={vehicles}
        columns={getVehicleColumns(onViewDetails)}
        loading={loading}
        scroll={{ x: "max-content" }}
        rowKey="id"
      />
    </div>
  );
};

