// Fleet Association Modal Component
import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Button, message } from "antd";
import { useFleets } from "../hooks/useFleets";
import { useAuth } from "../hooks/useAuth";

const { Option } = Select;

interface FleetAssociationModalProps {
  visible: boolean;
  vehicleId: number;
  currentFleetId?: number;
  mode: "associate" | "disassociate";
  onCancel: () => void;
  onSuccess: () => void;
  onAssociate: (vehicleId: number, fleetId: number) => Promise<void>;
  onDisassociate: (vehicleId: number) => Promise<void>;
}

export const FleetAssociationModal: React.FC<FleetAssociationModalProps> = ({
  visible,
  vehicleId,
  currentFleetId,
  mode,
  onCancel,
  onSuccess,
  onAssociate,
  onDisassociate,
}) => {
  const { token } = useAuth();
  const { fleets, loading: fleetsLoading } = useFleets(token);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible && mode === "associate") {
      form.resetFields();
    }
  }, [visible, mode, form]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      if (mode === "associate") {
        const values = await form.validateFields();
        await onAssociate(vehicleId, values.fleetId);
        message.success("Fleet associated successfully");
      } else {
        await onDisassociate(vehicleId);
        message.success("Fleet disassociated successfully");
      }
      
      onSuccess();
      form.resetFields();
    } catch (error: any) {
      const errorMessage = error?.errorMessage || error?.message || "Operation failed";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={mode === "associate" ? "Associate Fleet" : "Disassociate Fleet"}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={submitting}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={submitting}
        >
          {mode === "associate" ? "Associate" : "Disassociate"}
        </Button>,
      ]}
    >
      {mode === "associate" ? (
        <Form form={form} layout="vertical">
          <Form.Item
            label="Select Fleet"
            name="fleetId"
            rules={[{ required: true, message: "Please select a fleet" }]}
          >
            <Select
              placeholder="Select a fleet"
              loading={fleetsLoading}
              showSearch
              optionFilterProp="children"
              size="large"
            >
              {fleets.map((fleet) => (
                <Option key={fleet.id} value={fleet.id}>
                  {fleet.name} {fleet.organizationName ? `(${fleet.organizationName})` : ""}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      ) : (
        <div>
          <p>Are you sure you want to disassociate this vehicle from its current fleet?</p>
          {currentFleetId && (
            <p className="text-gray-600 mt-2">
              Current Fleet ID: <strong>{currentFleetId}</strong>
            </p>
          )}
        </div>
      )}
    </Modal>
  );
};

