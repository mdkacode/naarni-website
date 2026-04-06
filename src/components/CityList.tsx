// City List Component (Combines Table and Cards)
import React from "react";
import type { City } from "../types/city";
import { CityTable } from "./CityTable";
import { CityCard } from "./CityCard";

interface CityListProps {
  cities: City[];
  loading?: boolean;
  onEdit?: (city: City) => void;
  onDelete?: (city: City) => void;
}

export const CityList: React.FC<CityListProps> = ({
  cities,
  loading = false,
  onEdit,
  onDelete,
}) => (
  <>
    <CityTable
      cities={cities}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
    />
    <div className="md:hidden divide-y divide-gray-200">
      {cities.map(city => (
        <CityCard
          key={city.id}
          city={city}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  </>
);

