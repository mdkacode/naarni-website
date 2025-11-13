// Device Table Component using Ant Design
import React from "react";
import { Tag,  Space,  Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { VehicleDevice } from "../types/device";
import { formatDate } from "../utils/formatters";
import { DataTable, type DataTableColumn } from "./DataTable";

interface DeviceTableProps {
  devices: VehicleDevice[];
  loading?: boolean;
  onDelete?: (device: VehicleDevice) => void;
}

const getStatusTag = (status?: string) => {
  const statusMap: Record<string, { color: string; text: string }> = {
    ACTIVE: { color: "green", text: "Active" },
    INACTIVE: { color: "red", text: "Inactive" },
  };
  
  const statusInfo = statusMap[status || ""] || { color: "default", text: status || "Unknown" };
  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
};

const getDeviceColumns = (onDelete?: (device: VehicleDevice) => void): DataTableColumn<VehicleDevice>[] => {
  const handleDelete = (record: VehicleDevice, e: React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (!onDelete) return;
    
    // Test if click is working
    console.log("Delete button clicked for device:", record);
    onDelete(record);
    // Modal.confirm({
    //   title: "Are you sure?",
    //   icon: <ExclamationCircleOutlined />,
    //   content: `Are you sure you want to delete device ${record.deviceId || record.id}? This action cannot be undone.`,
    //   okText: "Yes, Delete",
    //   okType: "danger",
    //   cancelText: "Cancel",
    //   onOk: () => {
    //     console.log("Delete confirmed for device:", record);
    //     onDelete(record);
    //   },
    // });
  };

  return [
  {
    key: "id",
    title: "Device ID",
    dataIndex: "deviceId",
    render: (id) => `${id || "N/A"}`,
    sorter: (a, b) => (a.id || 0) - (b.id || 0),
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
      <Space size="small">
        {onDelete && (
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={(e) => handleDelete(record, e)}
          >
            Delete
          </Button>
        )}
      </Space>
    ),
    width: 120,
    onCell: () => ({
      onClick: (e) => {
        e.stopPropagation();
      },
    }),
  },
];
};

export const DeviceTable: React.FC<DeviceTableProps> = ({ devices, loading = false, onDelete }) => {
  return (
    <div className="hidden md:block">
      <DataTable<VehicleDevice>
        data={devices}
        columns={getDeviceColumns(onDelete)}
        loading={loading}
        scroll={{ x: "max-content" }}
        rowKey="id"
      />
    </div>
  );
};

