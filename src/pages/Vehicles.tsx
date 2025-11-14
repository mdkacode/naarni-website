import React, { useState, useMemo } from "react";
import { message, Button, Input, Select, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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
  
  // Filter states
  const [searchRegistration, setSearchRegistration] = useState("");
  const [selectedFleet, setSelectedFleet] = useState<string | undefined>(undefined);
  const [selectedRoute, setSelectedRoute] = useState<string | undefined>(undefined);
  const [deviceStatusFilter, setDeviceStatusFilter] = useState<string>("all");

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

  // Extract unique fleets and routes for filter dropdowns
  const uniqueFleets = useMemo(() => {
    const fleetMap = new Map<string, string>();
    vehicles.forEach((vehicle) => {
      if (vehicle.fleet?.name && vehicle.fleetId) {
        fleetMap.set(String(vehicle.fleetId), vehicle.fleet.name);
      }
    });
    return Array.from(fleetMap.entries()).map(([id, name]) => ({ id, name }));
  }, [vehicles]);

  const uniqueRoutes = useMemo(() => {
    const routeMap = new Map<string, string>();
    vehicles.forEach((vehicle) => {
      if (vehicle.route?.startCityName && vehicle.route?.endCityName && vehicle.routeId) {
        const routeLabel = `${vehicle.route.startCityName} to ${vehicle.route.endCityName}`;
        routeMap.set(String(vehicle.routeId), routeLabel);
      }
    });
    return Array.from(routeMap.entries()).map(([id, label]) => ({ id, label }));
  }, [vehicles]);

  // Filter vehicles based on search and filters
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      // Registration number search
      if (searchRegistration) {
        const regNumber = vehicle.registrationNumber?.toLowerCase() || "";
        if (!regNumber.includes(searchRegistration.toLowerCase())) {
          return false;
        }
      }

      // Fleet filter
      if (selectedFleet && vehicle.fleetId?.toString() !== selectedFleet) {
        return false;
      }

      // Route filter
      if (selectedRoute && vehicle.routeId?.toString() !== selectedRoute) {
        return false;
      }

      // Device status filter
      if (deviceStatusFilter !== "all") {
        const deviceStatus = vehicle.deviceStatus || vehicle.device?.status;
        if (deviceStatusFilter === "active" && deviceStatus !== "ACTIVE") {
          return false;
        }
        if (deviceStatusFilter === "inactive" && deviceStatus !== "INACTIVE") {
          return false;
        }
        if (deviceStatusFilter === "no_device" && vehicle.deviceId) {
          return false;
        }
      }

      return true;
    });
  }, [vehicles, searchRegistration, selectedFleet, selectedRoute, deviceStatusFilter]);

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
            <StatsCard
              title="Filtered Vehicles"
              value={filteredVehicles.length}
              icon={STATS_ICONS.vehicles}
              borderColor="border-green-500"
              bgColor="bg-green-100"
              iconColor="text-green-600"
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

              {/* Filters */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Input
                      placeholder="Search by Registration"
                      prefix={<SearchOutlined />}
                      value={searchRegistration}
                      onChange={(e) => setSearchRegistration(e.target.value)}
                      allowClear
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Select
                      placeholder="Filter by Fleet"
                      value={selectedFleet}
                      onChange={setSelectedFleet}
                      allowClear
                      style={{ width: "100%" }}
                    >
                      {uniqueFleets.map((fleet) => (
                        <Select.Option key={fleet.id} value={fleet.id}>
                          {fleet.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Select
                      placeholder="Filter by Route"
                      value={selectedRoute}
                      onChange={setSelectedRoute}
                      allowClear
                      style={{ width: "100%" }}
                    >
                      {uniqueRoutes.map((route) => (
                        <Select.Option key={route.id} value={route.id}>
                          {route.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Select
                      placeholder="Filter by Device Status"
                      value={deviceStatusFilter}
                      onChange={setDeviceStatusFilter}
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="all">All Devices</Select.Option>
                      <Select.Option value="active">Active Device</Select.Option>
                      <Select.Option value="inactive">Inactive Device</Select.Option>
                      <Select.Option value="no_device">No Device</Select.Option>
                    </Select>
                  </Col>
                </Row>
              </div>

              {loading ? (
                <LoadingState message="Loading vehicles..." />
              ) : error ? (
                <ErrorState error={error} onRetry={handleRetry} />
              ) : filteredVehicles.length === 0 ? (
                <EmptyState
                  title="No vehicles found"
                  message={vehicles.length === 0 ? "Get started by creating a new vehicle." : "No vehicles match your filters."}
                  icon={EMPTY_STATE_ICON}
                />
              ) : (
                <VehicleList
                  vehicles={filteredVehicles}
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

