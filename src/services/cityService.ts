// City API Service
import { API_BASE_URL, fetchWithAuth } from "../utils/api";
import type { City, CityCreateRequest, CityUpdateRequest, CityListResponse, CityResponse } from "../types/city";

export const cityService = {
  getCities: async (token: string): Promise<CityListResponse> => {
    const response = await fetchWithAuth<CityListResponse>("/cities", token);
    return response;
  },
  
  getCityById: async (token: string, cityId: number): Promise<City> => {
    const response = await fetchWithAuth<CityResponse>(`/cities/${cityId}`, token);
    return response.body || response as any;
  },
  
  createCity: async (token: string, data: CityCreateRequest): Promise<City> => {
    const response = await fetchWithAuth<CityResponse>("/cities", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.body || response as any;
  },
  
  updateCity: async (token: string, cityId: number, data: CityUpdateRequest): Promise<City> => {
    const response = await fetchWithAuth<CityResponse>(`/cities/${cityId}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.body || response as any;
  },
  
  deleteCity: async (token: string, cityId: number): Promise<void> => {
    await fetchWithAuth<any>(`/cities/${cityId}`, token, {
      method: "DELETE",
    });
  },
  
  extractCityData: (response: CityListResponse): City[] => {
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

