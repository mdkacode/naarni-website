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
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 ${borderColor} transition-colors`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
      </div>
      <div className={`${bgColor} dark:bg-gray-700 rounded-full p-4 transition-colors`}>
        <div className={iconColor}>{icon}</div>
      </div>
    </div>
  </div>
);

