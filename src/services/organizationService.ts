// Organization API Service
import { fetchWithAuth } from "../utils/api";
import type { Organization, OrganizationListResponse } from "../types/organization";

export const organizationService = {
  getOrganizations: async (token: string): Promise<OrganizationListResponse> => {
    return fetchWithAuth<OrganizationListResponse>("/organizations", token);
  },
  
  getOrganization: async (token: string, id: number): Promise<Organization> => {
    const response = await fetchWithAuth<any>(`/organizations/${id}`, token);
    return response.body || response;
  },
  
  createOrganization: async (token: string, data: Partial<Organization>): Promise<Organization> => {
    const response = await fetchWithAuth<any>("/organizations", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.body || response;
  },
  
  updateOrganization: async (token: string, id: number, data: Partial<Organization>): Promise<Organization> => {
    const response = await fetchWithAuth<any>(`/organizations/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.body || response;
  },
  
  extractOrganizationData: (response: OrganizationListResponse) => ({
    organizations: response.body?.content || response.content || [],
    totalPages: response.body?.totalPages || response.totalPages || 0,
    totalElements: response.body?.totalElements || response.totalElements || 0,
  }),
};

