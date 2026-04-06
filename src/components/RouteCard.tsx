// Route Card Component (Mobile View)
import React, { useEffect, useMemo } from "react";
import { Button } from "antd";
import type { Route } from "../types/route";
import { formatDate } from "../utils/formatters";
import { useCities } from "../hooks/useCities";
import { useAuth } from "../hooks/useAuth";

interface RouteCardProps {
  route: Route;
  onEdit?: (route: Route) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  onEdit,
}) => {
  const { token } = useAuth();
  const { cities, fetchCities } = useCities(token);

  // Fetch cities on mount
  useEffect(() => {
    if (token) {
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

  // Helper function to get route display name
  const getRouteDisplayName = (route: Route): string => {
    const startCityName = route.startCityName || cityMap.get(route.startCityId || 0) || "N/A";
    const endCityName = route.endCityName || cityMap.get(route.endCityId || 0) || "N/A";
    return `${startCityName} to ${endCityName}`;
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {getRouteDisplayName(route)}
        </h3>
      </div>
      <div className="mt-3 text-sm">
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
};

