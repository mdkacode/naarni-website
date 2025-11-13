import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useVehicles } from "../hooks/useVehicles";
import { Sidebar } from "../components/Sidebar";
import { VehicleList } from "../components/VehicleList";
import { VehicleForm } from "../components/VehicleForm";
import { StatsCard } from "../components/StatsCard";
import { VehicleDetailsModal } from "../components/VehicleDetailsModal";
import type { Vehicle } from "../types/vehicle";

const STATS_ICONS = {
  vehicles: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const LoadingState = () => (
  <div className="flex justify-center items-center py-20">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading vehicles...</p>
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by creating a new vehicle.</p>
  </div>
);

const Vehicles: React.FC = () => {
  const { token, logout } = useAuth();
  const { vehicles, loading, error, fetchVehicles, createVehicle, updateVehicle, associateFleet, disassociateFleet, associateRoute, disassociateRoute } = useVehicles(token);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleCreate = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      await createVehicle(data);
      setShowForm(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleRetry = () => {
    fetchVehicles();
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailsModalVisible(true);
  };

  const handleDetailsModalCancel = () => {
    setDetailsModalVisible(false);
    setSelectedVehicle(null);
  };

  const handleAssociate = async (vehicleId: number, fleetId: number) => {
    await associateFleet(vehicleId, fleetId);
    fetchVehicles(); // Refresh the list
  };

  const handleDisassociate = async (vehicleId: number) => {
    await disassociateFleet(vehicleId);
    fetchVehicles(); // Refresh the list
  };

  const handleUpdate = async (vehicleId: number, data: Partial<Vehicle>) => {
    await updateVehicle(vehicleId, data);
    // Update the selected vehicle in state to reflect changes
    if (selectedVehicle?.id === vehicleId) {
      setSelectedVehicle({ ...selectedVehicle, ...data });
    }
    fetchVehicles(); // Refresh the list
  };

  const handleAssociateRoute = async (vehicleId: number, routeId: number, notes?: string) => {
    await associateRoute(vehicleId, routeId, notes);
    fetchVehicles(); // Refresh the list
  };

  const handleDisassociateRoute = async (vehicleId: number, routeId: number, reason?: string) => {
    await disassociateRoute(vehicleId, routeId, reason);
    fetchVehicles(); // Refresh the list
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
                  <h1 className="text-3xl font-bold text-[#1E40AF]">Vehicles</h1>
                  <p className="text-gray-600 mt-1">Vehicle Management System</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCreate}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  + Create Vehicle
                </button>
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
          {/* Stats Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Vehicles"
              value={vehicles.length}
              icon={STATS_ICONS.vehicles}
              borderColor="border-blue-500"
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
          </div>

          {/* Vehicle List or Form */}
          {showForm ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6">
              <h2 className="text-2xl font-bold text-[#1E40AF] mb-6">Create New Vehicle</h2>
              <VehicleForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={formLoading}
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <h2 className="text-2xl font-bold text-[#1E40AF]">Vehicle List</h2>
                <p className="text-gray-600 mt-1">Manage and view all vehicles</p>
              </div>

              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={handleRetry} />
              ) : vehicles.length === 0 ? (
                <EmptyState />
              ) : (
                <VehicleList
                  vehicles={vehicles}
                  loading={loading}
                  onViewDetails={handleViewDetails}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Details Modal */}
      <VehicleDetailsModal
        visible={detailsModalVisible}
        vehicle={selectedVehicle}
        onCancel={handleDetailsModalCancel}
        onUpdate={handleUpdate}
        onAssociate={handleAssociate}
        onDisassociate={handleDisassociate}
        onAssociateRoute={handleAssociateRoute}
        onDisassociateRoute={handleDisassociateRoute}
      />
    </div>
  );
};

export default Vehicles;

