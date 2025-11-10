// Custom hook for managing users
import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/userService";
import type { User, UserCreateRequest, UserUpdateRequest } from "../types/user";

export const useUsers = (token: string | null) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers(token);
      const userData = userService.extractUserData(response);
      setUsers(userData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createUser = useCallback(async (data: UserCreateRequest): Promise<User> => {
    if (!token) throw new Error("No token available");
    
    setLoading(true);
    setError(null);
    try {
      const newUser = await userService.createUser(token, data);
      await fetchUsers(); // Refresh list
      return newUser;
    } catch (err: any) {
      // Preserve the original error with all its properties
      const errorMessage = err?.errorMessage || err?.response?.data?.errorMessage || err?.message || "Failed to create user";
      setError(errorMessage);
      // Create a new error object that preserves all error information
      const error = new Error(errorMessage) as any;
      error.response = err?.response;
      error.errorMessage = err?.errorMessage || errorMessage;
      throw error;
    } finally {
      setLoading(false);
    }
  }, [token, fetchUsers]);

  const updateUser = useCallback(async (userId: string, data: UserUpdateRequest): Promise<User> => {
    if (!token) throw new Error("No token available");
    
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(token, userId, data);
      await fetchUsers(); // Refresh list
      return updatedUser;
    } catch (err: any) {
      setError(err.message || "Failed to update user");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
  };
};

