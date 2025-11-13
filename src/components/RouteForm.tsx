// Route Form Component using Ant Design
import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Row, Col, message, Alert } from "antd";
import type { Route, RouteCreateRequest, RouteUpdateRequest } from "../types/route";
import { useCities } from "../hooks/useCities";
import { useAuth } from "../hooks/useAuth";

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
  const { token } = useAuth();
  const { cities, loading: citiesLoading, fetchCities } = useCities(token);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      // Fetch all cities for dropdowns (using a large page size to get all cities)
      fetchCities(0, 1000);
    }
  }, [token, fetchCities]);

  useEffect(() => {
    if (route) {
      form.setFieldsValue({
        name: route.name || "",
        description: route.description || "",
        startCityId: route.startCityId || undefined,
        endCityId: route.endCityId || undefined,
        startCityName: route.startCityName || "",
        endCityName: route.endCityName || "",
        routeType: route.routeType || "TO_FRO",
      });
    } else {
      form.resetFields();
    }
  }, [route, form]);

  const handleSubmit = async (values: any) => {
    setErrorMessage(null);
    
    try {
      // Find city IDs from selected city names
      const startCity = cities.find(city => city.name === values.startCityName);
      const endCity = cities.find(city => city.name === values.endCityName);
      
      if (!startCity || !startCity.id) {
        throw new Error("Please select a valid start city");
      }
      if (!endCity || !endCity.id) {
        throw new Error("Please select a valid end city");
      }
      
      const formData = {
        id: route?.id || 0,
        name: values.name,
        description: values.description || "",
        startCityId: startCity.id,
        endCityId: endCity.id,
        startCityName: values.startCityName || "",
        endCityName: values.endCityName || "",
        distance: 0,
        estimatedDuration: 0,
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
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Start City"
            name="startCityName"
            dependencies={['endCityName']}
            rules={[
              { required: true, message: "Please select start city" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('endCityName') !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Start city and end city cannot be the same'));
                },
              }),
            ]}
          >
            <Select 
              placeholder="Select start city" 
              size="large"
              loading={citiesLoading}
              showSearch
              filterOption={(input, option) => {
                const cityName = option?.value || '';
                const city = cities.find(c => c.name === cityName);
                if (!city) return false;
                const searchText = input.toLowerCase();
                const nameMatch = city.name?.toLowerCase().includes(searchText);
                const stateMatch = city.state?.toLowerCase().includes(searchText);
                return nameMatch || stateMatch || false;
              }}
              onChange={() => {
                // Trigger validation for end city when start city changes
                form.validateFields(['endCityName']);
              }}
            >
              {cities.map((city) => (
                <Option key={city.id} value={city.name || ""}>
                  {city.name} {city.state ? `(${city.state})` : ""}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="End City"
            name="endCityName"
            dependencies={['startCityName']}
            rules={[
              { required: true, message: "Please select end city" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('startCityName') !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Start city and end city cannot be the same'));
                },
              }),
            ]}
          >
            <Select 
              placeholder="Select end city" 
              size="large"
              loading={citiesLoading}
              showSearch
              filterOption={(input, option) => {
                const cityName = option?.value || '';
                const city = cities.find(c => c.name === cityName);
                if (!city) return false;
                const searchText = input.toLowerCase();
                const nameMatch = city.name?.toLowerCase().includes(searchText);
                const stateMatch = city.state?.toLowerCase().includes(searchText);
                return nameMatch || stateMatch || false;
              }}
              onChange={() => {
                // Trigger validation for start city when end city changes
                form.validateFields(['startCityName']);
              }}
            >
              {cities.map((city) => (
                <Option key={city.id} value={city.name || ""}>
                  {city.name} {city.state ? `(${city.state})` : ""}
                </Option>
              ))}
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

