// Routes Management Page
import React, { useState } from "react";
import { Row, Col, Card } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useRoutes } from "../hooks/useRoutes";
import { Sidebar } from "../components/Sidebar";
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

const LoadingState = () => (
  <div className="flex justify-center items-center py-20">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading routes...</p>
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No routes found</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by creating a new route.</p>
  </div>
);

export const Routes: React.FC = () => {
  const { token, logout } = useAuth();
  const { routes, loading, error, fetchRoutes, createRoute, updateRoute } = useRoutes(token);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={16}>
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1E40AF]">Routes</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Route Management System</p>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
                  <button
                    onClick={handleCreate}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    + Create Route
                  </button>
                  <button
                    onClick={logout}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Logout
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <Card id="route-form-card" className="shadow-xl">
              <h2 className="text-2xl font-bold text-[#1E40AF] mb-6">
                {editingRoute ? "Edit Route" : "Create New Route"}
              </h2>
              <RouteForm
                route={editingRoute || undefined}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={formLoading}
              />
            </Card>
          ) : (
            <Card className="shadow-xl">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <h2 className="text-2xl font-bold text-[#1E40AF]">Route List</h2>
                <p className="text-gray-600 mt-1">Manage and view all routes</p>
              </div>

              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={handleRetry} />
              ) : routes.length === 0 ? (
                <EmptyState />
              ) : (
                <RouteList
                  routes={routes}
                  loading={loading}
                  onEdit={handleEdit}
                />
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Routes;

