import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axiosHeader";
import { Plus } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import toast from "react-hot-toast";

import PatientProfile from "@/components/Patient/PatientProfile";
import AppointmentHistory from "@/components/Patient/AppointmentHistory";
import BookAppointmentModal from "@/components/Patient/BookAppointmentModal";
import { usePatientAppointments } from "@/hooks/usePatientAppointments";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { appointments, loading, refetch } = usePatientAppointments(user?._id);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/doctor");
      setDoctors(data.doctors || []);
    } catch {
      toast.error("Failed to load doctors");
    }
  };

  const handleOpenModal = () => {
    fetchDoctors();
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctor_id || !form.appointment_date || !form.appointment_time) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/appointment", {
        doctor_id: form.doctor_id,
        patient_id: user._id,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        notes: form.notes,
      });
      toast.success("Appointment booked!");
      await refetch();
      setModalOpen(false);
      setForm({
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        notes: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-full rounded-2xl border border-neutral-200 bg-primary-foreground shadow-sm dark:border-neutral-800 dark:bg-neutral-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">
              Patient Dashboard
            </h1>
            <div className="flex gap-4">
              <button
                onClick={handleOpenModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                New Appointment
              </button>
              <ThemeToggle />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <PatientProfile user={user} />
            <AppointmentHistory
              appointments={appointments}
              loading={loading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onNewAppointment={handleOpenModal}
            />
          </div>
        </div>
      </div>

      <BookAppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        doctors={doctors}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </>
  );
}
