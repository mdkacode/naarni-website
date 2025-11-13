// City Type Definitions
export interface City {
  id?: number;
  name?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  createdAt?: string | number;
  lastModifiedAt?: string | number;
  [key: string]: any;
}

export interface CityCreateRequest {
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface CityUpdateRequest {
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface CityListResponse {
  body?: {
    content?: City[];
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
    first?: boolean;
    last?: boolean;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
  content?: City[];
  statusCode?: number;
  success?: boolean;
  errorMessage?: string | null;
  code?: string | null;
  [key: string]: any;
}

export interface CityResponse {
  body?: City;
  statusCode?: number;
  success?: boolean;
  errorMessage?: string;
  code?: string;
}

