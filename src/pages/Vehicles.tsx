import React, { useState } from "react";
import { message, Button } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useVehicles } from "../hooks/useVehicles";
import { PageLayout } from "../components/PageLayout";
import { PageHeader } from "../components/PageHeader";
import { PageContent } from "../components/PageContent";
import { LoadingState, ErrorState, EmptyState } from "../components/PageStates";
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

const EMPTY_STATE_ICON = (
  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Vehicles: React.FC = () => {
  const { token, logout } = useAuth();
  const { vehicles, loading, error, fetchVehicles, createVehicle, updateVehicle, deleteVehicle, associateFleet, disassociateFleet, associateRoute, disassociateRoute, associateDevice, disassociateDevice } = useVehicles(token);
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

  const handleAssociateDevice = async (vehicleId: number, deviceId: number, installedBy: string) => {
    await associateDevice(vehicleId, deviceId, installedBy);
    fetchVehicles(); // Refresh the list
  };

  const handleDisassociateDevice = async (vehicleId: number, deviceId: number, uninstalledBy?: string, reason?: string) => {
    await disassociateDevice(vehicleId, deviceId, uninstalledBy, reason);
    fetchVehicles(); // Refresh the list
  };

  const handleDelete = async (vehicle: Vehicle) => {
    console.log("handleDelete called with vehicle:", vehicle);
    if (!vehicle.id) {
      console.error("Vehicle ID is missing");
      return;
    }
    try {
      console.log("Calling deleteVehicle with ID:", vehicle.id);
      await deleteVehicle(vehicle.id);
      console.log("Vehicle deleted successfully");
      message.success(`Vehicle "${vehicle.registrationNumber || `#${vehicle.id}`}" deleted successfully`);
      // Close modal if the deleted vehicle is currently selected
      if (selectedVehicle?.id === vehicle.id) {
        setDetailsModalVisible(false);
        setSelectedVehicle(null);
      }
    } catch (err: any) {
      console.error("Error deleting vehicle:", err);
      message.error(err?.message || "Failed to delete vehicle");
      throw err; // Re-throw to let Modal know the operation failed
    }
  };

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    >
      <PageHeader
        title="Vehicles"
        description="Vehicle Management System"
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        actions={
          <>
            <Button
              type="primary"
              size="large"
              onClick={handleCreate}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              + Create Vehicle
            </Button>
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#1E40AF] dark:text-blue-400 mb-6">Create New Vehicle</h2>
                <VehicleForm
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  loading={formLoading}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800">
                <h2 className="text-2xl font-bold text-[#1E40AF] dark:text-blue-400">Vehicle List</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and view all vehicles</p>
              </div>

              {loading ? (
                <LoadingState message="Loading vehicles..." />
              ) : error ? (
                <ErrorState error={error} onRetry={handleRetry} />
              ) : vehicles.length === 0 ? (
                <EmptyState
                  title="No vehicles found"
                  message="Get started by creating a new vehicle."
                  icon={EMPTY_STATE_ICON}
                />
              ) : (
                <VehicleList
                  vehicles={vehicles}
                  loading={loading}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDelete}
                />
              )}
            </div>
          )}
      </PageContent>

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
        onAssociateDevice={handleAssociateDevice}
        onDisassociateDevice={handleDisassociateDevice}
      />
    </PageLayout>
  );
};

export default Vehicles;

