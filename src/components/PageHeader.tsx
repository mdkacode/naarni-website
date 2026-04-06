// Page Header Component - Reusable header with title, description, and actions
import React from "react";
import { Row, Col } from "antd";

interface PageHeaderProps {
  title: string;
  description?: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  onToggleSidebar,
  actions,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={16}>
            <div className="flex items-center space-x-4">
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1E40AF] dark:text-blue-400">{title}</h1>
                {description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">{description}</p>
                )}
              </div>
            </div>
          </Col>
          {actions && (
            <Col xs={24} sm={12} md={8}>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end items-center">
                {actions}
              </div>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

