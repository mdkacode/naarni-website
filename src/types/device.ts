// Device/Vehicle Device Type Definitions
export interface VehicleDevice {
  id?: number;
  deviceId?: string | number;
  vehicleId?: number;
  deviceUuid?: string;
  vehicleNumber?: string;
  deviceType?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  firmwareVersion?: string;
  status?: string;
  isActive?: boolean;
  installedAt?: string | number;
  createdAt?: string | number;
  updatedAt?: string | number;
  lastModifiedAt?: string | number;
  [key: string]: any;
}

export interface DeviceCreateRequest {
  deviceId: string;
  deviceType: string;
  manufacturer: string;
  model: string;
  serialNumber?: string;
  firmwareVersion: string;
  status: string;
  isActive: boolean;
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

