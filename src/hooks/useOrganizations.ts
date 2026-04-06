// Custom Hook for Organization Management
import { useState, useEffect } from "react";
import { organizationService } from "../services/organizationService";
import type { Organization } from "../types/organization";

interface UseOrganizationsReturn {
  organizations: Organization[];
  loading: boolean;
  error: string;
  fetchOrganizations: () => Promise<void>;
  createOrganization: (data: Partial<Organization>) => Promise<void>;
  updateOrganization: (id: number, data: Partial<Organization>) => Promise<void>;
}

export const useOrganizations = (token: string | null): UseOrganizationsReturn => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrganizations = async () => {
    if (!token) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await organizationService.getOrganizations(token);
      const { organizations: orgList } = organizationService.extractOrganizationData(response);
      setOrganizations(orgList);
    } catch (err: any) {
      setError(err.message || "Failed to fetch organizations");
      if (err.message === "UNAUTHORIZED") {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async (data: Partial<Organization>) => {
    if (!token) return;
    
    setError("");
    try {
      await organizationService.createOrganization(token, data);
      await fetchOrganizations();
    } catch (err: any) {
      setError(err.message || "Failed to create organization");
      throw err;
    }
  };

  const updateOrganization = async (id: number, data: Partial<Organization>) => {
    if (!token) return;
    
    setError("");
    try {
      await organizationService.updateOrganization(token, id, data);
      await fetchOrganizations();
    } catch (err: any) {
      setError(err.message || "Failed to update organization");
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrganizations();
    }
  }, [token]);

  return {
    organizations,
    loading,
    error,
    fetchOrganizations,
    createOrganization,
    updateOrganization,
  };
};

