// Vehicle API Service
import axios from "axios";
import { API_BASE_URL, fetchWithAuth } from "../utils/api";
import type { Vehicle, VehicleFilterRequest, VehicleListResponse } from "../types/vehicle";

export const vehicleService = {
  getVehicles: async (token: string, filterRequest?: VehicleFilterRequest): Promise<VehicleListResponse> => {
    const defaultFilter: VehicleFilterRequest = {
      select: ["FLEET_ID", "OPERATOR_ID", "ROUTE_ID", "DEVICE_ID", "VEHICLE", "FLEET", "ROUTE", "DEVICE"]
    };
    
    const filterData = filterRequest || defaultFilter;
    
    // In development: Send POST to Vite plugin which converts to GET with body
    // In production: Need server-side proxy or backend to accept POST
    if (import.meta.env.DEV) {
      // Send POST to our proxy plugin, which converts to GET with body
      try {
        const response = await axios.post(
          `${API_BASE_URL}/vehicles/filter`,
          filterData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          throw new Error("UNAUTHORIZED");
        }
        throw new Error(
          error.response?.data?.message || 
          error.message || 
          "Failed to fetch vehicles"
        );
      }
    } else {
      // Production: Try POST (backend should accept it, or need server-side proxy)
      try {
        const response = await axios.post(
          `${API_BASE_URL}/vehicles/filter`,
          filterData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          throw new Error("UNAUTHORIZED");
        }
        throw new Error(
          error.response?.data?.message || 
          error.message || 
          "Failed to fetch vehicles. Backend may need to accept POST or provide server-side proxy."
        );
      }
    }
  },
  
  createVehicle: async (token: string, data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await fetchWithAuth<any>("/vehicles", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.body || response;
  },
  
  associateFleet: async (token: string, vehicleId: number, fleetId: number): Promise<void> => {
    await fetchWithAuth<any>(`/vehicles/${vehicleId}/associate-fleet/${fleetId}`, token, {
      method: "POST",
    });
  },
  
  disassociateFleet: async (token: string, vehicleId: number): Promise<void> => {
    await fetchWithAuth<any>(`/vehicles/${vehicleId}/disassociate-fleet`, token, {
      method: "POST",
    });
  },
  
  extractVehicleData: (response: VehicleListResponse): Vehicle[] => {
    // Extract fleets array to map fleet names
    const fleets = response.body?.fleets || [];
    const fleetMap = new Map(fleets.map((fleet: any) => [fleet.id, fleet]));
    
    // Handle nested structure: response.body.vehicles
    let vehicles: Vehicle[] = [];
    if (response.body?.vehicles) {
      vehicles = response.body.vehicles;
    } else if (Array.isArray(response.body)) {
      vehicles = response.body;
    } else if (Array.isArray(response.vehicles)) {
      vehicles = response.vehicles;
    } else if (Array.isArray(response.content)) {
      vehicles = response.content;
    }
    
    // Map fleet names to vehicles
    return vehicles.map((vehicle) => {
      if (vehicle.fleetId && fleetMap.has(vehicle.fleetId)) {
        const fleet = fleetMap.get(vehicle.fleetId);
        return {
          ...vehicle,
          fleet: {
            ...vehicle.fleet,
            id: fleet.id,
            name: fleet.name,
            organizationId: fleet.organizationId,
            organizationName: fleet.organizationName,
          },
        };
      }
      return vehicle;
    });
  },
};

