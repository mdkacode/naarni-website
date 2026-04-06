// Page Layout Component - Wraps sidebar and main content
import React from "react";
import { Sidebar } from "./Sidebar";

interface PageLayoutProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  sidebarOpen,
  onToggleSidebar,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex transition-colors">
      <Sidebar isOpen={sidebarOpen} onToggle={onToggleSidebar} />
      <div className="flex-1 lg:ml-64">
        {children}
      </div>
    </div>
  );
};

