// Route Type Definitions
export interface Route {
  id?: number;
  name?: string;
  description?: string;
  startCityId?: number;
  endCityId?: number;
  startCityName?: string;
  endCityName?: string;
  distance?: number;
  estimatedDuration?: number;
  routeType?: "ONE_WAY" | "TO_FRO";
  createdAt?: string | number;
  lastModifiedAt?: string | number;
  toFro?: boolean;
  oneWay?: boolean;
  [key: string]: any;
}

export interface RouteCreateRequest {
  id?: number;
  name: string;
  description?: string;
  startCityId: number;
  endCityId: number;
  startCityName?: string;
  endCityName?: string;
  distance: number;
  estimatedDuration: number;
  routeType: "ONE_WAY" | "TO_FRO";
}

export interface RouteUpdateRequest {
  id?: number;
  name: string;
  description?: string;
  startCityId: number;
  endCityId: number;
  startCityName?: string;
  endCityName?: string;
  distance: number;
  estimatedDuration: number;
  routeType: "ONE_WAY" | "TO_FRO";
}

export interface RouteListResponse {
  body?: Route[];
  content?: Route[];
  [key: string]: any;
}

export interface RouteResponse {
  body?: Route;
  statusCode?: number;
  success?: boolean;
  errorMessage?: string;
  code?: string;
}

