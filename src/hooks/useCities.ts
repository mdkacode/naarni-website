// Custom hook for managing cities
import { useState, useEffect, useCallback, useRef } from "react";
import { cityService } from "../services/cityService";
import type { City, CityCreateRequest, CityUpdateRequest } from "../types/city";

interface PaginationData {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const useCities = (token: string | null) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const isInitialMount = useRef(true);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchCities = useCallback(async (page: number = 0, size: number = 20, search?: string) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cityService.getCities(token, page, size, search);
      const cityData = cityService.extractCityData(response);
      const paginationData = cityService.extractPaginationData(response);
      setCities(cityData);
      setPagination(paginationData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createCity = useCallback(async (data: CityCreateRequest): Promise<City> => {
    if (!token) throw new Error("No token available");
    
    setLoading(true);
    setError(null);
    try {
      const newCity = await cityService.createCity(token, data);
      await fetchCities(pagination.page, pagination.size, searchQuery || undefined); // Refresh list with current page and search
      return newCity;
    } catch (err: any) {
      const errorMessage = err?.errorMessage || err?.response?.data?.errorMessage || err?.message || "Failed to create city";
      setError(errorMessage);
      const error = new Error(errorMessage) as any;
      error.response = err?.response;
      error.errorMessage = errorMessage;
      throw error;
    } finally {
      setLoading(false);
    }
  }, [token, fetchCities, pagination.page, pagination.size, searchQuery]);

  const updateCity = useCallback(async (cityId: number, data: CityUpdateRequest): Promise<City> => {
    if (!token) throw new Error("No token available");
    
    setLoading(true);
    setError(null);
    try {
      const updatedCity = await cityService.updateCity(token, cityId, data);
      await fetchCities(pagination.page, pagination.size, searchQuery || undefined); // Refresh list with current page and search
      return updatedCity;
    } catch (err: any) {
      const errorMessage = err?.errorMessage || err?.response?.data?.errorMessage || err?.message || "Failed to update city";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchCities, pagination.page, pagination.size, searchQuery]);

  const deleteCity = useCallback(async (cityId: number): Promise<void> => {
    if (!token) throw new Error("No token available");
    
    setLoading(true);
    setError(null);
    try {
      await cityService.deleteCity(token, cityId);
      await fetchCities(pagination.page, pagination.size, searchQuery || undefined); // Refresh list with current page and search
    } catch (err: any) {
      const errorMessage = err?.errorMessage || err?.response?.data?.errorMessage || err?.message || "Failed to delete city";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchCities, pagination.page, pagination.size, searchQuery]);

  useEffect(() => {
    // Initial load
    if (!token) return;
    fetchCities(0, 20);
    isInitialMount.current = false;
  }, [token, fetchCities]);

  useEffect(() => {
    // Reset to first page when search changes (debounced)
    // Skip on initial mount to avoid double fetch
    if (!token || isInitialMount.current) return;
    
    const timeoutId = setTimeout(() => {
      fetchCities(0, pagination.size, searchQuery || undefined);
    }, 300); // Debounce search by 300ms
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, pagination.size, fetchCities, token]);

  return {
    cities,
    loading,
    error,
    pagination,
    searchQuery,
    setSearchQuery,
    fetchCities,
    createCity,
    updateCity,
    deleteCity,
  };
};

