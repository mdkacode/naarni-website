// Vehicle Details Modal Component
import React, { useState, useEffect } from "react";
import { Modal, Tabs, Button, Space, Form, Select, InputNumber, Input, message, Table, Tag, Divider } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import type { Vehicle, VehicleFilterRequest } from "../types/vehicle";
import type { VehicleGoal, VehicleGoalCreateRequest } from "../types/vehicleGoal";
import { useFleets } from "../hooks/useFleets";
import { useRoutes } from "../hooks/useRoutes";
import { useAuth } from "../hooks/useAuth";
import { vehicleGoalService } from "../services/vehicleGoalService";
import { vehicleService } from "../services/vehicleService";

const { Option } = Select;

const MAKE_MODEL_OPTIONS = [
  { value: "12 CM", label: "12 CM" },
  { value: "12.5 CM", label: "12.5 CM" },
];

const STATUS_OPTIONS = [
  { value: "PLUGGED_IN", label: "Plugged In" },
  { value: "UNPLUGGED", label: "Unplugged" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "INACTIVE", label: "Inactive" },
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
}) => {
  const { token } = useAuth();
  const { fleets, loading: fleetsLoading } = useFleets(token);
  const { routes, loading: routesLoading } = useRoutes(token);
  const [form] = Form.useForm();
  const [vehicleForm] = Form.useForm();
  const [goalForm] = Form.useForm();
  const [routeForm] = Form.useForm();
  const [disassociateRouteForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [goals, setGoals] = useState<VehicleGoal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [filteredDataLoading, setFilteredDataLoading] = useState(false);
  const [enrichedVehicle, setEnrichedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (visible && vehicle?.id) {
      fetchGoals();
      fetchFilteredVehicleData();
      form.resetFields();
      goalForm.resetFields();
      routeForm.resetFields();
      disassociateRouteForm.resetFields();
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
          registrationNumbers: [vehicle.registrationNumber],
          hasActiveDevice: true,
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
        capacity: values.capacity,
        status: values.status,
        fleetId: values.fleetId,
        isActive: values.isActive,
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
                        label="Capacity"
                        name="capacity"
                        rules={[
                          { required: true, message: "Please enter capacity" },
                          { type: "number", min: 0, message: "Capacity must be a positive number" },
                        ]}
                      >
                        <InputNumber
                          className="w-full"
                          placeholder="Enter capacity"
                          min={0}
                          size="large"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Please select status" }]}
                      >
                        <Select placeholder="Select status" size="large">
                          {STATUS_OPTIONS.map((option) => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
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

                      <Form.Item
                        label="Active"
                        name="isActive"
                      >
                        <Select size="large">
                          <Option value={true}>Active</Option>
                          <Option value={false}>Inactive</Option>
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
                      <div>
                        <p className="text-xs text-gray-500 mb-0">Capacity</p>
                        <p className="font-semibold text-sm leading-tight">{displayVehicle.capacity || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0">Status</p>
                        <p className="font-semibold text-sm leading-tight">{displayVehicle.status?.replace(/_/g, " ") || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0">Active</p>
                        <p className="font-semibold text-sm leading-tight">{displayVehicle.isActive ? "Yes" : "No"}</p>
                      </div>
                      {displayVehicle.operational !== undefined && (
                        <div>
                          <p className="text-xs text-gray-500 mb-0">Operational</p>
                          <p className="font-semibold text-sm leading-tight">{displayVehicle.operational ? "Yes" : "No"}</p>
                        </div>
                      )}
                      {displayVehicle.moving !== undefined && (
                        <div>
                          <p className="text-xs text-gray-500 mb-0">Moving</p>
                          <p className="font-semibold text-sm leading-tight">{displayVehicle.moving ? "Yes" : "No"}</p>
                        </div>
                      )}
                      {displayVehicle.charging !== undefined && (
                        <div>
                          <p className="text-xs text-gray-500 mb-0">Charging</p>
                          <p className="font-semibold text-sm leading-tight">{displayVehicle.charging ? "Yes" : "No"}</p>
                        </div>
                      )}
                      {displayVehicle.idle !== undefined && (
                        <div>
                          <p className="text-xs text-gray-500 mb-0">Idle</p>
                          <p className="font-semibold text-sm leading-tight">{displayVehicle.idle ? "Yes" : "No"}</p>
                        </div>
                      )}
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

                <Divider className="my-2" style={{ marginTop: '8px', marginBottom: '8px' }}>Fleet Management</Divider>

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
                  
                  {vehicleRoute && (
                    <div className="mb-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-1 text-xs">Current Route Information</h4>
                      <div className="grid grid-cols-3 gap-1.5">
                        <div>
                          <p className="text-xs text-gray-600 mb-0 leading-tight">Route Name</p>
                          <p className="font-semibold text-sm leading-tight">{vehicleRoute.name || "N/A"}</p>
                        </div>
                        {vehicleRoute.startCityName && vehicleRoute.endCityName && (
                          <div>
                            <p className="text-xs text-gray-600 mb-0 leading-tight">Route</p>
                            <p className="font-semibold text-sm leading-tight">{vehicleRoute.startCityName} → {vehicleRoute.endCityName}</p>
                          </div>
                        )}
                        {vehicleRoute.distance && (
                          <div>
                            <p className="text-xs text-gray-600 mb-0 leading-tight">Distance</p>
                            <p className="font-semibold text-sm leading-tight">{vehicleRoute.distance} km</p>
                          </div>
                        )}
                        {vehicleRoute.description && (
                          <div className="col-span-3">
                            <p className="text-xs text-gray-600 mb-0 leading-tight">Description</p>
                            <p className="font-semibold text-sm leading-tight">{vehicleRoute.description}</p>
                          </div>
                        )}
                        {vehicleRoute.estimatedDuration && (
                          <div>
                            <p className="text-xs text-gray-600 mb-0 leading-tight">Duration</p>
                            <p className="font-semibold text-sm leading-tight">{vehicleRoute.estimatedDuration} hrs</p>
                          </div>
                        )}
                        {vehicleRoute.routeType && (
                          <div>
                            <p className="text-xs text-gray-600 mb-0 leading-tight">Type</p>
                            <p className="font-semibold text-sm leading-tight">{vehicleRoute.routeType.replace(/_/g, " ")}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {(displayVehicle.routeId || vehicleRoute) ? (
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1">
                        Current Route: <strong>{vehicleRoute?.name || displayVehicle.route?.name || `Route ID: ${displayVehicle.routeId}`}</strong>
                        {vehicleRoute?.description && (
                          <span className="text-gray-500 ml-2">- {vehicleRoute.description}</span>
                        )}
                      </p>
                      
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
                          >
                            {vehicleRoute && (
                              <Option key={vehicleRoute.id} value={vehicleRoute.id}>
                                {vehicleRoute.name} {vehicleRoute.description ? `- ${vehicleRoute.description}` : ""}
                              </Option>
                            )}
                            {routes.map((route) => (
                              <Option key={route.id} value={route.id}>
                                {route.name} {route.description ? `- ${route.description}` : ""}
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
                      >
                        {routes.map((route) => (
                          <Option key={route.id} value={route.id}>
                            {route.name} {route.description ? `- ${route.description}` : ""}
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

