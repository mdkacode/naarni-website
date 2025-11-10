// Custom hook for managing cities
import { useState, useEffect, useCallback } from "react";
import { cityService } from "../services/cityService";
import type { City, CityCreateRequest, CityUpdateRequest } from "../types/city";

export const useCities = (token: string | null) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cityService.getCities(token);
      const cityData = cityService.extractCityData(response);
      setCities(cityData);
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
      await fetchCities(); // Refresh list
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
  }, [token, fetchCities]);

  const updateCity = useCallback(async (cityId: number, data: CityUpdateRequest): Promise<City> => {
    if (!token) throw new Error("No token available");
    
    setLoading(true);
    setError(null);
    try {
      const updatedCity = await cityService.updateCity(token, cityId, data);
      await fetchCities(); // Refresh list
      return updatedCity;
    } catch (err: any) {
      const errorMessage = err?.errorMessage || err?.response?.data?.errorMessage || err?.message || "Failed to update city";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchCities]);

  const deleteCity = useCallback(async (cityId: number): Promise<void> => {
    if (!token) throw new Error("No token available");
    
    setLoading(true);
    setError(null);
    try {
      await cityService.deleteCity(token, cityId);
      await fetchCities(); // Refresh list
    } catch (err: any) {
      const errorMessage = err?.errorMessage || err?.response?.data?.errorMessage || err?.message || "Failed to delete city";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchCities]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return {
    cities,
    loading,
    error,
    fetchCities,
    createCity,
    updateCity,
    deleteCity,
  };
};

