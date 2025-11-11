import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import AppointmentDetailsModal from "@/components/Admin/AppointmentDetailsModal";
import AppointmentCard from "@/components/Admin/AppointmentCard";
import SearchBar from "@/components/Common/SearchBar";
import FilterDropdown from "@/components/Common/FilterDropdown";
import ActiveFilters from "@/components/Common/ActiveFilters";
import { useApiData } from "@/hooks/useApiData";
import { useSearch } from "@/hooks/useSearch";
import { useFilter } from "@/hooks/useFilter";
import { useSort } from "@/hooks/useSort";
import { useModal } from "@/hooks/useModal";

const AppointmentsList = () => {
  const {
    data: appointments,
    filteredData: filteredAppointments,
    loading,
    refetch,
  } = useApiData("/appointment", {
    entityName: "appointments",
    dataKey: "appointments",
  });

  const {
    searchQuery,
    handleSearch,
    filteredData: searchFilteredData,
  } = useSearch(appointments, [
    "doctor.name",
    "patient.name",
    "doctor.specialization",
    "patient.email",
    "patient.contact",
    "status",
    "appointment_time",
  ]);

  const appointmentFilterConfig = {
    status: {
      type: "select",
      label: "Status",
      options: [
        { value: "Scheduled", label: "Scheduled" },
        { value: "Completed", label: "Completed" },
        { value: "Cancelled", label: "Cancelled" },
        { value: "Pending", label: "Pending" },
        { value: "Rejected", label: "Rejected" },
      ],
    },
  };

  const {
    filteredData: filterFilteredData,
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
  } = useFilter(
    searchQuery ? searchFilteredData : filteredAppointments || [],
    appointmentFilterConfig
  );

  const { sortedData, sortField, sortOrder, handleSort } = useSort(
    filterFilteredData,
    "appointment_time",
    "asc"
  );

  const detailsModal = useModal();

  // Sort options - only date options
  const appointmentSortOptions = [
    { value: "appointment_time-asc", label: "Date: Oldest First" },
    { value: "appointment_time-desc", label: "Date: Newest First" },
  ];

  // Handle sort selection
  const handleSortSelection = (value) => {
    if (value === "") {
      handleSort(""); // Clear sort
      return;
    }

    const [field, order] = value.split("-");
    handleSort(field, order); // Set both field and order
  };

  // Get current sort value for dropdown
  const getCurrentSortValue = () => {
    if (!sortField) return "";
    return `${sortField}-${sortOrder}`;
  };

  // Get display label for current sort
  const getSortDisplayLabel = () => {
    if (!sortField) return "";
    const currentOption = appointmentSortOptions.find(
      (opt) => opt.value === getCurrentSortValue()
    );
    return currentOption ? currentOption.label : "";
  };

  const handleViewAppointment = (appointment) => {
    detailsModal.open(appointment);
  };

  const handleModalClose = () => {
    detailsModal.close();
    refetch();
  };

  const displayData = sortedData;

  return (
    <>
      <div className="min-h-screen bg-ui-surface flex flex-col">
        {/* Header */}
        <header className="border-b border-ui-border px-4 md:px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Appointments List
          </h1>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Search and Filters Section */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex-1">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search appointments by doctor, patient, specialization, status..."
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="w-full sm:w-40">
                <FilterDropdown
                  label="Status"
                  options={appointmentFilterConfig.status.options}
                  value={filters.status}
                  onChange={(value) => updateFilter("status", value)}
                  onClear={() => clearFilter("status")}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-48">
                <FilterDropdown
                  label="Sort by"
                  options={appointmentSortOptions}
                  value={getCurrentSortValue()}
                  onChange={handleSortSelection}
                  onClear={() => handleSortSelection("")}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <ActiveFilters
            filters={filters}
            filterConfig={appointmentFilterConfig}
            onClearFilter={clearFilter}
            onClearAll={clearAllFilters}
          />

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
            </div>
          ) : displayData.length === 0 ? (
            <div className="text-center py-12 px-4">
              {!appointments || appointments.length === 0 ? (
                <p className="text-muted-foreground text-base md:text-lg">
                  No appointments found
                </p>
              ) : (
                <>
                  <p className="text-muted-foreground text-base md:text-lg mb-2">
                    No appointments match your search and filters
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-xs md:text-sm text-muted-foreground">
                  Showing {displayData.length} of {appointments.length}{" "}
                  appointments
                  {sortField && ` • ${getSortDisplayLabel()}`}
                </p>
              </div>

              {/* Appointments List - Fixed scrolling container */}
              <div className="h-[calc(100vh-220px)] md:h-[calc(100vh-215px)] overflow-y-auto">
                <div className="space-y-3 pr-1 md:pr-2 pb-6">
                  {displayData.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      onClick={handleViewAppointment}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Details & Delete Modal */}
      <AppointmentDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={handleModalClose}
        appointment={detailsModal.selectedItem}
        onDelete={handleModalClose}
      />
    </>
  );
};

export default AppointmentsList;
