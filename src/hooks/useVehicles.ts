// Custom Hook for Vehicle Management
import { useState, useEffect } from "react";
import { vehicleService } from "../services/vehicleService";
import type { Vehicle, VehicleFilterRequest } from "../types/vehicle";

interface UseVehiclesReturn {
  vehicles: Vehicle[];
  loading: boolean;
  error: string;
  fetchVehicles: (filterRequest?: VehicleFilterRequest) => Promise<void>;
  createVehicle: (data: Partial<Vehicle>) => Promise<void>;
  associateFleet: (vehicleId: number, fleetId: number) => Promise<void>;
  disassociateFleet: (vehicleId: number) => Promise<void>;
}

export const useVehicles = (token: string | null): UseVehiclesReturn => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVehicles = async (filterRequest?: VehicleFilterRequest) => {
    if (!token) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await vehicleService.getVehicles(token, filterRequest);
      const vehicleList = vehicleService.extractVehicleData(response);
      setVehicles(vehicleList);
    } catch (err: any) {
      setError(err.message || "Failed to fetch vehicles");
      if (err.message === "UNAUTHORIZED") {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const createVehicle = async (data: Partial<Vehicle>) => {
    if (!token) return;
    
    setError("");
    try {
      await vehicleService.createVehicle(token, data);
      await fetchVehicles();
    } catch (err: any) {
      setError(err.message || "Failed to create vehicle");
      throw err;
    }
  };

  const associateFleet = async (vehicleId: number, fleetId: number) => {
    if (!token) throw new Error("No token available");
    
    setError("");
    try {
      await vehicleService.associateFleet(token, vehicleId, fleetId);
      await fetchVehicles(); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to associate fleet");
      throw err;
    }
  };

  const disassociateFleet = async (vehicleId: number) => {
    if (!token) throw new Error("No token available");
    
    setError("");
    try {
      await vehicleService.disassociateFleet(token, vehicleId);
      await fetchVehicles(); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to disassociate fleet");
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      fetchVehicles();
    }
  }, [token]);

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    createVehicle,
    associateFleet,
    disassociateFleet,
  };
};

