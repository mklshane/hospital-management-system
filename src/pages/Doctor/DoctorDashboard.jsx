import { useState, useEffect } from "react";
import { api } from "../../lib/axiosHeader";
import { useApiData } from "@/hooks/useApiData";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import DashboardStats from "@/components/Doctor/Dashboard/DashboardStats";
import AppointmentRequests from "@/components/Doctor/Dashboard/AppointmentRequest";
import TodayAppointments from "@/components/Doctor/Dashboard/TodayAppointments";
import MedicalRecordModal from "@/components/Doctor/MedicalRecords/MedicalRecordModal";
import AppointmentActionModal from "@/components/Doctor/Appointments/AppointmentActionModal";

const DoctorDashboard = () => {
  // State
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [modal, setModal] = useState({
    isOpen: false,
    appointment: null,
    action: null,
  });
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Custom Hooks
  const {
    data: allAppointments,
    loading: appointmentsLoading,
    error: appointmentsError,
    refetch: refetchAppointments,
  } = useApiData("/appointment", {
    entityName: "Appointments",
    dataKey: "appointments", 
  });

  const { loading: actionLoading, update } = useCrudOperations(
    "Appointment",
    refetchAppointments
  );

  // Helper Functions
  const getLocalToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateString = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Data Processing
  const processAppointmentsData = () => {
    if (!allAppointments.length) {
      return { scheduledAppointments: [], requests: [] };
    }

    const today = getLocalToday();

    const scheduledAppointments = allAppointments
      .filter(
        (appt) =>
          appt.status === "Scheduled" &&
          formatDateString(appt.appointment_date) === today
      )
      .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));

    const requests = allAppointments
      .filter((appt) => appt.status === "Pending")
      .map((appt) => ({
        _id: appt._id,
        patient: appt.patient,
        appointment_date: appt.appointment_date,
        appointment_time: appt.appointment_time,
        notes: appt.notes,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.appointment_date + " " + a.appointment_time);
        const dateB = new Date(b.appointment_date + " " + b.appointment_time);
        return dateA - dateB;
      });

    return { scheduledAppointments, requests };
  };

  // API: Fetch doctor profile and stats
  const fetchDoctorProfile = async () => {
    try {
      setDoctorLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const doctorId = user?._id;

      if (!doctorId) throw new Error("Doctor ID not found");

      const docRes = await api.get(`/doctor/${doctorId}`);
      const { name, specialization } = docRes.data.doctor;
      setDoctorInfo({ name, specialization });

      const today = getLocalToday();
      const todayAppts = allAppointments.filter(
        (a) => formatDateString(a.appointment_date) === today
      );
      const scheduled = todayAppts.filter(
        (a) => a.status === "Scheduled"
      ).length;

      const pendingAll = allAppointments.filter(
        (a) => a.status === "Pending"
      ).length;
      const completedAll = allAppointments.filter(
        (a) => a.status === "Completed"
      ).length;

      const uniquePatients = new Set(allAppointments.map((a) => a.patient?._id))
        .size;

      setStats({
        today: scheduled,
        pending: pendingAll,
        completed: completedAll,
        patients: uniquePatients,
      });
    } catch (err) {
      console.error("Error loading doctor profile / stats:", err);
      setDoctorInfo({
        name: "Dr. Juan De La Cruz",
        specialization: "General Medicine",
      });
      setStats({ today: 0, pending: 0, completed: 0, patients: 0 });
    } finally {
      setDoctorLoading(false);
    }
  };

  // Handlers
  const handleStatusUpdate = async (id, newStatus) => {
    const success = await update(id, { status: newStatus }, "/appointment");
    if (success) {
      await refetchAppointments();
      await fetchDoctorProfile();
    }
  };

  const handleAddRecord = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRecordModalOpen(true);
  };

  const handleComplete = (appointment) => {
    setModal({
      isOpen: true,
      appointment,
      action: "complete",
    });
  };

  const handleConfirmComplete = async () => {
    if (!modal.appointment) return;
    await handleStatusUpdate(modal.appointment._id, "Completed");
    setModal({ isOpen: false, appointment: null, action: null });
  };

  // Effects
  useEffect(() => {
    if (allAppointments.length > 0) {
      fetchDoctorProfile();
    }
  }, [allAppointments]);

  const { scheduledAppointments, requests } = processAppointmentsData();

  return (
    <div className="h-full grid grid-cols-12 grid-rows-[auto_1fr] gap-3 pb-8 overflow-hidden bg-ui-surface">
      {/* Stats Section */}
      <DashboardStats
        stats={stats}
        doctorInfo={doctorInfo}
        loading={doctorLoading}
      />

      {/* Appointment Requests */}
      <AppointmentRequests
        requests={requests}
        loading={appointmentsLoading}
        actionLoading={actionLoading}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Today's Appointments */}
      <TodayAppointments
        appointments={scheduledAppointments}
        loading={appointmentsLoading}
        actionLoading={actionLoading}
        onRefresh={refetchAppointments}
        onAddRecord={handleAddRecord}
        onComplete={handleComplete}
      />

      {/* Modals */}
      <MedicalRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={{
          _id: selectedAppointment?._id,
          patientName: selectedAppointment?.patient?.name,
          date: formatDate(selectedAppointment?.appointment_date),
          time: selectedAppointment?.appointment_time,
          notes: selectedAppointment?.notes,
        }}
        onRecordAdded={() => {
          refetchAppointments();
          fetchDoctorProfile();
        }}
      />

      <AppointmentActionModal
        isOpen={modal.isOpen}
        onClose={() =>
          setModal({ isOpen: false, appointment: null, action: null })
        }
        appointment={modal.appointment}
        actionType={modal.action}
        loading={actionLoading[modal.appointment?._id]}
        onConfirm={handleConfirmComplete}
      />
    </div>
  );
};

export default DoctorDashboard;
