// Cities Management Page
import React, { useState } from "react";
import { Row, Col, Card, message, Pagination, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { useCities } from "../hooks/useCities";
import { Sidebar } from "../components/Sidebar";
import { CityList } from "../components/CityList";
import { CityForm } from "../components/CityForm";
import { StatsCard } from "../components/StatsCard";
import type { City, CityCreateRequest, CityUpdateRequest } from "../types/city";

const STATS_ICONS = {
  cities: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const LoadingState = () => (
  <div className="flex justify-center items-center py-20">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading cities...</p>
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No cities found</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by creating a new city.</p>
  </div>
);

export const Cities: React.FC = () => {
  const { token, logout } = useAuth();
  const { cities, loading, error, pagination, searchQuery, setSearchQuery, fetchCities, createCity, updateCity, deleteCity } = useCities(token);
  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCreate = () => {
    setEditingCity(null);
    setShowForm(true);
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setShowForm(true);
    // Scroll to form when editing
    setTimeout(() => {
      const formElement = document.getElementById('city-form-card');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDelete = async (city: City) => {
    if (!city.id) return;
    
    try {
      await deleteCity(city.id);
      message.success(`City "${city.name}" deleted successfully`);
    } catch (err: any) {
      message.error(err?.message || "Failed to delete city");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCity(null);
  };

  const handleSubmit = async (data: CityCreateRequest | CityUpdateRequest) => {
    setFormLoading(true);
    try {
      if (editingCity && editingCity.id) {
        await updateCity(editingCity.id, data as CityUpdateRequest);
        message.success("City updated successfully");
      } else {
        await createCity(data as CityCreateRequest);
        message.success("City created successfully");
      }
      // Only close form and reset on success
      setShowForm(false);
      setEditingCity(null);
    } catch (err: any) {
      console.error("Error saving city:", err);
      // Error is handled by CityForm component
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleRetry = () => {
    fetchCities(pagination.page, pagination.size, searchQuery || undefined);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    fetchCities(page - 1, pageSize, searchQuery || undefined); // API uses 0-based indexing, Ant Design uses 1-based
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1E40AF]">Cities</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">City Management System</p>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
                  {!showForm && (
                    <button
                      onClick={handleCreate}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      + Create City
                    </button>
                  )}
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
                title="Total Cities"
                value={pagination.totalElements}
                icon={STATS_ICONS.cities}
                borderColor="border-blue-500"
                bgColor="bg-blue-100"
                iconColor="text-blue-600"
              />
            </Col>
          </Row>

          {/* City List or Form */}
          {showForm ? (
            <Card id="city-form-card" className="shadow-xl">
              <h2 className="text-2xl font-bold text-[#1E40AF] mb-6">
                {editingCity ? "Edit City" : "Create New City"}
              </h2>
              <CityForm
                city={editingCity || undefined}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={formLoading}
              />
            </Card>
          ) : (
            <Card className="shadow-xl">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1E40AF]">City List</h2>
                    <p className="text-gray-600 mt-1">Manage and view all cities</p>
                  </div>
                  <div className="w-full sm:w-64">
                    <Input
                      placeholder="Search cities..."
                      prefix={<SearchOutlined className="text-gray-400" />}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      allowClear
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={handleRetry} />
              ) : cities.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <CityList
                    cities={cities}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                  {pagination.totalPages > 1 && (
                    <div className="mt-6 flex justify-center pb-4">
                      <Pagination
                        current={pagination.page + 1} // Convert 0-based to 1-based for Ant Design
                        pageSize={pagination.size}
                        total={pagination.totalElements}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} cities`}
                        onChange={handlePageChange}
                        onShowSizeChange={handlePageChange}
                        pageSizeOptions={['10', '20', '50', '100']}
                      />
                    </div>
                  )}
                </>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cities;

