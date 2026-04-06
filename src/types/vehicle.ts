// Vehicle Type Definitions
export interface Vehicle {
  id?: number;
  registrationNumber?: string;
  make?: string;
  model?: string;
  year?: number;
  vehicleType?: string;
  capacity?: number;
  fleetId?: number;
  operatorId?: number;
  routeId?: number;
  deviceId?: number;
  status?: string;
  fleet?: any;
  operator?: any;
  route?: any;
  device?: any;
  createdAt?: string | number;
  updatedAt?: string | number;
  lastModifiedAt?: string | number;
  [key: string]: any;
}

export interface VehicleFilterRequest {
  filterContext?: {
    operatorIds?: number[];
    fleetIds?: number[];
    routeIds?: number[];
    registrationNumbers?: string[];
    hasActiveDevice?: boolean;
    [key: string]: any;
  };
  select?: string[];
}

export interface VehicleListResponse {
  body?: {
    vehicles?: Vehicle[];
    fleets?: any[];
    devices?: any[];
    routes?: any[];
    vehicleIds?: number[];
    vehicleToFleetId?: { [key: string]: number };
    vehicleToOperatorIds?: { [key: string]: { [key: string]: boolean } };
    vehicleToDeviceIds?: { [key: string]: { [key: string]: boolean } };
    vehicleToActiveDeviceIds?: { [key: string]: number };
    vehicleToActiveVendorDeviceIds?: { [key: string]: string };
    vehicleToRouteIds?: { [key: string]: { [key: string]: boolean } };
    page?: any;
    [key: string]: any;
  };
  vehicles?: Vehicle[];
  content?: Vehicle[];
  statusCode?: number;
  success?: boolean;
  errorMessage?: string | null;
  code?: string | null;
  [key: string]: any;
}

