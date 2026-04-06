// Fleet API Service
import type { FleetListResponse } from "../types/fleet";
import { fetchWithAuth } from "../utils/api";

export interface FleetCreateRequest {
  name: string;
  description?: string;
  organizationId: number;
  financierOrganizationId?: number;
  contactNumber?: string;
  email?: string;
  isOperator?: boolean;
}

export const fleetService = {
  getFleets: async (token: string, page: number = 0, limit: number = 20): Promise<FleetListResponse> => {
    return fetchWithAuth<FleetListResponse>(`/fleets?page=${page}&limit=${limit}`, token);
  },
  
  createFleet: async (token: string, data: FleetCreateRequest): Promise<any> => {
    return fetchWithAuth(`/fleets`, token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  extractFleetData: (response: FleetListResponse) => ({
    fleets: response.body?.content || response.content || [],
    totalPages: response.body?.totalPages || response.totalPages || 0,
    totalElements: response.body?.totalElements || response.totalElements || 0,
  }),
};

