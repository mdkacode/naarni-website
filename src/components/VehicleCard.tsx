// Vehicle Card Component (Mobile View)
import React from "react";
import { Button, Space } from "antd";
import type { Vehicle } from "../types/vehicle";
import { formatDate } from "../utils/formatters";

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails?: (vehicle: Vehicle) => void;
}

const getStatusBadgeClass = (status?: string) => {
  if (status === "MOVING") return "bg-green-100 text-green-800";
  if (status === "NOT_MOVING") return "bg-yellow-100 text-yellow-800";
  if (status === "MAINTENANCE") return "bg-orange-100 text-orange-800";
  if (status === "INACTIVE") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onViewDetails,
}) => (
  <div className="p-4 hover:bg-gray-50 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {vehicle.registrationNumber || `Vehicle #${vehicle.id || "N/A"}`}
        </h3>
        <p className="text-sm text-gray-500">
          {vehicle.make || "N/A"} {vehicle.model || ""} ({vehicle.year || "N/A"})
        </p>
      </div>
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(vehicle.status)}`}>
        {vehicle.status?.replace("_", " ") || "UNKNOWN"}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
      <div>
        <p className="text-gray-500">Type</p>
        <p className="text-gray-900 font-medium">{vehicle.vehicleType || "N/A"}</p>
      </div>
      <div>
        <p className="text-gray-500">Capacity</p>
        <p className="text-gray-900 font-medium">{vehicle.capacity || "N/A"}</p>
      </div>
      <div>
        <p className="text-gray-500">Fleet</p>
        <p className="text-gray-900 font-medium">
          {vehicle.fleet?.name || (vehicle.fleetId ? `Fleet ID: ${vehicle.fleetId}` : "N/A")}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Created At</p>
        <p className="text-gray-900 font-medium">{formatDate(vehicle.createdAt)}</p>
      </div>
    </div>
    {onViewDetails && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button
          type="primary"
          size="small"
          onClick={() => onViewDetails(vehicle)}
          block
        >
          View Details
        </Button>
      </div>
    )}
  </div>
);

