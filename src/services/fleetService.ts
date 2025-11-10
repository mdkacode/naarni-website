// Fleet API Service
import type { FleetListResponse } from "../types/fleet";
import { fetchWithAuth } from "../utils/api";
// import { FleetListResponse } from "../types/fleet";

export const fleetService = {
  getFleets: async (token: string, page: number = 0, limit: number = 20): Promise<FleetListResponse> => {
    return fetchWithAuth<FleetListResponse>(`/fleets?page=${page}&limit=${limit}`, token);
  },
  
  extractFleetData: (response: FleetListResponse) => ({
    fleets: response.body?.content || response.content || [],
    totalPages: response.body?.totalPages || response.totalPages || 0,
    totalElements: response.body?.totalElements || response.totalElements || 0,
  }),
};

