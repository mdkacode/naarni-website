// Device Card Component (Mobile View)
import React from "react";
import type { VehicleDevice } from "../types/device";
import { formatDate } from "../utils/formatters";

interface DeviceCardProps {
  device: VehicleDevice;
}

const getStatusBadgeClass = (status?: string) => {
  if (status === "ACTIVE") return "bg-green-100 text-green-800";
  if (status === "INACTIVE") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => (
  <div className="p-4 hover:bg-gray-50 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Device #{device.id || "N/A"}
        </h3>
        <p className="text-sm text-gray-500">UUID: {device.deviceUuid || "N/A"}</p>
      </div>
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(device.status)}`}>
        {device.status || "UNKNOWN"}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
      <div>
        <p className="text-gray-500">Vehicle</p>
        <p className="text-gray-900 font-medium">
          {device.vehicleNumber || `Vehicle ID: ${device.vehicleId || "N/A"}`}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Installed At</p>
        <p className="text-gray-900 font-medium">{formatDate(device.installedAt)}</p>
      </div>
      <div className="col-span-2">
        <p className="text-gray-500">Created At</p>
        <p className="text-gray-900 font-medium">{formatDate(device.createdAt)}</p>
      </div>
    </div>
  </div>
);

