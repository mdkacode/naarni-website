import React, { useState } from "react";
import { message, Button } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useDevices } from "../hooks/useDevices";
import { PageLayout } from "../components/PageLayout";
import { PageHeader } from "../components/PageHeader";
import { PageContent } from "../components/PageContent";
import { LoadingState, ErrorState, EmptyState } from "../components/PageStates";
import { DeviceList } from "../components/DeviceList";
import { DeviceForm } from "../components/DeviceForm";
import { StatsCard } from "../components/StatsCard";
import { Pagination } from "../components/Pagination";
import type { DeviceCreateRequest, VehicleDevice } from "../types/device";

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

const EMPTY_STATE_ICON = (
  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const Devices: React.FC = () => {
  const { token, logout } = useAuth();
  const { devices, loading, error, currentPage, totalPages, totalElements, fetchDevices, createDevice, deleteDevice } = useDevices(token);
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

  const handleDelete = async (device: VehicleDevice) => {
    if (!device.id) return;
    
    try {
      await deleteDevice(device.id);
      message.success(`Device ${device.deviceId || device.id} deleted successfully`);
    } catch (err: any) {
      message.error(err?.message || "Failed to delete device");
    }
  }

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    >
      <PageHeader
        title="Devices"
        description="Vehicle Device Management"
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
                + Create Device
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#1E40AF] dark:text-blue-400 mb-6">
                  Create New Device
                </h2>
                <DeviceForm
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  loading={formLoading}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800">
              <h2 className="text-2xl font-bold text-[#1E40AF] dark:text-blue-400">Device List</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and view all vehicle devices</p>
            </div>

            {loading ? (
              <LoadingState message="Loading devices..." />
            ) : error ? (
              <ErrorState error={error} onRetry={handleRetry} />
            ) : devices.length === 0 ? (
              <EmptyState
                title="No devices found"
                message="No vehicle devices have been registered yet."
                icon={EMPTY_STATE_ICON}
              />
            ) : (
              <>
                <DeviceList devices={devices} loading={loading} onDelete={handleDelete} />
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

export default Devices;

