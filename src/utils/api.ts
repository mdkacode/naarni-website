// API Configuration and Utilities
// Use proxy in both dev and production to avoid CORS issues
export const API_BASE_URL = "/api/v1";

export const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const handleApiError = async (response: Response): Promise<never> => {
  const errorData = await response.json().catch(() => ({}));
  // Extract errorMessage from API response structure
  const errorMessage = errorData.errorMessage || errorData.message || `API Error: ${response.statusText}`;
  const error = new Error(errorMessage) as any;
  // Attach the full error data for better error handling
  error.response = { data: errorData, status: response.status };
  error.errorMessage = errorMessage;
  throw error;
};

export const fetchWithAuth = async <T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(token),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    await handleApiError(response);
  }

  return response.json();
};

