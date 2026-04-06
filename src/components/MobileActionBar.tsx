// Mobile Action Bar Component - Sticky footer for mobile devices
import React  from "react";

interface MobileActionBarProps {
  children: React.ReactNode;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({ children }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg transition-colors">
      <div className="px-4 py-3">
        <div className="flex gap-3 justify-center items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

