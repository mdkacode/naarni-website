// Organization Form Component using Ant Design
import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Row, Col, message, Alert, Checkbox } from "antd";
import type { Organization } from "../types/organization";

const { Option } = Select;
const { TextArea } = Input;

interface OrganizationFormProps {
  organization?: Organization | null;
  onSubmit: (data: Partial<Organization>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ORGANIZATION_TYPES = ["PRIVATE", "FLEET_OWNER", "PUBLIC"];

export const OrganizationForm: React.FC<OrganizationFormProps> = ({
  organization,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (organization) {
      form.setFieldsValue({
        name: organization.name || "",
        type: organization.type || "PRIVATE",
        address: organization.address || "",
        contactNumber: organization.contactNumber || "",
        email: organization.email || "",
        isOperator: organization.isOperator ?? false,
      });
    } else {
      form.resetFields();
    }
  }, [organization, form]);

  const handleSubmit = async (values: any) => {
    setErrorMessage(null);
    
    try {
      await onSubmit(values);
      form.resetFields();
      setErrorMessage(null);
    } catch (error: any) {
      let extractedErrorMessage = "Failed to save organization. Please try again.";
      
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
        type: "PRIVATE",
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
        rules={[{ required: true, message: "Please enter organization name" }]}
      >
        <Input placeholder="Acme Corporation Ltd" size="large" />
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: "Please select organization type" }]}
      >
        <Select placeholder="Select organization type" size="large">
          {ORGANIZATION_TYPES.map((type) => (
            <Option key={type} value={type}>
              {type.replace("_", " ")}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
      >
        <TextArea 
          rows={3} 
          placeholder="123 Main St, City, State" 
          size="large"
        />
      </Form.Item>

      <Form.Item
        label="Contact Number"
        name="contactNumber"
      >
        <Input 
          type="tel"
          placeholder="+919876543210" 
          size="large"
        />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
      >
        <Input 
          type="email"
          placeholder="contact@acme.com" 
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
              {organization ? "Update Organization" : "Create Organization"}
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

