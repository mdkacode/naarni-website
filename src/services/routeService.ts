// Route API Service
import { fetchWithAuth } from "../utils/api";
import type { Route, RouteCreateRequest, RouteUpdateRequest, RouteListResponse, RouteResponse } from "../types/route";

export const routeService = {
  getRoutes: async (token: string): Promise<RouteListResponse> => {
    const response = await fetchWithAuth<RouteListResponse>("/routes", token);
    return response;
  },
  
  getRouteById: async (token: string, routeId: number): Promise<Route> => {
    const response = await fetchWithAuth<RouteResponse>(`/routes/${routeId}`, token);
    return response.body || response as any;
  },
  
  createRoute: async (token: string, data: RouteCreateRequest): Promise<Route> => {
    const response = await fetchWithAuth<RouteResponse>("/routes", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.body || response as any;
  },
  
  updateRoute: async (token: string, routeId: number, data: RouteUpdateRequest): Promise<Route> => {
    const response = await fetchWithAuth<RouteResponse>(`/routes/${routeId}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.body || response as any;
  },
  
  deleteRoute: async (token: string, routeId: number): Promise<void> => {
    await fetchWithAuth(`/routes/${routeId}`, token, {
      method: "DELETE",
    });
  },
  
  extractRouteData: (response: RouteListResponse): Route[] => {
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

