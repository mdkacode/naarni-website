// Route Form Component using Ant Design
import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Button, Row, Col, message, Alert } from "antd";
import type { Route, RouteCreateRequest, RouteUpdateRequest } from "../types/route";

const { Option } = Select;
const { TextArea } = Input;

interface RouteFormProps {
  route?: Route;
  onSubmit: (data: RouteCreateRequest | RouteUpdateRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  onError?: (error: string) => void;
}

export const RouteForm: React.FC<RouteFormProps> = ({
  route,
  onSubmit,
  onCancel,
  loading = false,
  onError,
}) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (route) {
      form.setFieldsValue({
        name: route.name || "",
        description: route.description || "",
        startCityId: route.startCityId || undefined,
        endCityId: route.endCityId || undefined,
        startCityName: route.startCityName || "",
        endCityName: route.endCityName || "",
        distance: route.distance || 0,
        estimatedDuration: route.estimatedDuration || 0,
        routeType: route.routeType || "TO_FRO",
      });
    } else {
      form.resetFields();
    }
  }, [route, form]);

  const handleSubmit = async (values: any) => {
    setErrorMessage(null);
    
    try {
      const formData = {
        id: route?.id || 0,
        name: values.name,
        description: values.description || "",
        startCityId: values.startCityId,
        endCityId: values.endCityId,
        startCityName: values.startCityName || "",
        endCityName: values.endCityName || "",
        distance: values.distance || 0,
        estimatedDuration: values.estimatedDuration || 0,
        routeType: values.routeType || "TO_FRO",
      };
      
      await onSubmit(formData as any);
      form.resetFields();
      setErrorMessage(null);
    } catch (error: any) {
      let extractedErrorMessage = "Failed to save route. Please try again.";
      
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
            label="Route Name"
            name="name"
            rules={[{ required: true, message: "Please enter route name" }]}
          >
            <Input placeholder="Route 101" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Route Type"
            name="routeType"
            rules={[{ required: true, message: "Please select route type" }]}
          >
            <Select placeholder="Select route type" size="large">
              <Option value="ONE_WAY">One Way</Option>
              <Option value="TO_FRO">To & Fro</Option>
            </Select>
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
              placeholder="Route description (e.g., Bangalore to Chennai)" 
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Start City ID"
            name="startCityId"
            rules={[{ required: true, message: "Please enter start city ID" }]}
          >
            <InputNumber 
              className="w-full" 
              placeholder="13" 
              size="large"
              min={0}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Start City Name"
            name="startCityName"
          >
            <Input placeholder="Bangalore" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="End City ID"
            name="endCityId"
            rules={[{ required: true, message: "Please enter end city ID" }]}
          >
            <InputNumber 
              className="w-full" 
              placeholder="23" 
              size="large"
              min={0}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="End City Name"
            name="endCityName"
          >
            <Input placeholder="Chennai" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Distance (km)"
            name="distance"
            rules={[{ required: true, message: "Please enter distance" }]}
          >
            <InputNumber 
              className="w-full" 
              placeholder="15.5" 
              size="large"
              min={0}
              step={0.1}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Estimated Duration (minutes)"
            name="estimatedDuration"
            rules={[{ required: true, message: "Please enter estimated duration" }]}
          >
            <InputNumber 
              className="w-full" 
              placeholder="45" 
              size="large"
              min={0}
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
              {route ? "Update Route" : "Create Route"}
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

