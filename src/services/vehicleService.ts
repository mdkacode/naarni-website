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
    
    // Extract devices array to map device information
    const devices = response.body?.devices || [];
    const deviceMap = new Map(devices.map((device: any) => [device.id, device]));
    
    // Extract routes array to map route information
    const routes = response.body?.routes || [];
    const routeMap = new Map(routes.map((route: any) => [route.id, route]));
    
    // Extract vehicle to device mappings
    const vehicleToActiveDeviceIds = response.body?.vehicleToActiveDeviceIds || {};
    const vehicleToDeviceIds = response.body?.vehicleToDeviceIds || {};
    const vehicleToFleetId = response.body?.vehicleToFleetId || {};
    const vehicleToRouteIds = response.body?.vehicleToRouteIds || {};
    
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
    
    // Map fleet names, routes, and device information to vehicles
    return vehicles.map((vehicle) => {
      let enrichedVehicle = { ...vehicle };
      const vehicleIdStr = String(vehicle.id || '');
      
      // Map fleet information from vehicleToFleetId mapping
      const mappedFleetId = vehicleToFleetId[vehicleIdStr] || vehicle.fleetId;
      if (mappedFleetId && fleetMap.has(mappedFleetId)) {
        const fleet = fleetMap.get(mappedFleetId);
        enrichedVehicle = {
          ...enrichedVehicle,
          fleetId: mappedFleetId,
          fleet: {
            ...vehicle.fleet,
            id: fleet.id,
            name: fleet.name,
            organizationId: fleet.organizationId,
            organizationName: fleet.organizationName,
          },
        };
      }
      
      // Map route information from vehicleToRouteIds mapping
      const vehicleRouteIds = vehicleToRouteIds[vehicleIdStr];
      if (vehicleRouteIds && typeof vehicleRouteIds === 'object') {
        // Find the first active route (where value is true)
        const activeRouteId = Object.keys(vehicleRouteIds).find(
          (routeId) => vehicleRouteIds[routeId] === true
        );
        if (activeRouteId) {
          const route = routeMap.get(Number(activeRouteId));
          if (route) {
            enrichedVehicle = {
              ...enrichedVehicle,
              routeId: route.id,
              route: {
                ...vehicle.route,
                id: route.id,
                name: route.name,
                startCityName: route.startCityName,
                endCityName: route.endCityName,
                startCityId: route.startCityId,
                endCityId: route.endCityId,
              },
            };
          }
        }
      }
      
      // Map device information - check both active and inactive devices
      const activeDeviceId = vehicleToActiveDeviceIds[vehicleIdStr];
      const vehicleDeviceIds = vehicleToDeviceIds[vehicleIdStr];
      
      // First, try to get active device
      if (activeDeviceId) {
        const device = deviceMap.get(activeDeviceId) || deviceMap.get(Number(activeDeviceId));
        if (device) {
          enrichedVehicle = {
            ...enrichedVehicle,
            deviceId: device.id || device.deviceId || activeDeviceId,
            deviceStatus: 'ACTIVE',
            device: {
              ...vehicle.device,
              id: device.id || device.deviceId,
              deviceId: device.deviceId || device.id,
              deviceType: device.deviceType,
              manufacturer: device.manufacturer,
              model: device.model,
              serialNumber: device.serialNumber,
              status: device.status,
            },
          };
        } else {
          enrichedVehicle = {
            ...enrichedVehicle,
            deviceId: activeDeviceId,
            deviceStatus: 'ACTIVE',
          };
        }
      } else if (vehicleDeviceIds && typeof vehicleDeviceIds === 'object') {
        // Check for any device (active or inactive)
        const deviceEntries = Object.entries(vehicleDeviceIds);
        if (deviceEntries.length > 0) {
          // Find the first device (prefer active, but show inactive if that's all we have)
          const activeEntry = deviceEntries.find(([_, isActive]) => isActive === true);
          const deviceEntry = activeEntry || deviceEntries[0];
          const [deviceIdStr, isActive] = deviceEntry;
          const deviceId = Number(deviceIdStr);
          const device = deviceMap.get(deviceId);
          
          if (device) {
            enrichedVehicle = {
              ...enrichedVehicle,
              deviceId: device.id || device.deviceId || deviceId,
              deviceStatus: isActive ? 'ACTIVE' : 'INACTIVE',
              device: {
                ...vehicle.device,
                id: device.id || device.deviceId,
                deviceId: device.deviceId || device.id,
                deviceType: device.deviceType,
                manufacturer: device.manufacturer,
                model: device.model,
                serialNumber: device.serialNumber,
                status: device.status,
              },
            };
          } else {
            enrichedVehicle = {
              ...enrichedVehicle,
              deviceId: deviceId,
              deviceStatus: isActive ? 'ACTIVE' : 'INACTIVE',
            };
          }
        }
      }
      
      return enrichedVehicle;
    });
  },
};

