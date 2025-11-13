import React, { useState } from "react";
import { Button, message } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useFleets } from "../hooks/useFleets";
import { PageLayout } from "../components/PageLayout";
import { PageHeader } from "../components/PageHeader";
import { PageContent } from "../components/PageContent";
import { LoadingState, ErrorState, EmptyState } from "../components/PageStates";
import { FleetList } from "../components/FleetList";
import { FleetForm } from "../components/FleetForm";
import { StatsCard } from "../components/StatsCard";
import { Pagination } from "../components/Pagination";

const STATS_ICONS = {
  fleets: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
};

const EMPTY_STATE_ICON = (
  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const AdminDashboard: React.FC = () => {
  const { token, logout } = useAuth();
  const { fleets, loading, error, currentPage, totalPages, totalElements, fetchFleets, createFleet } = useFleets(token);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handlePageChange = (page: number) => {
    fetchFleets(page);
  };

  const handleRetry = () => {
    fetchFleets(currentPage);
  };

  const handleCreate = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      await createFleet(data);
      message.success("Fleet created successfully");
      setShowForm(false);
    } catch (err: any) {
      // Error is handled by FleetForm component
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    >
      <PageHeader
        title="Admin Dashboard"
        description="Fleet Management System"
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        actions={
          <>
            {!showForm && (
              <Button
                type="primary"
                size="large"
                onClick={handleCreate}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                + Create Fleet
              </Button>
            )}
            <Button
              type="primary"
              danger
              size="large"
              onClick={logout}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Logout
            </Button>
          </>
        }
      />

      <PageContent>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Fleets"
            value={totalElements}
            icon={STATS_ICONS.fleets}
            borderColor="border-blue-500"
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          {/* <StatsCard
            title="Current Page"
            value={`${currentPage + 1} / ${totalPages || 1}`}
            icon={STATS_ICONS.page}
            borderColor="border-green-500"
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatsCard
            title="Items Per Page"
            value={20}
            icon={STATS_ICONS.limit}
            borderColor="border-purple-500"
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          /> */}
        </div>

        {/* Fleet Form or List */}
        {showForm ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#1E40AF] dark:text-blue-400 mb-6">
                Create New Fleet
              </h2>
              <FleetForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={formLoading}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800">
              <h2 className="text-2xl font-bold text-[#1E40AF] dark:text-blue-400">Fleet List</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and view all registered fleets</p>
            </div>

            {loading ? (
              <LoadingState message="Loading fleets..." />
            ) : error ? (
              <ErrorState error={error} onRetry={handleRetry} />
            ) : fleets.length === 0 ? (
              <EmptyState
                title="No fleets found"
                message="Get started by registering a new fleet."
                icon={EMPTY_STATE_ICON}
              />
            ) : (
              <>
                <FleetList fleets={fleets} loading={loading} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        )}
      </PageContent>
    </PageLayout>
  );
};

export default AdminDashboard;
