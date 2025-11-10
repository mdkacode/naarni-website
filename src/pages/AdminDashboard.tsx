import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useFleets } from "../hooks/useFleets";
import { FleetList } from "../components/FleetList";
import { StatsCard } from "../components/StatsCard";
import { Pagination } from "../components/Pagination";
import { Sidebar } from "../components/Sidebar";

const STATS_ICONS = {
  fleets: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  page: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  limit: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
};

const LoadingState = () => (
  <div className="flex justify-center items-center py-20">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading fleets...</p>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="p-6">
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {error}
    </div>
    <button
      onClick={onRetry}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Retry
    </button>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20">
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No fleets found</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by registering a new fleet.</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  const { token, logout } = useAuth();
  const { fleets, loading, error, currentPage, totalPages, totalElements, fetchFleets } = useFleets(token);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePageChange = (page: number) => {
    fetchFleets(page);
  };

  const handleRetry = () => {
    fetchFleets(currentPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-[#1E40AF]">Admin Dashboard</h1>
                  <p className="text-gray-600 mt-1">Fleet Management System</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Fleet List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-2xl font-bold text-[#1E40AF]">Fleet List</h2>
            <p className="text-gray-600 mt-1">Manage and view all registered fleets</p>
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={handleRetry} />
          ) : fleets.length === 0 ? (
            <EmptyState />
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
