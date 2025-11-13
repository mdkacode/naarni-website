// Custom Hook for Device Management
import { useState, useEffect } from "react";
import { deviceService } from "../services/deviceService";
import type { VehicleDevice, DeviceCreateRequest } from "../types/device";

interface UseDevicesReturn {
  devices: VehicleDevice[];
  loading: boolean;
  error: string;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  fetchDevices: (page: number) => Promise<void>;
  createDevice: (data: DeviceCreateRequest) => Promise<void>;
}

export const useDevices = (token: string | null): UseDevicesReturn => {
  const [devices, setDevices] = useState<VehicleDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchDevices = async (page: number) => {
    if (!token) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await deviceService.getDevices(token, page);
      const { devices: deviceList, totalPages: pages, totalElements: total } = 
        deviceService.extractDeviceData(response);
      
      setDevices(deviceList);
      setTotalPages(pages);
      setTotalElements(total);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || "Failed to fetch devices");
      if (err.message === "UNAUTHORIZED") {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const createDevice = async (data: DeviceCreateRequest) => {
    if (!token) throw new Error("No token available");
    
    setError("");
    try {
      await deviceService.createDevice(token, data);
      await fetchDevices(currentPage); // Refresh list with current page
    } catch (err: any) {
      setError(err.message || "Failed to create device");
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      fetchDevices(0);
    }
  }, [token]);

  return {
    devices,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    fetchDevices,
    createDevice,
  };
};

