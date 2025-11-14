// Vehicle Details Modal Component
import React, { useState, useEffect, useMemo } from "react";
import { Modal, Tabs, Button, Space, Form, Select, InputNumber, Input, message, Table, Tag, Divider } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import type { Vehicle, VehicleFilterRequest } from "../types/vehicle";
import type { VehicleGoal, VehicleGoalCreateRequest } from "../types/vehicleGoal";
import type { Route } from "../types/route";
import { useFleets } from "../hooks/useFleets";
import { useRoutes } from "../hooks/useRoutes";
import { useDevices } from "../hooks/useDevices";
import { useCities } from "../hooks/useCities";
import { useAuth } from "../hooks/useAuth";
import { vehicleGoalService } from "../services/vehicleGoalService";
import { vehicleService } from "../services/vehicleService";

const { Option } = Select;

const MAKE_MODEL_OPTIONS = [
  { value: "A_12_M", label: "AZAD 12 M Luxury Intercity AC Coach" },
  { value: "A_12.5_M", label: "AZAD 12.5 M Luxury intercity AC Coach - seater cum sleeper" },
];

interface VehicleDetailsModalProps {
  visible: boolean;
  vehicle: Vehicle | null;
  onCancel: () => void;
  onUpdate?: (vehicleId: number, data: Partial<Vehicle>) => Promise<void>;
  onAssociate: (vehicleId: number, fleetId: number) => Promise<void>;
  onDisassociate: (vehicleId: number) => Promise<void>;
  onAssociateRoute?: (vehicleId: number, routeId: number, notes?: string) => Promise<void>;
  onDisassociateRoute?: (vehicleId: number, routeId: number, reason?: string) => Promise<void>;
  onAssociateDevice?: (vehicleId: number, deviceId: number, installedBy: string) => Promise<void>;
  onDisassociateDevice?: (vehicleId: number, deviceId: number, uninstalledBy?: string, reason?: string) => Promise<void>;
}

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const;

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  visible,
  vehicle,
  onCancel,
  onUpdate,
  onAssociate,
  onDisassociate,
  onAssociateRoute,
  onDisassociateRoute,
  onAssociateDevice,
  onDisassociateDevice,
}) => {
  const { token } = useAuth();
  const { fleets, loading: fleetsLoading } = useFleets(token);
  const { routes, loading: routesLoading } = useRoutes(token);
  const { devices, loading: devicesLoading } = useDevices(token);
  const { cities, fetchCities } = useCities(token);
  const [form] = Form.useForm();
  const [vehicleForm] = Form.useForm();
  const [goalForm] = Form.useForm();
  const [routeForm] = Form.useForm();
  const [disassociateRouteForm] = Form.useForm();
  const [associateDeviceForm] = Form.useForm();
  const [disassociateDeviceForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [goals, setGoals] = useState<VehicleGoal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [filteredDataLoading, setFilteredDataLoading] = useState(false);
  const [enrichedVehicle, setEnrichedVehicle] = useState<Vehicle | null>(null);

  // Fetch cities on mount
  useEffect(() => {
    if (token) {
      fetchCities(0, 1000);
    }
  }, [token, fetchCities]);

  // Create a map of city ID to city name for quick lookup
  const cityMap = useMemo(() => {
    const map = new Map<number, string>();
    cities.forEach((city) => {
      if (city.id && city.name) {
        map.set(city.id, city.name);
      }
    });
    return map;
  }, [cities]);

  // Helper function to get route display name
  const getRouteDisplayName = (route: Route): string => {
    const startCityName = route.startCityName || cityMap.get(route.startCityId || 0) || "N/A";
    const endCityName = route.endCityName || cityMap.get(route.endCityId || 0) || "N/A";
    return `${startCityName} to ${endCityName}`;
  };

  useEffect(() => {
    if (visible && vehicle?.id) {
      fetchGoals();
      fetchFilteredVehicleData();
      form.resetFields();
      goalForm.resetFields();
      routeForm.resetFields();
      disassociateRouteForm.resetFields();
      associateDeviceForm.resetFields();
      disassociateDeviceForm.resetFields();
      setIsEditMode(false);
      
      // Set initial form values for vehicle edit
      if (vehicle) {
        // Combine make and model for display (e.g., "AZAD 12 CM" -> "12 CM")
        const model = vehicle.model || "";
        const makeModel = model || (vehicle.make ? vehicle.make : "");
        vehicleForm.setFieldsValue({
          registrationNumber: vehicle.registrationNumber,
          makeModel: makeModel || undefined,
          year: vehicle.year,
          capacity: vehicle.capacity,
          status: vehicle.status,
          fleetId: vehicle.fleetId,
          isActive: vehicle.isActive !== undefined ? vehicle.isActive : true,
        });
        
        // Set initial values for disassociate route form if vehicle has a route
        if (vehicle.routeId) {
          disassociateRouteForm.setFieldsValue({
            routeId: vehicle.routeId,
            reason: "",
          });
        }
      }
    }
  }, [visible, vehicle?.id, vehicle]);

  const fetchFilteredVehicleData = async () => {
    if (!vehicle?.id || !token || !vehicle.registrationNumber) return;
    
    setFilteredDataLoading(true);
    try {
      const filterRequest: VehicleFilterRequest = {
        filterContext: {
          registrationNumbers: [vehicle.registrationNumber]
        },
        select: ["FLEET_ID", "OPERATOR_ID", "ROUTE_ID", "DEVICE_ID", "VEHICLE", "FLEET", "ROUTE", "DEVICE"]
      };
      
      const response = await vehicleService.getVehicleFilter(token, filterRequest);
      
      if (response.body) {
        setFilteredData(response.body);
        
        // Enrich vehicle data with related entities
        const vehicleData = response.body.vehicles?.[0] || vehicle;
        if (!vehicleData || !vehicleData.id) {
          setEnrichedVehicle(vehicle);
          return;
        }
        
        const fleetMap = new Map((response.body.fleets || []).map((f: any) => [f.id, f]));
        const deviceMap = new Map((response.body.devices || []).map((d: any) => [d.id, d]));
        const routeMap = new Map((response.body.routes || []).map((r: any) => [r.id, r]));
        
        // Get related IDs from mapping objects
        const vehicleToActiveDeviceIds = response.body.vehicleToActiveDeviceIds || {};
        const vehicleToRouteIds = response.body.vehicleToRouteIds || {};
        
        const vehicleIdStr = String(vehicleData.id);
        const activeDeviceId = vehicleToActiveDeviceIds[vehicleIdStr];
        const routeIds = vehicleToRouteIds[vehicleIdStr];
        const firstRouteId = routeIds ? Object.keys(routeIds)[0] : null;
        
        const enriched: Vehicle = {
          ...vehicleData,
          fleet: vehicleData.fleetId ? (fleetMap.get(vehicleData.fleetId) || vehicleData.fleet) : vehicleData.fleet,
          device: activeDeviceId ? (deviceMap.get(activeDeviceId) || vehicleData.device) : vehicleData.device,
          route: firstRouteId ? (routeMap.get(Number(firstRouteId)) || vehicleData.route) : vehicleData.route,
        };
        
        setEnrichedVehicle(enriched);
      }
    } catch (error: any) {
      console.error("Failed to fetch filtered vehicle data:", error);
      // Don't show error to user, just use the vehicle data we have
      setEnrichedVehicle(vehicle);
    } finally {
      setFilteredDataLoading(false);
    }
  };

  const fetchGoals = async () => {
    if (!vehicle?.id || !token) return;
    
    setGoalsLoading(true);
    try {
      const response = await vehicleGoalService.getVehicleGoals(token, vehicle.id);
      const goalsData = vehicleGoalService.extractGoalData(response);
      setGoals(goalsData);
    } catch (error: any) {
      message.error(error?.message || "Failed to fetch goals");
    } finally {
      setGoalsLoading(false);
    }
  };

  const handleAssociateFleet = async () => {
    if (!vehicle?.id) return;
    
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      await onAssociate(vehicle.id, values.fleetId);
      message.success("Fleet associated successfully");
      form.resetFields();
    } catch (error: any) {
      const errorMessage = error?.errorMessage || error?.message || "Operation failed";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisassociateFleet = async () => {
    if (!vehicle?.id) return;
    
    try {
      setSubmitting(true);
      await onDisassociate(vehicle.id);
      message.success("Fleet disassociated successfully");
    } catch (error: any) {
      const errorMessage = error?.errorMessage || error?.message || "Operation failed";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form to original vehicle values
    if (vehicle) {
      const model = vehicle.model || "";
      const makeModel = model || (vehicle.make ? vehicle.make : "");
      vehicleForm.setFieldsValue({
        registrationNumber: vehicle.registrationNumber,
        makeModel: makeModel || undefined,
        year: vehicle.year,
        capacity: vehicle.capacity,
        status: vehicle.status,
        fleetId: vehicle.fleetId,
        isActive: vehicle.isActive !== undefined ? vehicle.isActive : true,
      });
    }
  };

  const handleSaveVehicle = async () => {
    if (!vehicle?.id || !onUpdate) return;
    
    try {
      setSubmitting(true);
      const values = await vehicleForm.validateFields();
      
      // Parse makeModel - the selected value is the model (e.g., "12 CM" or "12.5 CM")
      // Make is always "AZAD" as per API structure
      const model = values.makeModel || "";
      
      const updateData: Partial<Vehicle> = {
        id: vehicle.id,
        registrationNumber: values.registrationNumber,
        make: "AZAD",
        model: model,
        year: values.year,
        fleetId: values.fleetId,
        createdAt: vehicle.createdAt,
        lastModifiedAt: vehicle.lastModifiedAt,
      };
      
      await onUpdate(vehicle.id, updateData);
      message.success("Vehicle updated successfully");
      setIsEditMode(false);
    } catch (error: any) {
      if (error?.errorFields) {
        // Form validation error
        return;
      }
      const errorMessage = error?.errorMessage || error?.message || "Failed to update vehicle";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateGoal = async (values: any) => {
    if (!vehicle?.id || !token) return;
    
    try {
      setSubmitting(true);
      const goalData: VehicleGoalCreateRequest = {
        vehicleId: vehicle.id,
        routeId: values.routeId,
        day: values.day,
        targetKmRun: values.targetKmRun,
        isActive: true,
      };
      
      await vehicleGoalService.createVehicleGoal(token, goalData);
      message.success("Goal created successfully");
      goalForm.resetFields();
      await fetchGoals();
    } catch (error: any) {
      const errorMessage = error?.errorMessage || error?.message || "Failed to create goal";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssociateRoute = async () => {
    if (!vehicle?.id || !onAssociateRoute) return;
    
    try {
      setSubmitting(true);
      const values = await routeForm.validateFields();
      await onAssociateRoute(vehicle.id, values.routeId, values.notes);
      message.success("Route associated successfully");
      routeForm.resetFields();
    } catch (error: any) {
      if (error?.errorFields) {
        // Form validation error
        return;
      }
      const errorMessage = error?.errorMessage || error?.message || "Failed to associate route";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssociateDevice = async (values: any) => {
    if (!vehicle?.id || !onAssociateDevice) return;
    
    try {
      setSubmitting(true);
      // Replace spaces with underscores in installedBy
      const installedBy = values.installedBy.replace(/\s+/g, '_');
      await onAssociateDevice(vehicle.id, values.deviceId, installedBy);
      message.success("Device associated successfully");
      associateDeviceForm.resetFields();
      await fetchFilteredVehicleData(); // Refresh vehicle data
    } catch (error: any) {
      const errorMessage = error?.errorMessage || error?.message || "Failed to associate device";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisassociateDevice = async () => {
    if (!vehicle?.id || !onDisassociateDevice) return;
    
    try {
      setSubmitting(true);
      const values = await disassociateDeviceForm.validateFields();
      // Get device ID from form or vehicle data
      const deviceId = values.deviceId || vehicleDevice?.id || vehicle.deviceId;
      if (!deviceId) {
        message.error("Device ID not found");
        return;
      }
      
      // Replace spaces with underscores in uninstalledBy if provided
      const uninstalledBy = values.uninstalledBy ? values.uninstalledBy.replace(/\s+/g, '_') : undefined;
      
      await onDisassociateDevice(vehicle.id, deviceId, uninstalledBy, values.reason);
      message.success("Device disassociated successfully");
      disassociateDeviceForm.resetFields();
      await fetchFilteredVehicleData(); // Refresh vehicle data
    } catch (error: any) {
      if (error?.errorFields) {
        // Form validation error
        return;
      }
      const errorMessage = error?.errorMessage || error?.message || "Failed to disassociate device";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisassociateRoute = async () => {
    if (!vehicle?.id || !onDisassociateRoute) return;
    
    try {
      setSubmitting(true);
      const values = await disassociateRouteForm.validateFields();
      await onDisassociateRoute(vehicle.id, values.routeId, values.reason);
      message.success("Route disassociated successfully");
      disassociateRouteForm.resetFields();
    } catch (error: any) {
      if (error?.errorFields) {
        // Form validation error
        return;
      }
      const errorMessage = error?.errorMessage || error?.message || "Failed to disassociate route";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const goalColumns = [
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      render: (day: string) => <Tag color="blue">{day}</Tag>,
    },
    {
      title: "Route",
      key: "route",
      render: (_: any, record: VehicleGoal) => {
        const route = routes.find(r => r.id === record.routeId);
        return route?.name || `Route ID: ${record.routeId}`;
      },
    },
    {
      title: "Target (km)",
      dataIndex: "targetKmRun",
      key: "targetKmRun",
      render: (value: number) => `${value} km`,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "default"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Effective From",
      dataIndex: "effectiveFrom",
      key: "effectiveFrom",
      render: (value: string) => value ? new Date(value).toLocaleDateString() : "N/A",
    },
  ];

  if (!vehicle) return null;

  // Use enriched vehicle data if available, otherwise fall back to original vehicle
  const displayVehicle = enrichedVehicle || vehicle;
  const vehicleRoute = displayVehicle.route || (filteredData?.routes?.[0]);
  const vehicleDevice = displayVehicle.device || (filteredData?.devices?.[0]);
  const vehicleFleet = displayVehicle.fleet || (filteredData?.fleets?.[0]);

  return (
    <Modal
      title={`Vehicle Details - ${displayVehicle.registrationNumber || `#${displayVehicle.id}`}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      style={{ top: 20 }}
      bodyStyle={{ padding: '16px' }}
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        size="small"
        items={[
          {
            key: "details",
            label: "Details",
            children: (
              <div className="space-y-2">
                <div className="flex justify-end mb-1">
                  {!isEditMode ? (
                    <Button
                      icon={<EditOutlined />}
                      onClick={handleEdit}
                      type="primary"
                      size="middle"
                    >
                      Edit Vehicle
                    </Button>
                  ) : (
                    <Space>
                      <Button
                        icon={<CloseOutlined />}
                        onClick={handleCancelEdit}
                        disabled={submitting}
                        size="middle"
                      >
                        Cancel
                      </Button>
                      <Button
                        icon={<SaveOutlined />}
                        onClick={handleSaveVehicle}
                        type="primary"
                        loading={submitting}
                        size="middle"
                      >
                        Save Changes
                      </Button>
                    </Space>
                  )}
                </div>

                {isEditMode ? (
                  <Form
                    form={vehicleForm}
                    layout="vertical"
                    className="space-y-4"
                  >
                <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        label="Registration Number"
                        name="registrationNumber"
                        rules={[{ required: true, message: "Please enter registration number" }]}
                      >
                        <Input placeholder="Enter registration number" size="large" />
                      </Form.Item>

                      <Form.Item
                        label="Make/Model"
                        name="makeModel"
                        rules={[{ required: true, message: "Please select make/model" }]}
                      >
                        <Select placeholder="Select Make/Model" size="large">
                          {MAKE_MODEL_OPTIONS.map((option) => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label="Year"
                        name="year"
                        rules={[
                          { required: true, message: "Please enter year" },
                          { type: "number", min: 1900, max: 2100, message: "Please enter a valid year" },
                        ]}
                      >
                        <InputNumber
                          className="w-full"
                          placeholder="Enter year"
                          min={1900}
                          max={2100}
                          size="large"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Fleet"
                        name="fleetId"
                      >
                        <Select
                          placeholder="Select fleet"
                          loading={fleetsLoading}
                          showSearch
                          optionFilterProp="children"
                          allowClear
                          size="large"
                        >
                          {fleets.map((fleet) => (
                            <Option key={fleet.id} value={fleet.id}>
                              {fleet.name} {fleet.organizationName ? `(${fleet.organizationName})` : ""}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </Form>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-0">Registration Number</p>
                        <p className="font-semibold text-sm leading-tight">{displayVehicle.registrationNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0">Make/Model</p>
                        <p className="font-semibold text-sm leading-tight">
                          {displayVehicle.make || "N/A"} {displayVehicle.model ? displayVehicle.model : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0">Year</p>
                        <p className="font-semibold text-sm leading-tight">{displayVehicle.year || "N/A"}</p>
                      </div>
                    </div>

                    <Divider className="my-2" style={{ marginTop: '8px', marginBottom: '8px' }}>Related Information</Divider>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-0">Fleet</p>
                        <p className="font-semibold text-sm leading-tight">
                          {vehicleFleet?.name || (displayVehicle.fleetId ? `Fleet ID: ${displayVehicle.fleetId}` : "N/A")}
                        </p>
                        {vehicleFleet?.description && (
                          <p className="text-xs text-gray-400 leading-tight">{vehicleFleet.description}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0">Device</p>
                        <p className="font-semibold text-sm leading-tight">
                          {vehicleDevice ? (
                            <>
                              {vehicleDevice.deviceId || vehicleDevice.id ? `Device ID: ${vehicleDevice.deviceId || vehicleDevice.id}` : "N/A"}
                              {vehicleDevice.model && ` - ${vehicleDevice.model}`}
                            </>
                          ) : (displayVehicle.deviceId ? `Device ID: ${displayVehicle.deviceId}` : "N/A")}
                        </p>
                        {vehicleDevice && (
                          <p className="text-xs text-gray-400 leading-tight">
                            {vehicleDevice.manufacturer && <span>{vehicleDevice.manufacturer}</span>}
                            {vehicleDevice.deviceType && <span className="ml-1.5">({vehicleDevice.deviceType})</span>}
                            {vehicleDevice.status && <span className="ml-1.5">- {vehicleDevice.status}</span>}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0">Route</p>
                        <p className="font-semibold text-sm leading-tight">
                          {vehicleRoute?.name || (displayVehicle.routeId ? `Route ID: ${displayVehicle.routeId}` : "N/A")}
                        </p>
                        {vehicleRoute?.description && (
                          <p className="text-xs text-gray-400 leading-tight">{vehicleRoute.description}</p>
                        )}
                        {vehicleRoute && (
                          <p className="text-xs text-gray-400 leading-tight">
                            {vehicleRoute.startCityName && vehicleRoute.endCityName && (
                              <span>{vehicleRoute.startCityName} → {vehicleRoute.endCityName}</span>
                            )}
                            {vehicleRoute.distance && <span className="ml-1.5">({vehicleRoute.distance} km)</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ),
          },
          {
            key: "fleet",
            label: "Fleet Management",
            children: (
              <div className="space-y-2">
                <div className="space-y-2">
                  {(displayVehicle.fleetId || vehicleFleet) ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Current Fleet: <strong>{vehicleFleet?.name || displayVehicle.fleet?.name || `Fleet ID: ${displayVehicle.fleetId}`}</strong>
                        {vehicleFleet?.description && (
                          <span className="text-gray-500 ml-2">- {vehicleFleet.description}</span>
                        )}
                      </p>
                      <Space>
                        <Form form={form} layout="inline" onFinish={handleAssociateFleet}>
                          <Form.Item
                            name="fleetId"
                            rules={[{ required: true, message: "Please select a fleet" }]}
                          >
                            <Select
                              placeholder="Select new fleet"
                              loading={fleetsLoading}
                              showSearch
                              optionFilterProp="children"
                              style={{ width: 200 }}
                            >
                              {fleets.map((fleet) => (
                                <Option key={fleet.id} value={fleet.id}>
                                  {fleet.name} {fleet.organizationName ? `(${fleet.organizationName})` : ""}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                              Associate Fleet
                            </Button>
                          </Form.Item>
                        </Form>
                        <Button
                          danger
                          onClick={handleDisassociateFleet}
                          loading={submitting}
                        >
                          Disassociate Fleet
                        </Button>
                      </Space>
                    </div>
                  ) : (
                    <Form form={form} layout="inline" onFinish={handleAssociateFleet}>
                      <Form.Item
                        name="fleetId"
                        rules={[{ required: true, message: "Please select a fleet" }]}
                      >
                        <Select
                          placeholder="Select fleet"
                          loading={fleetsLoading}
                          showSearch
                          optionFilterProp="children"
                          style={{ width: 200 }}
                        >
                          {fleets.map((fleet) => (
                            <Option key={fleet.id} value={fleet.id}>
                              {fleet.name} {fleet.organizationName ? `(${fleet.organizationName})` : ""}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting}>
                          Associate Fleet
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "devices",
            label: "Device Management",
            children: (
              <div className="space-y-1">
                {(vehicleDevice || displayVehicle.deviceId) ? (
                  <div>
                    <Divider className="my-1" style={{ marginTop: '4px', marginBottom: '4px' }}>Disassociate Device</Divider>
                    
                    <Form
                      form={disassociateDeviceForm}
                      layout="vertical"
                      onFinish={handleDisassociateDevice}
                      size="small"
                      initialValues={{ 
                        deviceId: vehicleDevice?.id || displayVehicle.deviceId 
                      }}
                    >
                      <Form.Item
                        label="Device"
                        name="deviceId"
                        rules={[{ required: true, message: "Device ID is required" }]}
                        style={{ marginBottom: '12px' }}
                      >
                        <Select
                          placeholder="Device"
                          size="middle"
                          disabled
                        >
                          <Option value={vehicleDevice?.id || displayVehicle.deviceId}>
                            Device ID: {vehicleDevice?.deviceId || vehicleDevice?.id || displayVehicle.deviceId}
                            {vehicleDevice?.serialNumber ? ` (${vehicleDevice.serialNumber})` : ''}
                          </Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label="Uninstalled By (Optional)"
                        name="uninstalledBy"
                        style={{ marginBottom: '12px' }}
                      >
                        <Select
                          placeholder="Select uninstalled by"
                          size="middle"
                          showSearch
                          optionFilterProp="children"
                        >
                          <Option value="ADMIN">ADMIN</Option>
                          {fleets.map((fleet) => (
                            <Option key={fleet.id} value={fleet.name}>
                              {fleet.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label="Reason (Optional)"
                        name="reason"
                        style={{ marginBottom: '12px' }}
                      >
                        <TextArea
                          placeholder="Enter reason for disassociation"
                          rows={2}
                          size="middle"
                        />
                      </Form.Item>

                      <Form.Item style={{ marginBottom: '8px' }}>
                        <Button
                          type="primary"
                          danger
                          htmlType="submit"
                          loading={submitting}
                          size="middle"
                        >
                          Disassociate Device
                        </Button>
                      </Form.Item>
                    </Form>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Please disassociate the current device before associating a new one.</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Divider className="my-1" style={{ marginTop: '4px', marginBottom: '4px' }}>Associate Device</Divider>

                    <Form
                      form={associateDeviceForm}
                      layout="vertical"
                      onFinish={handleAssociateDevice}
                      size="small"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <Form.Item
                          label="Device ID"
                          name="deviceId"
                          rules={[{ required: true, message: "Please select a device" }]}
                          style={{ marginBottom: '12px' }}
                        >
                          <Select
                            placeholder="Select device"
                            loading={devicesLoading}
                            showSearch
                            optionFilterProp="children"
                            size="middle"
                            filterOption={(input, option) => {
                              const deviceId = option?.value?.toString() || '';
                              const device = devices.find(d => d.id?.toString() === deviceId || d.deviceId?.toString() === deviceId);
                              if (!device) return false;
                              const searchText = input.toLowerCase();
                              const idMatch = device.deviceId?.toString().toLowerCase().includes(searchText);
                              const serialMatch = device.serialNumber?.toLowerCase().includes(searchText);
                              return idMatch || serialMatch || false;
                            }}
                          >
                            {devices.map((device) => (
                              <Option key={device.id} value={device.id}>
                                Device ID: {device.deviceId || device.id} {device.serialNumber ? `(${device.serialNumber})` : ''}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          label="Installed By"
                          name="installedBy"
                          rules={[{ required: true, message: "Please select installed by" }]}
                          style={{ marginBottom: '12px' }}
                        >
                          <Select
                            placeholder="Select installed by"
                            size="middle"
                            showSearch
                            optionFilterProp="children"
                          >
                            <Option value="ADMIN">ADMIN</Option>
                            {fleets.map((fleet) => (
                              <Option key={fleet.id} value={fleet.name}>
                                {fleet.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>

                      <Form.Item style={{ marginBottom: '8px' }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={submitting}
                          size="middle"
                        >
                          Associate Device
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                )}
              </div>
            ),
          },
          {
            key: "goals",
            label: "Goals",
            children: (
              <div className="space-y-2">
                <div>
                  <h3 className="text-base font-semibold mb-1">Vehicle Goals</h3>
                  <Table
                    dataSource={goals}
                    columns={goalColumns}
                    loading={goalsLoading}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </div>

                <Divider className="my-2" style={{ marginTop: '8px', marginBottom: '8px' }}>Create New Goal</Divider>

                <Form
                  form={goalForm}
                  layout="vertical"
                  onFinish={handleCreateGoal}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Form.Item
                      label="Day"
                      name="day"
                      rules={[{ required: true, message: "Please select a day" }]}
                    >
                      <Select placeholder="Select day" size="large">
                        {DAYS.map((day) => (
                          <Option key={day} value={day}>
                            {day}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Route"
                      name="routeId"
                      rules={[{ required: true, message: "Please select a route" }]}
                    >
                      <Select
                        placeholder="Select route"
                        loading={routesLoading}
                        showSearch
                        optionFilterProp="children"
                        size="large"
                      >
                        {routes.map((route) => (
                          <Option key={route.id} value={route.id}>
                            {route.name} {route.description ? `- ${route.description}` : ""}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <Form.Item
                    label="Target KM Run"
                    name="targetKmRun"
                    rules={[
                      { required: true, message: "Please enter target KM run" },
                      { type: "number", min: 0, message: "Target must be a positive number" },
                    ]}
                  >
                    <InputNumber
                      className="w-full"
                      placeholder="500"
                      min={0}
                      step={0.1}
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={submitting}>
                      Create Goal
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            ),
          },
          {
            key: "routes",
            label: "Routes",
            children: (
              <div className="space-y-2">
                <div>
                  <h3 className="text-base font-semibold mb-1">Route Management</h3>
                  
                  {filteredDataLoading && (
                    <div className="text-center py-1">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <p className="text-gray-600 mt-0.5 text-xs">Loading route information...</p>
                    </div>
                  )}
                  
                  {(displayVehicle.routeId || vehicleRoute) ? (
                    <div className="mb-2">
                      <Divider className="my-1" style={{ marginTop: '6px', marginBottom: '6px' }}>Disassociate Route</Divider>
                      
                      <Form
                        form={disassociateRouteForm}
                        layout="vertical"
                        onFinish={handleDisassociateRoute}
                        initialValues={{ routeId: vehicleRoute?.id || displayVehicle.routeId }}
                      >
                        <Form.Item
                          label="Route"
                          name="routeId"
                          rules={[{ required: true, message: "Please select a route" }]}
                        >
                          <Select
                            placeholder="Select route to disassociate"
                            loading={routesLoading}
                            showSearch
                            optionFilterProp="children"
                            size="large"
                            disabled
                            filterOption={(input, option) => {
                              const routeId = option?.value as number;
                              const route = routes.find(r => r.id === routeId) || vehicleRoute;
                              if (!route) return false;
                              const displayName = getRouteDisplayName(route).toLowerCase();
                              return displayName.includes(input.toLowerCase());
                            }}
                          >
                            {vehicleRoute && (
                              <Option key={vehicleRoute.id} value={vehicleRoute.id}>
                                {getRouteDisplayName(vehicleRoute)}
                              </Option>
                            )}
                            {routes.map((route) => (
                              <Option key={route.id} value={route.id}>
                                {getRouteDisplayName(route)}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        
                        <Form.Item
                          label="Reason"
                          name="reason"
                          rules={[{ required: true, message: "Please provide a reason" }]}
                        >
                          <TextArea
                            placeholder="Enter reason for disassociation"
                            rows={4}
                            size="large"
                          />
                        </Form.Item>
                        
                        <Form.Item>
                          <Button
                            type="primary"
                            danger
                            htmlType="submit"
                            loading={submitting}
                          >
                            Disassociate Route
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  ) : (
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1">No route currently associated with this vehicle.</p>
                    </div>
                  )}

                  <Divider className="my-1" style={{ marginTop: '6px', marginBottom: '6px' }}>Associate New Route</Divider>

                  <Form
                    form={routeForm}
                    layout="vertical"
                    onFinish={handleAssociateRoute}
                  >
                    <Form.Item
                      label="Select Route"
                      name="routeId"
                      rules={[{ required: true, message: "Please select a route" }]}
                    >
                      <Select
                        placeholder="Select route"
                        loading={routesLoading}
                        showSearch
                        optionFilterProp="children"
                        size="large"
                        filterOption={(input, option) => {
                          const routeId = option?.value as number;
                          const route = routes.find(r => r.id === routeId);
                          if (!route) return false;
                          const displayName = getRouteDisplayName(route).toLowerCase();
                          return displayName.includes(input.toLowerCase());
                        }}
                      >
                        {routes.map((route) => (
                          <Option key={route.id} value={route.id}>
                            {getRouteDisplayName(route)}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Notes (Optional)"
                      name="notes"
                    >
                      <TextArea
                        placeholder="Enter any notes about this route association"
                        rows={4}
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                      >
                        Associate Route
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};

