import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import AppointmentDetailsModal from "@/components/Admin/AppointmentDetailsModal";
import AppointmentCard from "@/components/Admin/AppointmentCard";
import SearchBar from "@/components/Common/SearchBar";
import { useApiData } from "@/hooks/useApiData";
import { useSearch } from "@/hooks/useSearch";
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

  const { searchQuery, handleSearch, filteredData } = useSearch(appointments, [
    "doctor.name",
    "patient.name",
    "doctor.specialization",
    "patient.email",
    "patient.contact",
    "status",
    "appointment_time",
  ]);

  const detailsModal = useModal();

  const handleViewAppointment = (appointment) => {
    detailsModal.open(appointment);
  };

  const handleModalClose = () => {
    detailsModal.close();
    refetch();
  };

  // Use filteredData from useSearch when searching, otherwise use filteredAppointments from useApiData
  const displayData = searchQuery ? filteredData : filteredAppointments || [];

  return (
    <>
      <div className="min-h-screen bg-ui-surface flex flex-col">
        {/* Header */}
        <header className="border-b border-ui-border px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">
            Appointments List
          </h1>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search Bar */}
          <div className="mb-3">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search appointments by doctor, patient, specialization, status..."
              className="max-w-xl"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
            </div>
          ) : displayData.length === 0 ? (
            <div className="text-center py-12">
              {!appointments || appointments.length === 0 ? (
                <p className="text-muted-foreground text-lg">
                  No appointments found
                </p>
              ) : (
                <>
                  <p className="text-muted-foreground text-lg mb-2">
                    No appointments match your search
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search terms
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {displayData.length} of {appointments.length}{" "}
                  appointments
                </p>
              </div>

              {/* Appointments List - Fixed scrolling container */}
              <div className="h-[calc(100vh-215px)] overflow-y-auto">
                <div className="space-y-3 pr-2 pb-6">
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
