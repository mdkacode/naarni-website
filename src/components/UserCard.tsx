// User Card Component for Mobile
import React from "react";
import { Tag, Button } from "antd";
import type { User } from "../types/user";
import { formatDate } from "../utils/formatters";

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

const getGenderTag = (gender?: string) => {
  const genderMap: Record<string, { color: string; text: string }> = {
    MALE: { color: "blue", text: "Male" },
    FEMALE: { color: "pink", text: "Female" },
    OTHER: { color: "default", text: "Other" },
  };
  
  const genderInfo = genderMap[gender || ""] || { color: "default", text: gender || "Unknown" };
  return <Tag color={genderInfo.color}>{genderInfo.text}</Tag>;
};

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  const account = user.account || {};
  const profile = user.profile || {};
  const uuid = account.uuid || user.uuid || user.id;
  const firstName = profile.firstName || user.firstName || "";
  const lastName = profile.lastName || user.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || "Unnamed";
  const phone = account.phone || user.phone;
  const email = account.email || user.email;
  const orgId = account.organizationId || user.organizationId;
  const gender = profile.gender || user.gender;
  const dob = profile.dateOfBirth || user.dateOfBirth;
  const isPhoneVerified = account.isPhoneVerified || user.isPhoneVerified;
  const isEmailVerified = account.isEmailVerified || user.isEmailVerified;
  const createdAt = account.createdAt || user.createdAt;
  const status = account.userStatus || user.userStatus;
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 h-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">ID: {uuid ? uuid.substring(0, 8) + "..." : "N/A"}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {gender && getGenderTag(gender)}
          {status && (
            <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
          )}
        </div>
      </div>
      
      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
          <span className="text-gray-500 sm:w-24 font-medium">Phone:</span>
          <span className="text-gray-900 break-all">{phone || "N/A"}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
          <span className="text-gray-500 sm:w-24 font-medium">Email:</span>
          <span className="text-gray-900 break-all">{email || "N/A"}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
          <span className="text-gray-500 sm:w-24 font-medium">Organization:</span>
          <span className="text-gray-900 break-all">{user.organizationName || (orgId ? `Org ID: ${orgId}` : "N/A")}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
          <span className="text-gray-500 sm:w-24 font-medium">Verified:</span>
          <div className="flex gap-2 flex-wrap">
            {isPhoneVerified && <Tag color="green">Phone</Tag>}
            {isEmailVerified && <Tag color="green">Email</Tag>}
            {!isPhoneVerified && !isEmailVerified && <Tag color="default">Not Verified</Tag>}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
          <span className="text-gray-500 sm:w-24 font-medium">Created:</span>
          <span className="text-gray-900">{formatDate(createdAt)}</span>
        </div>
      </div>
      
      {onEdit && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button 
            type="primary" 
            onClick={() => onEdit(user)} 
            block
            className="w-full"
          >
            Edit User
          </Button>
        </div>
      )}
    </div>
  );
};

