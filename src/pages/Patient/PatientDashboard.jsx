import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";

import PatientProfile from "@/components/Patient/PatientProfile";
import AppointmentHistory from "@/components/Patient/AppointmentHistory";
import BookAppointmentModal from "@/components/Patient/BookAppointmentModal";
import PatientAppointmentDetailsModal from "@/components/Patient/PatientAppointmentDetailsModal";
import Calendar from "@/components/Patient/Calendar";

import { usePatientAppointments } from "@/hooks/usePatientAppointments";
import { useApiData } from "@/hooks/useApiData";
import { useModal } from "@/hooks/useModal";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import { useSearch } from "@/hooks/useSearch";

export default function PatientDashboard() {
  const { user } = useAuth();

  // Fetch appointments
  const {
    appointments,
    loading: appointmentsLoading,
    refetch: refetchAppointments,
  } = usePatientAppointments(user?._id);

  // Fetch doctors
  const {
    data: doctors,
    loading: doctorsLoading,
    refetch: refetchDoctors,
  } = useApiData("/doctor", {
    entityName: "doctors",
    dataKey: "doctors",
  });

  const {
    searchQuery,
    handleSearch,
    filteredData: filteredAppointments,
  } = useSearch(
    appointments.filter((apt) => apt.status !== "Cancelled"), 
    ["doctor.name", "appointment_date", "notes"]
  );

  // Modals
  const bookAppointmentModal = useModal();
  const appointmentDetailsModal = useModal();

  // CRUD
  const { create, loading: submitting } = useCrudOperations(
    "Appointment",
    refetchAppointments
  );

  // Form
  const [form, setForm] = useState({
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  // Handlers
  const handleOpenBookModal = () => {
    refetchDoctors();
    bookAppointmentModal.open();
  };

  const handleAppointmentClick = (appointment) => {
    appointmentDetailsModal.open(appointment);
  };

  const handleCloseDetailsModal = () => {
    appointmentDetailsModal.close();
  };

  const handleAppointmentUpdate = () => {
    refetchAppointments();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    if (!form.doctor_id || !form.appointment_date || !form.appointment_time) {
      toast.error("Please fill all required fields");
      return;
    }

    const success = await create(
      {
        doctor_id: form.doctor_id,
        patient_id: user._id,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        notes: form.notes,
      },
      "/appointment"
    );

    if (success) {
      bookAppointmentModal.close();
      setForm({
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        notes: "",
      });
    }
  };

  return (
    <div className="h-full rounded-2xl overflow-hidden">
      <div className="max-w-7xl mx-auto h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
          <aside className="lg:col-span-3 gap-4 flex flex-col h-full overflow-hidden">
            <div className="min-h-0">
              <PatientProfile user={user} />
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full">
              <Calendar appointments={appointments} />
              </div>
            </div>
          </aside>

          <main className="lg:col-span-9 h-full overflow-y-auto">
            <div className="h-full flex flex-col">
              <AppointmentHistory
                appointments={filteredAppointments}
                loading={appointmentsLoading}
                searchTerm={searchQuery}
                setSearchTerm={handleSearch}
                onNewAppointment={handleOpenBookModal}
                onAppointmentClick={handleAppointmentClick}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <BookAppointmentModal
        isOpen={bookAppointmentModal.isOpen}
        onClose={bookAppointmentModal.close}
        doctors={doctors}
        form={form}
        onChange={handleFormChange}
        onSubmit={handleSubmitAppointment}
        submitting={submitting}
      />

      <PatientAppointmentDetailsModal
        isOpen={appointmentDetailsModal.isOpen}
        onClose={handleCloseDetailsModal}
        appointment={appointmentDetailsModal.selectedItem}
        onUpdate={handleAppointmentUpdate}
      />
    </div>
  );
}
