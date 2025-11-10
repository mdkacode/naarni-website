// Route List Component (Combines Table and Cards)
import React from "react";
import type { Route } from "../types/route";
import { RouteTable } from "./RouteTable";
import { RouteCard } from "./RouteCard";

interface RouteListProps {
  routes: Route[];
  loading?: boolean;
  onEdit?: (route: Route) => void;
}

export const RouteList: React.FC<RouteListProps> = ({
  routes,
  loading = false,
  onEdit,
}) => (
  <>
    <RouteTable
      routes={routes}
      loading={loading}
      onEdit={onEdit}
    />
    <div className="md:hidden divide-y divide-gray-200">
      {routes.map(route => (
        <RouteCard
          key={route.id}
          route={route}
          onEdit={onEdit}
        />
      ))}
    </div>
  </>
);

