import React, { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import AppointmentDetailsModal from "@/components/Admin/AppointmentDetailsModal";
import AppointmentCard from "@/components/Admin/AppointmentCard";
import SearchBar from "@/components/Common/SearchBar";
import { api } from "@/lib/axiosHeader";

const AppointmentsList = () => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/appointment");
      setAppointments(response.data.appointments);
      setFilteredAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setFilteredAppointments(appointments);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = appointments.filter(
      (appointment) =>
        appointment.doctor?.name?.toLowerCase().includes(query) ||
        appointment.patient?.name?.toLowerCase().includes(query) ||
        appointment.doctor?.specialization?.toLowerCase().includes(query) ||
        appointment.patient?.email?.toLowerCase().includes(query) ||
        appointment.patient?.contact?.includes(query) ||
        appointment.status?.toLowerCase().includes(query) ||
        appointment.appointment_time?.includes(query)
    );
    setFilteredAppointments(filtered);
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedAppointment(null);
    fetchAppointments(); // Refresh the list when modal closes
  };

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
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              {appointments.length === 0 ? (
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
                  Showing {filteredAppointments.length} of {appointments.length}{" "}
                  appointments
                </p>
              </div>

              {/* Appointments List - Fixed scrolling container */}
              <div className="h-[calc(100vh-215px)] overflow-y-auto">
                <div className="space-y-3 pr-2 pb-6">
                  {filteredAppointments.map((appointment) => (
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
        isOpen={isDetailsModalOpen}
        onClose={handleModalClose}
        appointment={selectedAppointment}
        onDelete={handleModalClose}
      />
    </>
  );
};

export default AppointmentsList;
