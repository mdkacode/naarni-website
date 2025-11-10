// User Type Definitions
export interface UserAccount {
  uuid?: string;
  phone?: string;
  email?: string | null;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  organizationId?: number | null;
  userStatus?: string;
  lastLoginAt?: string | number | null;
  createdAt?: string | number;
  lastModifiedAt?: string | number;
  [key: string]: any;
}

export interface UserProfile {
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  profilePictureUrl?: string | null;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | string;
  createdAt?: string | number;
  lastModifiedAt?: string | number;
  [key: string]: any;
}

export interface User {
  account?: UserAccount;
  profile?: UserProfile;
  // For backward compatibility and easier access
  id?: string;
  uuid?: string;
  phone?: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | string;
  organizationId?: number | null;
  organizationName?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  userStatus?: string;
  createdAt?: string | number;
  updatedAt?: string | number;
  lastModifiedAt?: string | number;
  [key: string]: any;
}

export interface UserCreateRequest {
  account: {
    phone: string;
    email?: string;
    organizationId?: number;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
  };
  profile?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
  };
}

export interface UserUpdateRequest {
  account: {
    phone?: string;
    email?: string;
    organizationId?: number;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
    firstName?: string;
    lastName?: string;
    userStatus?: string;
  };
  profile?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
  };
}

export interface UserListResponse {
  body?: User[] | {
    content?: User[];
    [key: string]: any;
  };
  content?: User[];
  [key: string]: any;
}

