// City Card Component (Mobile View)
import React from "react";
import { Button, Space, Popconfirm } from "antd";
import type { City } from "../types/city";
import { formatDate } from "../utils/formatters";

interface CityCardProps {
  city: City;
  onEdit?: (city: City) => void;
  onDelete?: (city: City) => void;
}

export const CityCard: React.FC<CityCardProps> = ({
  city,
  onEdit,
  onDelete,
}) => (
  <div className="p-4 hover:bg-gray-50 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {city.name || `City #${city.id || "N/A"}`}
        </h3>
        <p className="text-sm text-gray-500">
          {city.state || "N/A"}, {city.country || "N/A"}
        </p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
      <div>
        <p className="text-gray-500">Coordinates</p>
        <p className="text-gray-900 font-medium">
          {city.latitude && city.longitude 
            ? `${city.latitude.toFixed(4)}, ${city.longitude.toFixed(4)}`
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Created At</p>
        <p className="text-gray-900 font-medium">{formatDate(city.createdAt)}</p>
      </div>
      {city.description && (
        <div className="col-span-2">
          <p className="text-gray-500">Description</p>
          <p className="text-gray-900 font-medium">{city.description}</p>
        </div>
      )}
    </div>
    {(onEdit || onDelete) && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Space size="small" className="w-full" direction="vertical">
          {onEdit && (
            <Button
              type="primary"
              size="small"
              onClick={() => onEdit(city)}
              block
            >
              Edit City
            </Button>
          )}
          {onDelete && (
            <Popconfirm
              title="Delete City"
              description={`Are you sure you want to delete ${city.name}?`}
              onConfirm={() => onDelete(city)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="default"
                size="small"
                danger
                block
              >
                Delete City
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>
    )}
  </div>
);

