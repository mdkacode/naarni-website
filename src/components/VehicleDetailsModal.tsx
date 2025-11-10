// Vehicle Details Modal Component
import React, { useState, useEffect } from "react";
import { Modal, Tabs, Button, Space, Form, Select, InputNumber, message, Table, Tag, Divider } from "antd";
import type { Vehicle } from "../types/vehicle";
import type { VehicleGoal, VehicleGoalCreateRequest } from "../types/vehicleGoal";
import { useFleets } from "../hooks/useFleets";
import { useRoutes } from "../hooks/useRoutes";
import { useAuth } from "../hooks/useAuth";
import { vehicleGoalService } from "../services/vehicleGoalService";
import { formatDate } from "../utils/formatters";

const { Option } = Select;

interface VehicleDetailsModalProps {
  visible: boolean;
  vehicle: Vehicle | null;
  onCancel: () => void;
  onAssociate: (vehicleId: number, fleetId: number) => Promise<void>;
  onDisassociate: (vehicleId: number) => Promise<void>;
}

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const;

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  visible,
  vehicle,
  onCancel,
  onAssociate,
  onDisassociate,
}) => {
  const { token } = useAuth();
  const { fleets, loading: fleetsLoading } = useFleets(token);
  const { routes, loading: routesLoading } = useRoutes(token);
  const [form] = Form.useForm();
  const [goalForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [goals, setGoals] = useState<VehicleGoal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (visible && vehicle?.id) {
      fetchGoals();
      form.resetFields();
      goalForm.resetFields();
    }
  }, [visible, vehicle?.id]);

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

  return (
    <Modal
      title={`Vehicle Details - ${vehicle.registrationNumber || `#${vehicle.id}`}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      style={{ top: 20 }}
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: "details",
            label: "Details",
            children: (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="font-semibold">{vehicle.registrationNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Make/Model</p>
                    <p className="font-semibold">{vehicle.make || "N/A"} {vehicle.model || ""}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-semibold">{vehicle.year || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-semibold">{vehicle.capacity || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold">{vehicle.status?.replace("_", " ") || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fleet</p>
                    <p className="font-semibold">
                      {vehicle.fleet?.name || (vehicle.fleetId ? `Fleet ID: ${vehicle.fleetId}` : "N/A")}
                    </p>
                  </div>
                </div>

                <Divider>Fleet Management</Divider>

                <div className="space-y-4">
                  {vehicle.fleetId ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        Current Fleet: <strong>{vehicle.fleet?.name || `Fleet ID: ${vehicle.fleetId}`}</strong>
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
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Vehicle Goals</h3>
                  <Table
                    dataSource={goals}
                    columns={goalColumns}
                    loading={goalsLoading}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </div>

                <Divider>Create New Goal</Divider>

                <Form
                  form={goalForm}
                  layout="vertical"
                  onFinish={handleCreateGoal}
                >
                  <div className="grid grid-cols-2 gap-4">
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
        ]}
      />
    </Modal>
  );
};

