// City Form Component using Ant Design
import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Row, Col, message, Alert } from "antd";
import type { City, CityCreateRequest, CityUpdateRequest } from "../types/city";

const { TextArea } = Input;

interface CityFormProps {
  city?: City;
  onSubmit: (data: CityCreateRequest | CityUpdateRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  onError?: (error: string) => void;
}

export const CityForm: React.FC<CityFormProps> = ({
  city,
  onSubmit,
  onCancel,
  loading = false,
  onError,
}) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (city) {
      form.setFieldsValue({
        name: city.name || "",
        state: city.state || "",
        country: city.country || "",
        latitude: city.latitude || undefined,
        longitude: city.longitude || undefined,
        description: city.description || "",
      });
    } else {
      form.resetFields();
    }
  }, [city, form]);

  const handleSubmit = async (values: any) => {
    setErrorMessage(null);
    
    try {
      const formData = {
        name: values.name,
        state: values.state,
        country: values.country,
        latitude: values.latitude,
        longitude: values.longitude,
        description: values.description || "",
      };
      
      await onSubmit(formData as any);
      form.resetFields();
      setErrorMessage(null);
    } catch (error: any) {
      let extractedErrorMessage = "Failed to save city. Please try again.";
      
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
            label="City Name"
            name="name"
            rules={[{ required: true, message: "Please enter city name" }]}
          >
            <Input placeholder="Mumbai" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "Please enter state" }]}
          >
            <Input placeholder="Maharashtra" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please enter country" }]}
          >
            <Input placeholder="India" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Latitude"
            name="latitude"
            rules={[
              { required: true, message: "Please enter latitude" },
              { type: "number", min: -90, max: 90, message: "Latitude must be between -90 and 90" },
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="19.0760"
              min={-90}
              max={90}
              step={0.0001}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Longitude"
            name="longitude"
            rules={[
              { required: true, message: "Please enter longitude" },
              { type: "number", min: -180, max: 180, message: "Longitude must be between -180 and 180" },
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="72.8777"
              min={-180}
              max={180}
              step={0.0001}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24}>
          <Form.Item
            label="Description"
            name="description"
          >
            <TextArea 
              rows={3} 
              placeholder="City description (optional)" 
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              size="large" 
              block
              className="w-full"
            >
              {city ? "Update City" : "Create City"}
            </Button>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item>
            <Button 
              onClick={onCancel} 
              disabled={loading} 
              size="large" 
              block
              className="w-full"
            >
              Cancel
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

