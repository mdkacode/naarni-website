// Route Table Component using Ant Design
import React from "react";
import { Tag, Button, Space } from "antd";
import type { Route } from "../types/route";
import { formatDate } from "../utils/formatters";
import { DataTable, type DataTableColumn } from "./DataTable";

interface RouteTableProps {
  routes: Route[];
  loading?: boolean;
  onEdit?: (route: Route) => void;
}

const getRouteTypeTag = (routeType?: string) => {
  if (routeType === "TO_FRO") {
    return <Tag color="blue">To & Fro</Tag>;
  }
  if (routeType === "ONE_WAY") {
    return <Tag color="green">One Way</Tag>;
  }
  return <Tag>{routeType || "N/A"}</Tag>;
};

const getRouteColumns = (onEdit?: (route: Route) => void): DataTableColumn<Route>[] => [
  {
    key: "id",
    title: "ID",
    dataIndex: "id",
    render: (id) => `#${id || "N/A"}`,
    sorter: (a, b) => (a.id || 0) - (b.id || 0),
  },
  {
    key: "name",
    title: "Route Name",
    dataIndex: "name",
    render: (value) => value || "N/A",
  },
  {
    key: "description",
    title: "Description",
    dataIndex: "description",
    render: (value) => value || "N/A",
    ellipsis: true,
  },
  {
    key: "startCity",
    title: "Start City",
    render: (_, record) => `${record.startCityName || "N/A"} (ID: ${record.startCityId || "N/A"})`,
  },
  {
    key: "endCity",
    title: "End City",
    render: (_, record) => `${record.endCityName || "N/A"} (ID: ${record.endCityId || "N/A"})`,
  },
  {
    key: "distance",
    title: "Distance (km)",
    dataIndex: "distance",
    render: (value) => value ? `${value} km` : "N/A",
    sorter: (a, b) => (a.distance || 0) - (b.distance || 0),
  },
  {
    key: "estimatedDuration",
    title: "Duration (min)",
    dataIndex: "estimatedDuration",
    render: (value) => value ? `${value} min` : "N/A",
    sorter: (a, b) => (a.estimatedDuration || 0) - (b.estimatedDuration || 0),
  },
  {
    key: "routeType",
    title: "Type",
    dataIndex: "routeType",
    render: (routeType) => getRouteTypeTag(routeType),
    filters: [
      { text: "One Way", value: "ONE_WAY" },
      { text: "To & Fro", value: "TO_FRO" },
    ],
    onFilter: (value, record) => record.routeType === value,
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
      </Space>
    ),
    width: 100,
  },
];

export const RouteTable: React.FC<RouteTableProps> = ({
  routes,
  loading = false,
  onEdit,
}) => {
  return (
    <div className="hidden md:block">
      <DataTable<Route>
        data={routes}
        columns={getRouteColumns(onEdit)}
        loading={loading}
        scroll={{ x: "max-content" }}
        rowKey="id"
      />
    </div>
  );
};

