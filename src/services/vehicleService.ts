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
    
    // Send POST to proxy (Vite plugin in dev, Vercel function in production)
    // Both convert POST to GET with body
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
  },
  
  createVehicle: async (token: string, data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await fetchWithAuth<any>("/vehicles", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.body || response;
  },

  updateVehicle: async (token: string, vehicleId: number, data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await fetchWithAuth<any>(`/vehicles/${vehicleId}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.body || response;
  },

  deleteVehicle: async (token: string, vehicleId: number): Promise<void> => {
    console.log("vehicleService.deleteVehicle called with ID:", vehicleId);
    const result = await fetchWithAuth(`/vehicles/${vehicleId}`, token, {
      method: "DELETE",
    });
    console.log("Delete API call completed, result:", result);
    //@ts-ignore
    return result;
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

  associateRoute: async (token: string, vehicleId: number, routeId: number, notes?: string): Promise<void> => {
    let url = `/vehicles/associate-route?vehicleId=${vehicleId}&routeId=${routeId}`;
    if (notes) {
      url += `&notes=${encodeURIComponent(notes)}`;
    }
    await fetchWithAuth<any>(url, token, {
      method: "POST",
    });
  },

  disassociateRoute: async (token: string, vehicleId: number, routeId: number, reason?: string): Promise<void> => {
    let url = `/vehicles/disassociate-route?vehicleId=${vehicleId}&routeId=${routeId}`;
    if (reason) {
      url += `&reason=${encodeURIComponent(reason)}`;
    }
    await fetchWithAuth<any>(url, token, {
      method: "POST",
    });
  },

  associateDevice: async (token: string, vehicleId: number, deviceId: number, installedBy: string): Promise<void> => {
    const url = `/vehicles/associate-device?deviceId=${deviceId}&vehicleId=${vehicleId}&installedBy=${encodeURIComponent(installedBy)}`;
    await fetchWithAuth<any>(url, token, {
      method: "POST",
    });
  },

  disassociateDevice: async (token: string, vehicleId: number, deviceId: number, uninstalledBy?: string, reason?: string): Promise<void> => {
    let url = `/vehicles/disassociate-device?deviceId=${deviceId}&vehicleId=${vehicleId}`;
    if (uninstalledBy) {
      url += `&uninstalledBy=${encodeURIComponent(uninstalledBy)}`;
    }
    if (reason) {
      url += `&reason=${encodeURIComponent(reason)}`;
    }
    await fetchWithAuth<any>(url, token, {
      method: "POST",
    });
  },

  getVehicleFilter: async (token: string, filterRequest: VehicleFilterRequest): Promise<VehicleListResponse> => {
    const filterData: VehicleFilterRequest = {
      ...filterRequest,
      select: filterRequest.select || ["FLEET_ID", "OPERATOR_ID", "ROUTE_ID", "DEVICE_ID", "VEHICLE", "FLEET", "ROUTE", "DEVICE"]
    };
    
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
        "Failed to fetch vehicle filter data"
      );
    }
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

