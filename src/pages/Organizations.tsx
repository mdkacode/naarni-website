import React, { useState } from "react";
import { Button } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useOrganizations } from "../hooks/useOrganizations";
import { PageLayout } from "../components/PageLayout";
import { PageHeader } from "../components/PageHeader";
import { PageContent } from "../components/PageContent";
import { LoadingState, ErrorState, EmptyState } from "../components/PageStates";
import { OrganizationForm } from "../components/OrganizationForm";
import type { Organization } from "../types/organization";
import { formatDate } from "../utils/formatters";

const EMPTY_STATE_ICON = (
  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
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
    <PageLayout
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    >
      <PageHeader
        title="Organizations"
        description="Manage organizations"
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        actions={
          <>
            <Button
              type="primary"
              size="large"
              onClick={handleCreate}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              + Create New
            </Button>
            <Button
              type="primary"
              danger
              size="large"
              onClick={logout}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Logout
            </Button>
          </>
        }
      />

      <PageContent>
        <div className="flex h-[calc(100vh-180px)]">
          {/* Left: Organization List */}
          <div className="w-full md:w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-colors">
            {loading ? (
              <LoadingState message="Loading organizations..." />
            ) : error ? (
              <ErrorState error={error} onRetry={fetchOrganizations} />
            ) : organizations.length === 0 ? (
              <EmptyState
                title="No organizations found"
                message="Get started by creating a new organization."
                icon={EMPTY_STATE_ICON}
              />
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSelect(org)}
                    className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedOrg?.id === org.id ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600 dark:border-blue-400" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{org.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{org.type?.replace("_", " ")}</p>
                        {org.email && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{org.email}</p>
                        )}
                        {org.createdAt && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            Created: {formatDate(org.createdAt)}
                          </p>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div className="hidden md:block w-1/2 bg-white dark:bg-gray-800 overflow-y-auto transition-colors">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#1E40AF] dark:text-blue-400 mb-6">
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
                <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                  <p>Select an organization from the list to edit</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContent>
    </PageLayout>
  );
};

export default Organizations;

