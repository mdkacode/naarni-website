// Device Form Component using Ant Design
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, message, Alert, Select } from "antd";
import type { DeviceCreateRequest } from "../types/device";

const { Option } = Select;

const DEVICE_TYPE_OPTIONS = [
  { value: "OBD_DEVICE", label: "OBD Device" },
];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

interface DeviceFormProps {
  onSubmit: (data: DeviceCreateRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  onError?: (error: string) => void;
}

export const DeviceForm: React.FC<DeviceFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  onError,
}) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    form.resetFields();
  }, [form]);

  const handleSubmit = async (values: any) => {
    setErrorMessage(null);
    
    try {
      const formData: DeviceCreateRequest = {
        deviceId: values.deviceId,
        deviceType: values.deviceType,
        manufacturer: values.manufacturer,
        model: values.model,
        serialNumber: values.serialNumber,
        firmwareVersion: values.firmwareVersion,
        status: values.status,
        isActive: values.isActive !== undefined ? values.isActive : true,
      };
      
      await onSubmit(formData);
      form.resetFields();
      setErrorMessage(null);
    } catch (error: any) {
      let extractedErrorMessage = "Failed to create device. Please try again.";
      
      if (error?.response?.data?.errorMessage) {
        extractedErrorMessage = error.response.data.errorMessage;
      } else if (error?.errorMessage) {
        extractedErrorMessage = error.errorMessage;
      } else if (error?.message) {
        extractedErrorMessage = error.message;
      } else if (typeof error === 'string') {
        extractedErrorMessage = error;
      }
      
      setErrorMessage(extractedErrorMessage);
      message.error(extractedErrorMessage, 5);
      
      if (onError) {
        onError(extractedErrorMessage);
      }
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="w-full"
    >
      {errorMessage && (
        <Alert
          message="Error"
          description={errorMessage}
          type="error"
          showIcon
          closable
          onClose={() => setErrorMessage(null)}
          className="mb-6"
          style={{ marginBottom: '24px' }}
        />
      )}
      
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Device ID"
            name="deviceId"
            rules={[
              { required: true, message: "Please enter device ID" },
            ]}
          >
            <Input placeholder="e.g., 7" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Device Type"
            name="deviceType"
            rules={[{ required: true, message: "Please select device type" }]}
          >
            <Select placeholder="Select device type" size="large">
              {DEVICE_TYPE_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Manufacturer"
            name="manufacturer"
            rules={[{ required: true, message: "Please enter manufacturer" }]}
          >
            <Input placeholder="e.g., BYTEBEAM" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Model"
            name="model"
            rules={[{ required: true, message: "Please enter model" }]}
          >
            <Input placeholder="e.g., GTU-10" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Serial Number"
            name="serialNumber"
            rules={[{ required: true, message: "Please enter serial number" }]}
          >
            <Input placeholder="e.g., SN123456789" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Firmware Version"
            name="firmwareVersion"
            rules={[{ required: true, message: "Please enter firmware version" }]}
          >
            <Input placeholder="e.g., 1.0.0" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
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
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Active"
            name="isActive"
            initialValue={true}
          >
            <Select placeholder="Select active status" size="large">
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]} className="mt-6">
        <Col xs={24} sm={24} md={24}>
          <Form.Item>
            <div className="flex justify-end space-x-4">
              <Button
                size="large"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Device
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

