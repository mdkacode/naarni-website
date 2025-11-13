// Vehicle Table Component using Ant Design
import React from "react";
import { Button, Space, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { Vehicle } from "../types/vehicle";
import { formatDate } from "../utils/formatters";
import { DataTable, type DataTableColumn } from "./DataTable";

interface VehicleTableProps {
  vehicles: Vehicle[];
  loading?: boolean;
  onViewDetails?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

const getVehicleColumns = (
  onViewDetails?: (vehicle: Vehicle) => void,
  onDelete?: (vehicle: Vehicle) => void
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
    render: (_, record) => {
      const handleDelete = (e: React.MouseEvent) => {
        // alert("Delete button clicked for vehicle:", record.id);
        console.log("Delete button clicked for vehicle:", record.id);
        e.stopPropagation();
        e.preventDefault();
        if (!onDelete) {
          console.error("onDelete callback is not provided");
          return;
        }
        console.log("onDelete callback exists, showing confirmation modal");
        onDelete(record);
      };

      return (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onViewDetails?.(record);
            }}
          >
            View Details
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Space>
      );
    },
    onCell: () => ({
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
      },
    }),
    width: 200,
  },
];

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  loading = false,
  onViewDetails,
  onDelete,
}) => {
  return (
    <div className="hidden md:block">
      <DataTable<Vehicle>
        data={vehicles}
        columns={getVehicleColumns(onViewDetails, onDelete)}
        loading={loading}
        scroll={{ x: "max-content" }}
        rowKey="id"
      />
    </div>
  );
};

