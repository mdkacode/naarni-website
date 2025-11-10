// Vehicle Goal API Service
import { API_BASE_URL, fetchWithAuth } from "../utils/api";
import type { VehicleGoal, VehicleGoalCreateRequest, VehicleGoalListResponse } from "../types/vehicleGoal";

export const vehicleGoalService = {
  getVehicleGoals: async (token: string, vehicleId: number): Promise<VehicleGoalListResponse> => {
    const response = await fetchWithAuth<VehicleGoalListResponse>(`/vehicle-goals/vehicle/${vehicleId}`, token);
    return response;
  },
  
  createVehicleGoal: async (token: string, data: VehicleGoalCreateRequest): Promise<VehicleGoal> => {
    const response = await fetchWithAuth<any>("/vehicle-goals", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.body || response;
  },
  
  extractGoalData: (response: VehicleGoalListResponse): VehicleGoal[] => {
    // Handle array response directly
    if (Array.isArray(response)) {
      return response;
    }
    // Handle nested structure: response.body
    if (response.body && Array.isArray(response.body)) {
      return response.body;
    }
    // Handle content array
    if (Array.isArray(response.content)) {
      return response.content;
    }
    return [];
  },
};

