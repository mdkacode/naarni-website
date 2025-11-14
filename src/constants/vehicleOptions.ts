// Vehicle Options Constants
export const VEHICLE_MAKES = ["AZAD"] as const;

export const VEHICLE_MODELS = ["AZAD 12 M Luxury Intercity AC Coach", "AZAD 12.5 M Luxury intercity AC Coach - seater cum sleeper"] as const;

export const VEHICLE_STATUSES = [
  "PLUGGED_IN",
  "MOVING",
  "NOT_MOVING",
  "MAINTENANCE",
  "INACTIVE",
] as const;

export type VehicleMake = typeof VEHICLE_MAKES[number];
export type VehicleModel = typeof VEHICLE_MODELS[number];
export type VehicleStatus = typeof VEHICLE_STATUSES[number];

