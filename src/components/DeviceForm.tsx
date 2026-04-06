// Device Form Component using Ant Design
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, message, Alert } from "antd";
import type { DeviceCreateRequest } from "../types/device";

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
        deviceType: "OBD_DEVICE", // Default value
        manufacturer: "BYTEBEAM", // Default value
        model: "GTU-10", // Default value
        // serialNumber: values.serialNumber,
        firmwareVersion: "1.0.0", // Default value
        status: "ACTIVE", // Default value
        isActive: true, // Default value
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
            label="IMEI Number"
            name="serialNumber"
           
          >
            <Input placeholder="e.g., SN123456789" size="large" />
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

