// Vehicle Goal Type Definitions
export interface VehicleGoal {
  id?: number;
  vehicleId: number;
  routeId: number;
  day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  targetKmRun: number;
  isActive?: boolean;
  effectiveFrom?: string;
  effectiveUntil?: string | null;
  notes?: string | null;
  createdBy?: string | null;
  createdAt?: string | number;
  lastModifiedAt?: string | number;
}

export interface VehicleGoalCreateRequest {
  vehicleId: number;
  routeId: number;
  day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  targetKmRun: number;
  isActive?: boolean;
}

export interface VehicleGoalListResponse {
  body?: VehicleGoal[];
  content?: VehicleGoal[];
  [key: string]: any;
}

