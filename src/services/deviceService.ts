// Device API Service
import { fetchWithAuth } from "../utils/api";
import type { DeviceListResponse } from "../types/device";

export const deviceService = {
  getDevices: async (token: string, page: number = 0, limit: number = 20): Promise<DeviceListResponse> => {
    return fetchWithAuth<DeviceListResponse>(`/vehicle-devices?page=${page}&limit=${limit}`, token);
  },
  
  extractDeviceData: (response: DeviceListResponse) => ({
    devices: response.body?.content || response.content || [],
    totalPages: response.body?.totalPages || response.totalPages || 0,
    totalElements: response.body?.totalElements || response.totalElements || 0,
  }),
};

