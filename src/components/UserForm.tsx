// User Form Component using Ant Design
import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Button, Space, Row, Col, message, Alert } from "antd";
import type { User, UserCreateRequest, UserUpdateRequest } from "../types/user";
import type { Organization } from "../types/organization";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { Option } = Select;

interface UserFormProps {
  user?: User;
  organizations: Organization[];
  onSubmit: (data: UserCreateRequest | UserUpdateRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  onError?: (error: string) => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  organizations,
  onSubmit,
  onCancel,
  loading = false,
  onError,
}) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const account = user.account || {};
      const profile = user.profile || {};
      
      // When editing, only set fields that are visible in the form
      form.setFieldsValue({
        phone: account.phone || user.phone || "",
        email: account.email || user.email || "",
        firstName: profile.firstName || user.firstName || "",
        lastName: profile.lastName || user.lastName || "",
        // dateOfBirth and gender are not shown in edit form, so don't set them
        organizationId: account.organizationId || user.organizationId || undefined,
        // isPhoneVerified and isEmailVerified removed from form
      });
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const handleSubmit = async (values: any) => {
    // Clear any previous errors
    setErrorMessage(null);
    
    try {
      if (user) {
        // When editing, only send account fields (dateOfBirth and gender are not included)
        const formData = {
          account: {
            phone: values.phone,
            email: values.email,
            organizationId: values.organizationId,
            firstName: values.firstName,
            lastName: values.lastName,
          },
        };
        await onSubmit(formData as any);
        // Only reset form on successful submission
        form.resetFields();
        setErrorMessage(null);
      } else {
        // When creating, send all fields in account object (dateOfBirth and gender are optional)
        const formData = {
          account: {
            phone: values.phone,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format("YYYY-MM-DD") : undefined,
            gender: values.gender,
            organizationId: values.organizationId,
          },
        };
        await onSubmit(formData as any);
        // Only reset form on successful submission
        form.resetFields();
        setErrorMessage(null);
      }
    } catch (error: any) {
      // Extract error message from response
      let extractedErrorMessage = "Failed to save user. Please try again.";
      
      // Try multiple ways to extract the error message
      if (error?.response?.data?.errorMessage) {
        extractedErrorMessage = error.response.data.errorMessage;
      } else if (error?.errorMessage) {
        extractedErrorMessage = error.errorMessage;
      } else if (error?.message) {
        extractedErrorMessage = error.message;
      } else if (typeof error === 'string') {
        extractedErrorMessage = error;
      }
      
      // Set error message state for prominent display
      setErrorMessage(extractedErrorMessage);
      
      // Also show Ant Design message notification
      message.error(extractedErrorMessage, 5);
      
      // Call onError callback if provided
      if (onError) {
        onError(extractedErrorMessage);
      }
      
      // Don't reset form on error - keep user's input
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="w-full"
    >
      {/* Display error message prominently at the top of the form */}
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
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter phone number" },
              { pattern: /^\+?[1-9]\d{1,14}$/, message: "Please enter a valid phone number" },
            ]}
          >
            <Input placeholder="+919876543210" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input type="email" placeholder="user@example.com" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input placeholder="John" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input placeholder="Doe" size="large" />
          </Form.Item>
        </Col>
      </Row>

      {/* Date of Birth and Gender - Only show when creating new user, not when editing (both are optional) */}
      {!user && (
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              rules={[]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" size="large" placeholder="Select date of birth (optional)" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[]}
            >
              <Select placeholder="Select gender (optional)" size="large" allowClear>
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
                <Option value="OTHER">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      )}

      <Row gutter={[16, 0]}>
        <Col xs={24}>
          <Form.Item
            label="Organization"
            name="organizationId"
            rules={[{ required: true, message: "Please select organization" }]}
          >
            <Select 
              placeholder="Select organization" 
              showSearch 
              optionFilterProp="children" 
              size="large"
              loading={organizations.length === 0}
              notFoundContent={organizations.length === 0 ? "Loading organizations..." : "No organizations found"}
            >
              {organizations.map((org) => (
                <Option key={org.id} value={org.id}>
                  {org.name} ({org.type})
                </Option>
              ))}
            </Select>
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
              {user ? "Update User" : "Create User"}
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

