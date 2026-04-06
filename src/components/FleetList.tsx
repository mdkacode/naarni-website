// Fleet List Component (Combines Table and Cards)
import React from "react";
import type { Fleet } from "../types/fleet";
import { FleetTable } from "./FleetTable";
import { FleetCard } from "./FleetCard";

interface FleetListProps {
  fleets: Fleet[];
  loading?: boolean;
}

export const FleetList: React.FC<FleetListProps> = ({ fleets, loading = false }) => (
  <>
    <FleetTable fleets={fleets} loading={loading} />
    <div className="md:hidden divide-y divide-gray-200">
      {fleets.map(fleet => <FleetCard key={fleet.id} fleet={fleet} />)}
    </div>
  </>
);

