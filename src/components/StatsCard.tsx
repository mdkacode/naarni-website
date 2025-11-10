// Reusable Stats Card Component
import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  borderColor: string;
  bgColor: string;
  iconColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  borderColor,
  bgColor,
  iconColor,
}) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${borderColor}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`${bgColor} rounded-full p-4`}>
        <div className={iconColor}>{icon}</div>
      </div>
    </div>
  </div>
);

