// Custom Hook for Fleet Management
import { useState, useEffect } from "react";
import { fleetService } from "../services/fleetService";
import type { Fleet } from "../types/fleet";
// import { Fleet } from "../types/fleet";

interface UseFleetsReturn {
  fleets: Fleet[];
  loading: boolean;
  error: string;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  fetchFleets: (page: number) => Promise<void>;
  createFleet: (data: any) => Promise<void>;
}

export const useFleets = (token: string | null): UseFleetsReturn => {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchFleets = async (page: number) => {
    if (!token) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await fleetService.getFleets(token, page);
      const { fleets: fleetList, totalPages: pages, totalElements: total } = 
        fleetService.extractFleetData(response);
      
      setFleets(fleetList);
      setTotalPages(pages);
      setTotalElements(total);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || "Failed to fetch fleets");
      if (err.message === "UNAUTHORIZED") {
        throw err; // Let parent handle redirect
      }
    } finally {
      setLoading(false);
    }
  };

  const createFleet = async (data: any) => {
    if (!token) throw new Error("No token available");
    
    setError("");
    try {
      await fleetService.createFleet(token, data);
      await fetchFleets(currentPage); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to create fleet");
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      fetchFleets(0);
    }
  }, [token]);

  return {
    fleets,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    fetchFleets,
    createFleet,
  };
};

