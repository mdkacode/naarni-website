// LocalStorage Utilities
const STORAGE_KEYS = {
  ACCESS_TOKEN: "admin_access_token",
  DEVICE_ID: "admin_device_id",
  DEVICE_UUID: "admin_device_uuid",
  PHONE: "admin_phone",
} as const;

export const storage = {
  get: (key: keyof typeof STORAGE_KEYS): string | null => {
    return localStorage.getItem(STORAGE_KEYS[key]);
  },
  
  set: (key: keyof typeof STORAGE_KEYS, value: string): void => {
    localStorage.setItem(STORAGE_KEYS[key], value);
  },
  
  remove: (key: keyof typeof STORAGE_KEYS): void => {
    localStorage.removeItem(STORAGE_KEYS[key]);
  },
  
  clear: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};

