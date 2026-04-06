// Route Table Component using Ant Design
import React, { useEffect, useMemo } from "react";
import { Button, Space, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { Route } from "../types/route";
import { formatDate } from "../utils/formatters";
import { DataTable, type DataTableColumn } from "./DataTable";
import { useCities } from "../hooks/useCities";
import { useAuth } from "../hooks/useAuth";

interface RouteTableProps {
  routes: Route[];
  loading?: boolean;
  onEdit?: (route: Route) => void;
  onDelete?: (route: Route) => void;
}

const getRouteColumns = (
  onEdit?: (route: Route) => void, 
  onDelete?: (route: Route) => void,
  cityMap?: Map<number, string>
): DataTableColumn<Route>[] => {
  const getRouteDisplayName = (record: Route): string => {
    const startCityName = record.startCityName || cityMap?.get(record.startCityId || 0) || "N/A";
    const endCityName = record.endCityName || cityMap?.get(record.endCityId || 0) || "N/A";
    return `${startCityName} to ${endCityName}`;
  };

  return [
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
    render: (_, record) => getRouteDisplayName(record),
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
        e.stopPropagation();
        e.preventDefault();
        const routeName = getRouteDisplayName(record);
        Modal.confirm({
          title: "Are you sure you want to delete this route?",
          icon: <ExclamationCircleOutlined />,
          content: `Route: ${routeName}`,
          okText: "Yes, Delete",
          okType: "danger",
          cancelText: "Cancel",
          onOk: () => {
            onDelete?.(record);
          },
        });
      };

      return (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onEdit?.(record);
            }}
          >
            Edit
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
    width: 150,
  },
  ];
};

export const RouteTable: React.FC<RouteTableProps> = ({
  routes,
  loading = false,
  onEdit,
  onDelete,
}) => {
  const { token } = useAuth();
  const { cities, fetchCities } = useCities(token);

  // Fetch all cities on mount
  useEffect(() => {
    if (token) {
      // Fetch with a large page size to get all cities
      fetchCities(0, 1000);
    }
  }, [token, fetchCities]);

  // Create a map of city ID to city name for quick lookup
  const cityMap = useMemo(() => {
    const map = new Map<number, string>();
    cities.forEach((city) => {
      if (city.id && city.name) {
        map.set(city.id, city.name);
      }
    });
    return map;
  }, [cities]);

  return (
    <div className="hidden md:block">
      <DataTable<Route>
        data={routes}
        columns={getRouteColumns(onEdit, onDelete, cityMap)}
        loading={loading}
        scroll={{ x: "max-content" }}
        rowKey="id"
      />
    </div>
  );
};

