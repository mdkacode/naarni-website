// Route Card Component (Mobile View)
import React from "react";
import { Button, Tag } from "antd";
import type { Route } from "../types/route";
import { formatDate } from "../utils/formatters";

interface RouteCardProps {
  route: Route;
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

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  onEdit,
}) => (
  <div className="p-4 hover:bg-gray-50 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {route.name || `Route #${route.id || "N/A"}`}
        </h3>
        <p className="text-sm text-gray-500">
          {route.description || "No description"}
        </p>
      </div>
      {getRouteTypeTag(route.routeType)}
    </div>
    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
      <div>
        <p className="text-gray-500">Start City</p>
        <p className="text-gray-900 font-medium">
          {route.startCityName || "N/A"} {route.startCityId ? `(ID: ${route.startCityId})` : ""}
        </p>
      </div>
      <div>
        <p className="text-gray-500">End City</p>
        <p className="text-gray-900 font-medium">
          {route.endCityName || "N/A"} {route.endCityId ? `(ID: ${route.endCityId})` : ""}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Distance</p>
        <p className="text-gray-900 font-medium">{route.distance ? `${route.distance} km` : "N/A"}</p>
      </div>
      <div>
        <p className="text-gray-500">Duration</p>
        <p className="text-gray-900 font-medium">{route.estimatedDuration ? `${route.estimatedDuration} min` : "N/A"}</p>
      </div>
      <div>
        <p className="text-gray-500">Created At</p>
        <p className="text-gray-900 font-medium">{formatDate(route.createdAt)}</p>
      </div>
    </div>
    {onEdit && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button
          type="primary"
          size="small"
          onClick={() => onEdit(route)}
          block
        >
          Edit Route
        </Button>
      </div>
    )}
  </div>
);

