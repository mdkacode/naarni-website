// Device/Vehicle Device Type Definitions
export interface VehicleDevice {
  id?: number;
  deviceId?: number;
  vehicleId?: number;
  deviceUuid?: string;
  vehicleNumber?: string;
  status?: string;
  installedAt?: string | number;
  createdAt?: string | number;
  updatedAt?: string | number;
  lastModifiedAt?: string | number;
  [key: string]: any;
}

export interface DeviceListResponse {
  body?: {
    content?: VehicleDevice[];
    totalElements?: number;
    totalPages?: number;
    page?: number;
    size?: number;
  };
  content?: VehicleDevice[];
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
  [key: string]: any;
}

