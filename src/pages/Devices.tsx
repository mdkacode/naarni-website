import React, { useState } from "react";
import { Card, message } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useDevices } from "../hooks/useDevices";
import { Sidebar } from "../components/Sidebar";
import { DeviceList } from "../components/DeviceList";
import { DeviceForm } from "../components/DeviceForm";
import { StatsCard } from "../components/StatsCard";
import { Pagination } from "../components/Pagination";
import type { DeviceCreateRequest } from "../types/device";

const STATS_ICONS = {
  devices: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
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
      <p className="text-gray-600">Loading devices...</p>
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No devices found</h3>
    <p className="mt-1 text-sm text-gray-500">No vehicle devices have been registered yet.</p>
  </div>
);

const Devices: React.FC = () => {
  const { token, logout } = useAuth();
  const { devices, loading, error, currentPage, totalPages, totalElements, fetchDevices, createDevice } = useDevices(token);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handlePageChange = (page: number) => {
    fetchDevices(page);
  };

  const handleRetry = () => {
    fetchDevices(currentPage);
  };

  const handleCreate = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = async (data: DeviceCreateRequest) => {
    setFormLoading(true);
    try {
      await createDevice(data);
      message.success("Device created successfully");
      setShowForm(false);
    } catch (err: any) {
      console.error("Error creating device:", err);
      // Error is handled by DeviceForm component
      throw err;
    } finally {
      setFormLoading(false);
    }
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
                  <h1 className="text-3xl font-bold text-[#1E40AF]">Devices</h1>
                  <p className="text-gray-600 mt-1">Vehicle Device Management</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {!showForm && (
                  <button
                    onClick={handleCreate}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    + Create Device
                  </button>
                )}
                <button
                  onClick={logout}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Devices"
              value={totalElements}
              icon={STATS_ICONS.devices}
              borderColor="border-blue-500"
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatsCard
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
            />
          </div>

          {/* Device Form or List */}
          {showForm ? (
            <Card id="device-form-card" className="shadow-xl">
              <h2 className="text-2xl font-bold text-[#1E40AF] mb-6">
                Create New Device
              </h2>
              <DeviceForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={formLoading}
              />
            </Card>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 className="text-2xl font-bold text-[#1E40AF]">Device List</h2>
              <p className="text-gray-600 mt-1">Manage and view all vehicle devices</p>
            </div>

            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} onRetry={handleRetry} />
            ) : devices.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <DeviceList devices={devices} loading={loading} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Devices;

