// Fleet Form Component using Ant Design
import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Row, Col, message, Alert, Checkbox } from "antd";
import { useOrganizations } from "../hooks/useOrganizations";
import { useAuth } from "../hooks/useAuth";
import type { FleetCreateRequest } from "../services/fleetService";

const { Option } = Select;
const { TextArea } = Input;

interface FleetFormProps {
  onSubmit: (data: FleetCreateRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const FleetForm: React.FC<FleetFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { token } = useAuth();
  const { organizations, loading: organizationsLoading, fetchOrganizations } = useOrganizations(token);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchOrganizations();
    }
  }, [token, fetchOrganizations]);

  const handleSubmit = async (values: any) => {
    setErrorMessage(null);
    
    try {
      const formData: FleetCreateRequest = {
        name: values.name,
        description: values.description || "",
        organizationId: values.organizationId,
        financierOrganizationId: values.financierOrganizationId || undefined,
        contactNumber: values.contactNumber || undefined,
        email: values.email || undefined,
        isOperator: values.isOperator || false,
      };
      
      await onSubmit(formData);
      form.resetFields();
      setErrorMessage(null);
    } catch (error: any) {
      let extractedErrorMessage = "Failed to create fleet. Please try again.";
      
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
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="w-full"
      initialValues={{
        isOperator: false,
      }}
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

      <Form.Item
        label="Name"
        name="name"
        rules={[
          { required: true, message: "Please enter fleet name" },
          { min: 1, message: "Name must be at least 1 character" }
        ]}
      >
        <Input placeholder="Fleet Name" size="large" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
      >
        <TextArea 
          rows={3} 
          placeholder="Fleet description" 
          size="large"
        />
      </Form.Item>

      <Form.Item
        label="Organization"
        name="organizationId"
        rules={[{ required: true, message: "Please select an organization" }]}
      >
        <Select 
          placeholder="Select organization" 
          size="large"
          loading={organizationsLoading}
          showSearch
          filterOption={(input, option) => {
            const orgName = option?.children || '';
            return String(orgName).toLowerCase().includes(input.toLowerCase());
          }}
        >
          {organizations.map((org) => (
            <Option key={org.id} value={org.id}>
              {org.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Financier Organization"
        name="financierOrganizationId"
      >
        <Select 
          placeholder="Select financier organization (optional)" 
          size="large"
          loading={organizationsLoading}
          showSearch
          allowClear
          filterOption={(input, option) => {
            const orgName = option?.children || '';
            return String(orgName).toLowerCase().includes(input.toLowerCase());
          }}
        >
          {organizations.map((org) => (
            <Option key={org.id} value={org.id}>
              {org.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Contact Number"
        name="contactNumber"
        rules={[
          {
            pattern: /^[0-9]{10}$/,
            message: "Contact number must be exactly 10 digits"
          }
        ]}
      >
        <Input 
          type="tel"
          placeholder="2684046987" 
          size="large"
          maxLength={10}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { type: 'email', message: 'Please enter a valid email address' }
        ]}
      >
        <Input 
          type="email"
          placeholder="user@example.com" 
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="isOperator"
        valuePropName="checked"
      >
        <Checkbox>Is Operator</Checkbox>
      </Form.Item>

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
              Create Fleet
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

