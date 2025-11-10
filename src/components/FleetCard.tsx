// Fleet Card Component (Mobile View)
import React from "react";
// import { Fleet } from "../types/fleet";
import { formatDate } from "../utils/formatters";
import type { Fleet } from "../types/fleet";

interface FleetCardProps {
  fleet: Fleet;
}

const getStatusBadgeClass = (status?: string) => {
  if (status === "ACTIVE") return "bg-green-100 text-green-800";
  if (status === "INACTIVE") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

export const FleetCard: React.FC<FleetCardProps> = ({ fleet }) => (
  <div className="p-4 hover:bg-gray-50 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {fleet.name || `Fleet #${fleet.id}`}
        </h3>
        <p className="text-sm text-gray-500">ID: #{fleet.id}</p>
      </div>
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(fleet.status)}`}>
        {fleet.status || "UNKNOWN"}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
      <div>
        <p className="text-gray-500">Organization</p>
        <p className="text-gray-900 font-medium">
          {fleet.organizationName || `Org ID: ${fleet.organizationId || "N/A"}`}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Vehicles</p>
        <p className="text-gray-900 font-medium">{fleet.vehicleCount ?? "N/A"}</p>
      </div>
      <div className="col-span-2">
        <p className="text-gray-500">Created At</p>
        <p className="text-gray-900 font-medium">{formatDate(fleet.createdAt)}</p>
      </div>
    </div>
  </div>
);

