// Users Management Page
import React, { useState } from "react";
import { Row, Col, Button } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useUsers } from "../hooks/useUsers";
import { useOrganizations } from "../hooks/useOrganizations";
import { PageLayout } from "../components/PageLayout";
import { PageHeader } from "../components/PageHeader";
import { PageContent } from "../components/PageContent";
import { LoadingState, ErrorState, EmptyState } from "../components/PageStates";
import { UserList } from "../components/UserList";
import { UserForm } from "../components/UserForm";
import { StatsCard } from "../components/StatsCard";
import type { User, UserCreateRequest, UserUpdateRequest } from "../types/user";

const STATS_ICONS = {
  users: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
};

const EMPTY_STATE_ICON = (
  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const Users: React.FC = () => {
  const { token } = useAuth();
  const { users, loading, error, fetchUsers, createUser, updateUser } = useUsers(token);
  const { organizations } = useOrganizations(token);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
    // Scroll to form when editing
    setTimeout(() => {
      const formElement = document.getElementById('user-form-card');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleSubmit = async (data: UserCreateRequest | UserUpdateRequest) => {
    setFormLoading(true);
    try {
      if (editingUser) {
        const userId = editingUser.account?.uuid || editingUser.uuid || editingUser.id;
        if (userId) {
          await updateUser(userId, data as UserUpdateRequest);
        }
      } else {
        // Create user first
        const newUser = await createUser(data as UserCreateRequest);
        
        // Immediately verify phone and email after successful creation
        const userId = newUser.account?.uuid || newUser.uuid || newUser.id;
        if (userId) {
          try {
            await updateUser(userId, {
              account: {
                isPhoneVerified: true,
                isEmailVerified: true,
                userStatus: "ACTIVE",
              },
            } as UserUpdateRequest);
          } catch (verifyError: any) {
            // Log but don't fail the entire operation if verification update fails
            console.warn("Failed to auto-verify user:", verifyError);
          }
        }
      }
      // Only close form and reset on success
      setShowForm(false);
      setEditingUser(null);
    } catch (err: any) {
      console.error("Error saving user:", err);
      // Re-throw error so UserForm can handle it and display the message
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleRetry = () => {
    fetchUsers();
  };

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    >
      <PageHeader
        title="User Management"
        description="Manage and view all users"
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        actions={
          !showForm ? (
            <Button
              type="primary"
              size="large"
              onClick={handleCreate}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Create New User
            </Button>
          ) : undefined
        }
      />

      <PageContent>
          {/* Stats Card */}
          <Row gutter={[16, 16]} className="mb-6 sm:mb-8">
            <Col xs={24} sm={24} md={8} lg={6}>
              <StatsCard
                title="Total Users"
                value={users.length}
                icon={STATS_ICONS.users}
                borderColor="border-blue-500"
                bgColor="bg-blue-100"
                iconColor="text-blue-600"
              />
            </Col>
          </Row>

          {/* User List or Form */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              {showForm ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
                  <div className="p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1E40AF] dark:text-blue-400 mb-6">
                      {editingUser ? "Edit User" : "Create New User"}
                    </h2>
                    <UserForm
                      user={editingUser || undefined}
                      organizations={organizations}
                      onSubmit={handleSubmit}
                      onCancel={handleCancel}
                      loading={formLoading}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800">
                    <h2 className="text-2xl font-bold text-[#1E40AF] dark:text-blue-400">User List</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and view all users</p>
                  </div>

                  {loading ? (
                    <LoadingState message="Loading users..." />
                  ) : error ? (
                    <ErrorState error={error} onRetry={handleRetry} />
                  ) : users.length === 0 ? (
                    <EmptyState
                      title="No users"
                      message="Get started by creating a new user."
                      icon={EMPTY_STATE_ICON}
                    />
                  ) : (
                    <UserList users={users} loading={loading} onEdit={handleEdit} />
                  )}
                </div>
              )}
            </Col>
          </Row>
      </PageContent>
    </PageLayout>
  );
};

export default Users;

