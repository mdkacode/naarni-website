// User API Service
import { fetchWithAuth } from "../utils/api";
import type { User, UserCreateRequest, UserUpdateRequest, UserListResponse } from "../types/user";

export const userService = {
  getUsers: async (token: string): Promise<UserListResponse> => {
    const response = await fetchWithAuth<UserListResponse>("/users", token);
    return response;
  },
  
  getUserById: async (token: string, userId: string): Promise<User> => {
    const response = await fetchWithAuth<User>(`/users/${userId}`, token);
    return response.body || response;
  },
  
  createUser: async (token: string, data: UserCreateRequest): Promise<User> => {
    const response = await fetchWithAuth<any>("/users", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.body || response;
  },
  
  updateUser: async (token: string, userId: string, data: UserUpdateRequest): Promise<User> => {
    const response = await fetchWithAuth<any>(`/users/${userId}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.body || response;
  },
  
  extractUserData: (response: UserListResponse): User[] => {
    // Handle nested structure: response.body.content
    if (response.body && typeof response.body === 'object' && 'content' in response.body && Array.isArray(response.body.content)) {
      return response.body.content.map((user: any) => ({
        ...user,
        id: user.account?.uuid || user.id,
        uuid: user.account?.uuid,
        phone: user.account?.phone,
        email: user.account?.email,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        organizationId: user.account?.organizationId,
        isPhoneVerified: user.account?.isPhoneVerified,
        isEmailVerified: user.account?.isEmailVerified,
        userStatus: user.account?.userStatus,
        createdAt: user.account?.createdAt,
        lastModifiedAt: user.account?.lastModifiedAt,
      }));
    }
    // Handle flat structure
    if (Array.isArray(response.body)) {
      return response.body.map((user: any) => ({
        ...user,
        id: user.account?.uuid || user.id,
        uuid: user.account?.uuid,
      }));
    }
    if (Array.isArray(response.content)) {
      return response.content.map((user: any) => ({
        ...user,
        id: user.account?.uuid || user.id,
        uuid: user.account?.uuid,
      }));
    }
    return [];
  },
};

