// Routes Management Page
import React, { useState } from "react";
import { Row, Col,  Button } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useRoutes } from "../hooks/useRoutes";
import { PageLayout } from "../components/PageLayout";
import { PageHeader } from "../components/PageHeader";
import { PageContent } from "../components/PageContent";
import { LoadingState, ErrorState, EmptyState } from "../components/PageStates";
import { RouteList } from "../components/RouteList";
import { RouteForm } from "../components/RouteForm";
import { StatsCard } from "../components/StatsCard";
import type { Route, RouteCreateRequest, RouteUpdateRequest } from "../types/route";

const STATS_ICONS = {
  routes: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
};

const EMPTY_STATE_ICON = (
  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

export const Routes: React.FC = () => {
  const { token, logout } = useAuth();
  const { routes, loading, error, fetchRoutes, createRoute, updateRoute, deleteRoute } = useRoutes(token);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCreate = () => {
    setEditingRoute(null);
    setShowForm(true);
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setShowForm(true);
    // Scroll to form when editing
    setTimeout(() => {
      const formElement = document.getElementById('route-form-card');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRoute(null);
  };

  const handleSubmit = async (data: RouteCreateRequest | RouteUpdateRequest) => {
    setFormLoading(true);
    try {
      if (editingRoute && editingRoute.id) {
        await updateRoute(editingRoute.id, data as RouteUpdateRequest);
      } else {
        await createRoute(data as RouteCreateRequest);
      }
      // Only close form and reset on success
      setShowForm(false);
      setEditingRoute(null);
    } catch (err: any) {
      console.error("Error saving route:", err);
      // Error is handled by RouteForm component
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleRetry = () => {
    fetchRoutes();
  };

  const handleDelete = async (route: Route) => {
    if (!route.id) return;
    try {
      await deleteRoute(route.id);
    } catch (err: any) {
      console.error("Error deleting route:", err);
      // Error is handled by the hook
    }
  };

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    >
      <PageHeader
        title="Routes"
        description="Route Management System"
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        actions={
          <>
            <Button
              type="primary"
              size="large"
              onClick={handleCreate}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              + Create Route
            </Button>
            <Button
              type="primary"
              danger
              size="large"
              onClick={logout}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Logout
            </Button>
          </>
        }
      />

      <PageContent>
          {/* Stats Card */}
          <Row gutter={[16, 16]} className="mb-8">
            <Col xs={24} sm={12} md={8}>
              <StatsCard
                title="Total Routes"
                value={routes.length}
                icon={STATS_ICONS.routes}
                borderColor="border-blue-500"
                bgColor="bg-blue-100"
                iconColor="text-blue-600"
              />
            </Col>
          </Row>

          {/* Route List or Form */}
          {showForm ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#1E40AF] dark:text-blue-400 mb-6">
                  {editingRoute ? "Edit Route" : "Create New Route"}
                </h2>
                <RouteForm
                  route={editingRoute || undefined}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  loading={formLoading}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800">
                <h2 className="text-2xl font-bold text-[#1E40AF] dark:text-blue-400">Route List</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and view all routes</p>
              </div>

              {loading ? (
                <LoadingState message="Loading routes..." />
              ) : error ? (
                <ErrorState error={error} onRetry={handleRetry} />
              ) : routes.length === 0 ? (
                <EmptyState
                  title="No routes found"
                  message="Get started by creating a new route."
                  icon={EMPTY_STATE_ICON}
                />
              ) : (
                <RouteList
                  routes={routes}
                  loading={loading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          )}
      </PageContent>
    </PageLayout>
  );
};

export default Routes;

