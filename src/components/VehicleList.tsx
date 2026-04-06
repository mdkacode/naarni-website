// Vehicle List Component (Combines Table and Cards)
import React from "react";
import type { Vehicle } from "../types/vehicle";
import { VehicleTable } from "./VehicleTable";
import { VehicleCard } from "./VehicleCard";

interface VehicleListProps {
  vehicles: Vehicle[];
  loading?: boolean;
  onViewDetails?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

export const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  loading = false,
  onViewDetails,
  onDelete,
}) => (
  <>
    <VehicleTable
      vehicles={vehicles}
      loading={loading}
      onViewDetails={onViewDetails}
      onDelete={onDelete}
    />
    <div className="md:hidden divide-y divide-gray-200">
      {vehicles.map(vehicle => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  </>
);

