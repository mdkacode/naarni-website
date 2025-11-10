// Organization Form Component
import React, { useState, useEffect } from "react";
import type { Organization } from "../types/organization";

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
  const [formData, setFormData] = useState<Partial<Organization>>({
    name: "",
    type: "PRIVATE",
    address: "",
    contactNumber: "",
    email: "",
    isOperator: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        type: organization.type || "PRIVATE",
        address: organization.address || "",
        contactNumber: organization.contactNumber || "",
        email: organization.email || "",
        isOperator: organization.isOperator ?? false,
      });
    }
  }, [organization]);

  const handleChange = (field: keyof Organization, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name?.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.type) {
      setError("Type is required");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "Failed to save organization");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Acme Corporation Ltd"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.type || "PRIVATE"}
          onChange={(e) => handleChange("type", e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {ORGANIZATION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          value={formData.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="123 Main St, City, State"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Number
        </label>
        <input
          type="tel"
          value={formData.contactNumber || ""}
          onChange={(e) => handleChange("contactNumber", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="+919876543210"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="contact@acme.com"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isOperator"
          checked={formData.isOperator || false}
          onChange={(e) => handleChange("isOperator", e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isOperator" className="ml-2 text-sm text-gray-700">
          Is Operator
        </label>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : organization ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

