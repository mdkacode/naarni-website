// Users Management Page
import React, { useState } from "react";
import { Row, Col, Card } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useUsers } from "../hooks/useUsers";
import { useOrganizations } from "../hooks/useOrganizations";
import { Sidebar } from "../components/Sidebar";
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

const LoadingState = () => (
  <div className="flex justify-center items-center py-20">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading users...</p>
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
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Retry
    </button>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20">
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
  </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <Row gutter={[16, 16]} align="middle" justify="space-between">
              <Col xs={24} sm={24} md={16} lg={18}>
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1E40AF]">User Management</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Manage and view all users</p>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={8} lg={6}>
                {!showForm && (
                  <button
                    onClick={handleCreate}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Create New User
                  </button>
                )}
              </Col>
            </Row>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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
                <Card
                  id="user-form-card"
                  title={
                    <span className="text-xl sm:text-2xl font-bold text-[#1E40AF]">
                      {editingUser ? "Edit User" : "Create New User"}
                    </span>
                  }
                  className="shadow-xl"
                >
                  <UserForm
                    user={editingUser || undefined}
                    organizations={organizations}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={formLoading}
                  />
                </Card>
              ) : (
                <Card
                  title={
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#1E40AF] mb-1">User List</h2>
                      <p className="text-sm sm:text-base text-gray-600">Manage and view all users</p>
                    </div>
                  }
                  className="shadow-xl"
                >
                  {loading ? (
                    <LoadingState />
                  ) : error ? (
                    <ErrorState error={error} onRetry={handleRetry} />
                  ) : users.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <UserList users={users} loading={loading} onEdit={handleEdit} />
                  )}
                </Card>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Users;

