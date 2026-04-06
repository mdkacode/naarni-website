// Custom hook for managing routes
import { useState, useEffect, useCallback } from "react";
import { routeService } from "../services/routeService";
import type { Route, RouteCreateRequest, RouteUpdateRequest } from "../types/route";

export const useRoutes = (token: string | null) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await routeService.getRoutes(token);
      const routeData = routeService.extractRouteData(response);
      setRoutes(routeData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch routes");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createRoute = useCallback(async (data: RouteCreateRequest): Promise<Route> => {
    if (!token) throw new Error("No token available");
    
    setLoading(true);
    setError(null);
    try {
      const newRoute = await routeService.createRoute(token, data);
      await fetchRoutes(); // Refresh list
      return newRoute;
    } catch (err: any) {
      const errorMessage = err?.errorMessage || err?.response?.data?.errorMessage || err?.message || "Failed to create route";
      setError(errorMessage);
      const error = new Error(errorMessage) as any;
      error.response = err?.response;
      error.errorMessage = errorMessage;
      throw error;
    } finally {
      setLoading(false);
    }
  }, [token, fetchRoutes]);

  const updateRoute = useCallback(async (routeId: number, data: RouteUpdateRequest): Promise<Route> => {
    if (!token) throw new Error("No token available");
    
    setLoading(true);
    setError(null);
    try {
      const updatedRoute = await routeService.updateRoute(token, routeId, data);
      await fetchRoutes(); // Refresh list
      return updatedRoute;
    } catch (err: any) {
      const errorMessage = err?.errorMessage || err?.response?.data?.errorMessage || err?.message || "Failed to update route";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchRoutes]);

  const deleteRoute = useCallback(async (routeId: number): Promise<void> => {
    if (!token) throw new Error("No token available");
    
    setLoading(true);
    setError(null);
    try {
      await routeService.deleteRoute(token, routeId);
      await fetchRoutes(); // Refresh list
    } catch (err: any) {
      const errorMessage = err?.errorMessage || err?.response?.data?.errorMessage || err?.message || "Failed to delete route";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchRoutes]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return {
    routes,
    loading,
    error,
    fetchRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
  };
};

