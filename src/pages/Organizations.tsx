import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useOrganizations } from "../hooks/useOrganizations";
import { Sidebar } from "../components/Sidebar";
import { OrganizationForm } from "../components/OrganizationForm";
import type { Organization } from "../types/organization";
import { formatDate } from "../utils/formatters";

const LoadingState = () => (
  <div className="flex justify-center items-center py-20">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading organizations...</p>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="p-6">
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {error}
    </div>
    <button
      onClick={onRetry}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Retry
    </button>
  </div>
);

const Organizations: React.FC = () => {
  const { token, logout } = useAuth();
  const { organizations, loading, error, fetchOrganizations, createOrganization, updateOrganization } = 
    useOrganizations(token);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleSelect = (org: Organization) => {
    setSelectedOrg(org);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedOrg(null);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setSelectedOrg(null);
    setIsCreating(false);
  };

  const handleSubmit = async (data: Partial<Organization>) => {
    setFormLoading(true);
    try {
      if (selectedOrg?.id) {
        await updateOrganization(selectedOrg.id, data);
      } else {
        await createOrganization(data);
      }
      setSelectedOrg(null);
      setIsCreating(false);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-[#1E40AF]">Organizations</h1>
                  <p className="text-gray-600 mt-1">Manage organizations</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCreate}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  + Create New
                </button>
                <button
                  onClick={logout}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left: Organization List */}
          <div className="w-full md:w-1/2 border-r border-gray-200 overflow-y-auto">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} onRetry={fetchOrganizations} />
            ) : organizations.length === 0 ? (
              <div className="text-center py-20 px-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new organization.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSelect(org)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedOrg?.id === org.id ? "bg-blue-50 border-l-4 border-blue-600" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{org.type?.replace("_", " ")}</p>
                        {org.email && (
                          <p className="text-sm text-gray-500 mt-1">{org.email}</p>
                        )}
                        {org.createdAt && (
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {formatDate(org.createdAt)}
                          </p>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div className="hidden md:block w-1/2 bg-white overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#1E40AF] mb-6">
                {isCreating ? "Create Organization" : selectedOrg ? "Edit Organization" : "Select an organization"}
              </h2>
              {isCreating || selectedOrg ? (
                <OrganizationForm
                  organization={isCreating ? null : selectedOrg}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  loading={formLoading}
                />
              ) : (
                <div className="text-center py-20 text-gray-500">
                  <p>Select an organization from the list to edit</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organizations;

