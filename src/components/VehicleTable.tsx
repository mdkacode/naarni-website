// Vehicle Table Component using Ant Design
import React from "react";
import { Button, Space, Tooltip } from "antd";
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
    render: (_, record) => <Tooltip title={`${record.make || "N/A"} ${record.model || ""}`}><p className="text-sm text-yellow-500 truncate max-w-[100px]">{record.make || "N/A"} {record.model || ""}</p></Tooltip>,
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
    key: "route",
    title: "Route",
    dataIndex: "routeId",
    render: (value, record) => {
      // Check if route object exists with city names
      if (record.route?.startCityName && record.route?.endCityName) {
        return `${record.route.startCityName} to ${record.route.endCityName}`;
      }
      // Fallback to routeId if route info not available
      return value ? `Route ID: ${value}` : "N/A";
    },
  },
  {
    key: "deviceId",
    title: "Device ID",
    dataIndex: "deviceId",
    render: (value, record) => {
      // Prioritize deviceId field from device object (e.g., "31") over id (e.g., 21)
      const deviceId = record.device?.deviceId || record.device?.id || value;
      const deviceStatus = record.deviceStatus || record.device?.status;
      
      if (deviceId) {
        // Show device ID with status if inactive
        if (deviceStatus === 'INACTIVE' || deviceStatus === 'inactive') {
          return `${deviceId} (Inactive)`;
        }
        return deviceId;
      }
      return "N/A";
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

