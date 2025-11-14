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
  updateVehicle: (vehicleId: number, data: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (vehicleId: number) => Promise<void>;
  associateFleet: (vehicleId: number, fleetId: number) => Promise<void>;
  disassociateFleet: (vehicleId: number) => Promise<void>;
  associateRoute: (vehicleId: number, routeId: number, notes?: string) => Promise<void>;
  disassociateRoute: (vehicleId: number, routeId: number, reason?: string) => Promise<void>;
  associateDevice: (vehicleId: number, deviceId: number, installedBy: string) => Promise<void>;
  disassociateDevice: (vehicleId: number, deviceId: number, uninstalledBy?: string, reason?: string) => Promise<void>;
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
      // If no filter request provided, fetch all vehicles first to get registration numbers
      let request = filterRequest;
      if (!request) {
        // First fetch to get all vehicles
        const initialResponse = await vehicleService.getVehicles(token);
        const initialVehicles = vehicleService.extractVehicleData(initialResponse);
        
        // Extract all registration numbers
        const registrationNumbers = initialVehicles
          .map(v => v.registrationNumber)
          .filter((reg): reg is string => !!reg);
        
        // If we have registration numbers, fetch with filter to get enriched data
        if (registrationNumbers.length > 0) {
          request = {
            filterContext: {
              registrationNumbers: registrationNumbers,
            },
            select: ["FLEET_ID", "OPERATOR_ID", "ROUTE_ID", "DEVICE_ID", "VEHICLE", "FLEET", "ROUTE", "DEVICE"]
          };
        }
      } else {
        // Ensure select array is included in the request
        request = {
          ...request,
          select: request.select || ["FLEET_ID", "OPERATOR_ID", "ROUTE_ID", "DEVICE_ID", "VEHICLE", "FLEET", "ROUTE", "DEVICE"]
        };
      }
      
      const response = await vehicleService.getVehicles(token, request);
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

  const updateVehicle = async (vehicleId: number, data: Partial<Vehicle>) => {
    if (!token) throw new Error("No token available");
    
    setError("");
    try {
      await vehicleService.updateVehicle(token, vehicleId, data);
      await fetchVehicles(); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to update vehicle");
      throw err;
    }
  };

  const deleteVehicle = async (vehicleId: number) => {
    console.log("deleteVehicle called in hook with ID:", vehicleId);
    if (!token) throw new Error("No token available");
    
    setError("");
    try {
      console.log("Calling vehicleService.deleteVehicle");
      await vehicleService.deleteVehicle(token, vehicleId);
      console.log("Service call successful, refreshing list");
      await fetchVehicles(); // Refresh list
      console.log("List refreshed");
    } catch (err: any) {
      console.error("Error in deleteVehicle hook:", err);
      setError(err.message || "Failed to delete vehicle");
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

  const associateRoute = async (vehicleId: number, routeId: number, notes?: string) => {
    if (!token) throw new Error("No token available");
    
    setError("");
    try {
      await vehicleService.associateRoute(token, vehicleId, routeId, notes);
      await fetchVehicles(); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to associate route");
      throw err;
    }
  };

  const disassociateRoute = async (vehicleId: number, routeId: number, reason?: string) => {
    if (!token) throw new Error("No token available");
    
    setError("");
    try {
      await vehicleService.disassociateRoute(token, vehicleId, routeId, reason);
      await fetchVehicles(); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to disassociate route");
      throw err;
    }
  };

  const associateDevice = async (vehicleId: number, deviceId: number, installedBy: string) => {
    if (!token) throw new Error("No token available");
    
    setError("");
    try {
      await vehicleService.associateDevice(token, vehicleId, deviceId, installedBy);
      await fetchVehicles(); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to associate device");
      throw err;
    }
  };

  const disassociateDevice = async (vehicleId: number, deviceId: number, uninstalledBy?: string, reason?: string) => {
    if (!token) throw new Error("No token available");
    
    setError("");
    try {
      await vehicleService.disassociateDevice(token, vehicleId, deviceId, uninstalledBy, reason);
      await fetchVehicles(); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to disassociate device");
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
    updateVehicle,
    deleteVehicle,
    associateFleet,
    disassociateFleet,
    associateRoute,
    disassociateRoute,
    associateDevice,
    disassociateDevice,
  };
};

