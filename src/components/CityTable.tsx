// City Table Component using Ant Design
import React from "react";
import { Button, Space, Popconfirm } from "antd";
import type { City } from "../types/city";
import { formatDate } from "../utils/formatters";
import { DataTable, type DataTableColumn } from "./DataTable";

interface CityTableProps {
  cities: City[];
  loading?: boolean;
  onEdit?: (city: City) => void;
  onDelete?: (city: City) => void;
}

const getCityColumns = (
  onEdit?: (city: City) => void,
  onDelete?: (city: City) => void
): DataTableColumn<City>[] => [
  {
    key: "id",
    title: "ID",
    dataIndex: "id",
    render: (id) => `#${id || "N/A"}`,
    sorter: (a, b) => (a.id || 0) - (b.id || 0),
  },
  {
    key: "name",
    title: "City Name",
    dataIndex: "name",
    render: (value) => value || "N/A",
  },
  {
    key: "state",
    title: "State",
    dataIndex: "state",
    render: (value) => value || "N/A",
  },
  {
    key: "country",
    title: "Country",
    dataIndex: "country",
    render: (value) => value || "N/A",
  },
  {
    key: "coordinates",
    title: "Coordinates",
    render: (_, record) => {
      if (record.latitude && record.longitude) {
        return `${record.latitude.toFixed(4)}, ${record.longitude.toFixed(4)}`;
      }
      return "N/A";
    },
  },
  {
    key: "description",
    title: "Description",
    dataIndex: "description",
    render: (value) => value || "N/A",
    ellipsis: true,
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
        <Button
          type="link"
          size="small"
          onClick={() => onEdit?.(record)}
        >
          Edit
        </Button>
        {onDelete && (
          <Popconfirm
            title="Delete City"
            description={`Are you sure you want to delete ${record.name}?`}
            onConfirm={() => onDelete(record)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              size="small"
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        )}
      </Space>
    ),
    width: 150,
  },
];

export const CityTable: React.FC<CityTableProps> = ({
  cities,
  loading = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="hidden md:block">
      <DataTable<City>
        data={cities}
        columns={getCityColumns(onEdit, onDelete)}
        loading={loading}
        scroll={{ x: "max-content" }}
        rowKey="id"
      />
    </div>
  );
};

