// City API Service
import { fetchWithAuth } from "../utils/api";
import type { City, CityCreateRequest, CityUpdateRequest, CityListResponse, CityResponse } from "../types/city";

export const cityService = {
  getCities: async (token: string, page: number = 0, size: number = 20, search?: string): Promise<CityListResponse> => {
    let url = `/cities?page=${page}&size=${size}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    const response = await fetchWithAuth<CityListResponse>(url, token);
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
    // Handle paginated structure: response.body.content
    if (response.body?.content && Array.isArray(response.body.content)) {
      return response.body.content;
    }
    // Handle nested structure: response.body (array)
    if (response.body && Array.isArray(response.body)) {
      return response.body;
    }
    // Handle content array
    if (Array.isArray(response.content)) {
      return response.content;
    }
    return [];
  },

  extractPaginationData: (response: CityListResponse) => {
    if (response.body) {
      return {
        page: response.body.page ?? 0,
        size: response.body.size ?? 20,
        totalElements: response.body.totalElements ?? 0,
        totalPages: response.body.totalPages ?? 0,
        first: response.body.first ?? false,
        last: response.body.last ?? false,
        hasNext: response.body.hasNext ?? false,
        hasPrevious: response.body.hasPrevious ?? false,
      };
    }
    return {
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
      hasNext: false,
      hasPrevious: false,
    };
  },
};

