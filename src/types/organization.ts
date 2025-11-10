// Organization Type Definitions
export interface Organization {
  id?: number;
  name: string;
  type: "PRIVATE" | "FLEET_OWNER" | "PUBLIC" | string;
  address?: string;
  contactNumber?: string;
  email?: string;
  isOperator?: boolean;
  createdAt?: string | number;
  updatedAt?: string | number;
  lastModifiedAt?: string | number;
  [key: string]: any;
}

export interface OrganizationListResponse {
  body?: {
    content?: Organization[];
    totalElements?: number;
    totalPages?: number;
    page?: number;
    size?: number;
  };
  content?: Organization[];
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
  [key: string]: any;
}

