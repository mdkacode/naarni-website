// Vehicle Form Component
import React, { useState } from "react";
import type { Vehicle } from "../types/vehicle";
import { VEHICLE_MAKES, VEHICLE_MODELS, VEHICLE_STATUSES } from "../constants/vehicleOptions";

interface VehicleFormProps {
  onSubmit: (data: Partial<Vehicle>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    registrationNumber: "",
    make: "AZAD",
    model: "",
    year: new Date().getFullYear(),
    capacity: 0,
    fleetId: undefined,
    status: "PLUGGED_IN",
    isActive: true,
  });
  const [error, setError] = useState("");

  const handleChange = (field: keyof Vehicle, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.registrationNumber?.trim()) {
      setError("Registration Number is required");
      return;
    }

    if (!formData.fleetId) {
      setError("Fleet ID is required");
      return;
    }

    if (!formData.model) {
      setError("Model is required");
      return;
    }

    try {
      // Prepare payload matching the API structure
      const payload: Partial<Vehicle> = {
        id: 0,
        registrationNumber: formData.registrationNumber,
        model: formData.model,
        make: formData.make || "AZAD",
        year: formData.year || 0,
        capacity: formData.capacity || 0,
        status: formData.status || "PLUGGED_IN",
        isActive: true,
        fleetId: formData.fleetId || 0,
      };
      
      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || "Failed to save vehicle");
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
          Registration Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.registrationNumber || ""}
          onChange={(e) => handleChange("registrationNumber", e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="HR55AY7626"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.make || "AZAD"}
            onChange={(e) => handleChange("make", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          >
            {VEHICLE_MAKES.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.model || ""}
            onChange={(e) => handleChange("model", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          >
            <option value="">Select Model</option>
            {VEHICLE_MODELS.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="number"
            value={formData.year || ""}
            onChange={(e) => handleChange("year", parseInt(e.target.value) || new Date().getFullYear())}
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="2025"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacity
          </label>
          <input
            type="number"
            value={formData.capacity || ""}
            onChange={(e) => handleChange("capacity", parseInt(e.target.value) || 0)}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="25"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={formData.status || "PLUGGED_IN"}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {VEHICLE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fleet ID <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formData.fleetId || ""}
          onChange={(e) => handleChange("fleetId", parseInt(e.target.value) || undefined)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="3"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Vehicle"}
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

