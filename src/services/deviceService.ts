
import { fetchWithAuth } from "../utils/api";
import type { DeviceListResponse, DeviceCreateRequest, VehicleDevice } from "../types/device";

export const deviceService = {
  getDevices: async (token: string, page: number = 0, limit: number = 20): Promise<DeviceListResponse> => {
    return fetchWithAuth<DeviceListResponse>(`/vehicle-devices?page=${page}&limit=${limit}`, token);
  },

  createDevice: async (token: string, data: DeviceCreateRequest): Promise<VehicleDevice> => {
    const response = await fetchWithAuth<any>("/vehicle-devices", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.body || response;
  },

  deleteDevice: async (token: string, id: number): Promise<any> => {
    return fetchWithAuth<any>(`/vehicle-devices/${id}`, token, {
      method: "DELETE",
    });
  },
  
  extractDeviceData: (response: DeviceListResponse) => ({
    devices: response.body?.content || response.content || [],
    totalPages: response.body?.totalPages || response.totalPages || 0,
    totalElements: response.body?.totalElements || response.totalElements || 0,
  }),
};

