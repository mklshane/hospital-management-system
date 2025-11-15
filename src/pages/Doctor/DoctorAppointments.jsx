import React, { useState, useMemo } from "react";
import AppointmentsBoard from "@/components/Doctor/AppointmentsBoard";
import AppointmentDetails from "@/components/Doctor/AppointmentDetails";
import MedicalRecordModal from "@/components/Doctor/MedicalRecordModal";
import DeleteModal from "@/components/Common/DeleteModal";
import AppointmentActionModal from "@/components/Doctor/AppointmentActionModal";
import { useApiData } from "@/hooks/useApiData";
import { useCrudOperations } from "@/hooks/useCrudOperations";

const DoctorAppointments = () => {
  const {
    data: appointments = [],
    loading: loadingAppointments,
    refetch: refetchAppointments,
  } = useApiData("/appointment", {
    entityName: "appointments",
    dataKey: "appointments",
  });

  const {
    update: updateAppointment,
    deleteItem: deleteAppointment,
    actionLoading,
  } = useCrudOperations("Appointment", refetchAppointments);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([
    "pending",
    "scheduled",
    "completed",
  ]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [actionModal, setActionModal] = useState({
    open: false,
    type: null,
    appointment: null,
  });

  // Handlers
  const openDeleteModal = (appt) => {
    setAppointmentToDelete(appt);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setAppointmentToDelete(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!appointmentToDelete) return;
    const ok = await deleteAppointment(appointmentToDelete._id, "/appointment");
    if (ok) {
      setSelectedAppointment(null);
      closeDeleteModal();
    }
  };

  const openActionModal = (type, appt) => {
    setActionModal({ open: true, type, appointment: appt });
  };

  const closeActionModal = () => {
    setActionModal({ open: false, type: null, appointment: null });
  };

  const confirmAction = async () => {
    if (!actionModal.appointment) return;
    const newStatus = actionModal.type === "accept" ? "Scheduled" : "Rejected";
    const ok = await updateAppointment(
      actionModal.appointment._id,
      { status: newStatus },
      "/appointment"
    );
    if (ok) {
      setSelectedAppointment((prev) =>
        prev?._id === actionModal.appointment._id
          ? { ...prev, status: newStatus }
          : prev
      );
      closeActionModal();
    }
  };

  const onRecordSaved = async () => {
    setIsRecordModalOpen(false);
    refetchAppointments();
    setRefreshTrigger((p) => p + 1);
    if (selectedAppointment?._id) {
      await updateAppointment(
        selectedAppointment._id,
        { status: "Completed" },
        "/appointment"
      );
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 grid grid-cols-12 mb-8 gap-3 overflow-hidden min-h-0">
        <AppointmentsBoard
          appointments={appointments}
          loading={loadingAppointments}
          refetch={refetchAppointments}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
          openActionModal={openActionModal}
          openDeleteModal={openDeleteModal}
          formatDate={formatDate}
          actionLoading={actionLoading}
        />

        <AppointmentDetails
          appointment={selectedAppointment}
          formatDate={formatDate}
          openActionModal={openActionModal}
          openDeleteModal={openDeleteModal}
          setIsRecordModalOpen={setIsRecordModalOpen}
          refreshTrigger={refreshTrigger}
          actionLoading={actionLoading}
        />
      </div>

      {/* Modals */}
      <MedicalRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        appointment={{
          _id: selectedAppointment?._id,
          patientName: selectedAppointment?.patient?.name,
          date: formatDate(selectedAppointment?.appointment_date),
          time: selectedAppointment?.appointment_time,
          notes: selectedAppointment?.notes,
        }}
        onRecordSaved={onRecordSaved}
        refetchAppointments={refetchAppointments}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Appointment"
        description="This will permanently remove the appointment and any associated medical record."
        confirmText="Delete Appointment"
        cancelText="Keep Appointment"
        loading={actionLoading[appointmentToDelete?._id]}
        itemName={
          appointmentToDelete
            ? `${appointmentToDelete.patient?.name} – ${formatDate(
                appointmentToDelete.appointment_date
              )} at ${appointmentToDelete.appointment_time}`
            : ""
        }
      />

      <AppointmentActionModal
        isOpen={actionModal.open}
        onClose={closeActionModal}
        appointment={actionModal.appointment}
        onConfirm={confirmAction}
        loading={actionLoading[actionModal.appointment?._id]}
        actionType={actionModal.type}
      />
    </div>
  );
};

export default DoctorAppointments;
