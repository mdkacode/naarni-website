// Fleet Type Definitions
export interface Fleet {
  id: number;
  name?: string;
  organizationId?: number;
  organizationName?: string;
  status?: string;
  vehicleCount?: number;
  createdAt?: string | number;
  updatedAt?: string | number;
  lastModifiedAt?: string | number;
  [key: string]: any;
}

export interface FleetListResponse {
  body?: {
    content?: Fleet[];
    totalElements?: number;
    totalPages?: number;
    page?: number;
    size?: number;
  };
  content?: Fleet[];
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
  [key: string]: any;
}
