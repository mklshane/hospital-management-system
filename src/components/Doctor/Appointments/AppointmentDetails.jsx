import React from "react";
import {
  Calendar,
  Clock,
  SquareUserRound,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import CollapsibleSection from "./CollapsibleSection";
import AppointmentHistorySection from "./AppointmentHistorySection";
import MedicalRecordsSection from "./MedicalRecordsSection";

const AppointmentDetails = ({
  appointment,
  formatDate,
  openActionModal,
  openDeleteModal,
  setIsRecordModalOpen,
  refreshTrigger,
  actionLoading,
}) => {
  if (!appointment) {
    return (
      <div className="bg-ui-card border-2 py-2 rounded-xl flex flex-col overflow-hidden shadow-xs col-span-3">
        <div className="flex-1 flex items-center justify-center px-3">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-ui-muted/50 flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No appointment selected
            </p>
            <p className="text-xs text-muted-foreground">
              Click on any appointment card to view details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = {
    Pending: "bg-yellow-100 text-yellow-800",
    Scheduled: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Rejected: "bg-purple-100 text-purple-800",
  }[appointment.status];

  return (
    <div className="bg-ui-card border-2 py-2 rounded-xl flex flex-col overflow-hidden shadow-xs col-span-3">
      <div className="sticky top-0 bg-ui-card z-10 border-b border-ui-border px-3 py-2.5">
        <h2 className="text-base font-bold font-montserrat text-foreground leading-tight">
          Appointment Details
        </h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar px-3 pt-3 pb-24 space-y-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue flex items-center justify-center text-sm font-bold text-white shrink-0">
            {appointment.patient?.name
              ?.split(" ")
              .map((n) => n[0].toUpperCase())
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate text-sm">
              {appointment.patient?.name}
            </h3>
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mt-0.5 ${statusColor}`}
            >
              <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
              {appointment.status}
            </div>
          </div>
        </div>

        <div className="bg-ui-muted/50 rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Date
                </p>
                <p className="font-bold text-foreground text-sm">
                  {formatDate(appointment.appointment_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pr-1">
              <Clock className="w-4 h-4 text-blue shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Time
                </p>
                <p className="font-bold text-foreground text-sm">
                  {appointment.appointment_time}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-wider text-muted-foreground mb-1">
              Patient Notes
            </p>
            <p className="text-xs text-foreground leading-relaxed">
              {appointment.notes || (
                <span className="italic text-muted-foreground">
                  No notes provided.
                </span>
              )}
            </p>
          </div>
        </div>

        <CollapsibleSection title="Patient Details" defaultOpen={false}>
          <div className="grid gap-3 text-xs px-3">
            {appointment.patient?.age && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-ui-muted flex items-center justify-center">
                  <SquareUserRound className="w-3 h-3 text-muted-foreground" />
                </div>
                <span className="font-medium text-foreground">
                  {appointment.patient.age} years old,{" "}
                  {appointment.patient.gender}
                </span>
              </div>
            )}
            {appointment.patient?.contact && (
              <div className="flex items-center gap-2 col-span-2">
                <div className="w-6 h-6 rounded bg-ui-muted flex items-center justify-center">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                </div>
                <a
                  href={`tel:${appointment.patient.contact}`}
                  className="font-medium text-foreground hover:text-blue transition text-xs truncate"
                >
                  {appointment.patient.contact}
                </a>
              </div>
            )}
            {appointment.patient?.email && (
              <div className="flex items-center gap-2 col-span-2">
                <div className="w-6 h-6 rounded bg-ui-muted flex items-center justify-center">
                  <Mail className="w-3 h-3 text-muted-foreground" />
                </div>
                <a
                  href={`mailto:${appointment.patient.email}`}
                  className="font-medium text-foreground hover:text-blue transition text-xs truncate"
                >
                  {appointment.patient.email}
                </a>
              </div>
            )}
          </div>
        </CollapsibleSection>

        <AppointmentHistorySection
          key={appointment?.patient?._id}
          patientId={appointment.patient?._id}
          patientName={appointment.patient?.name}
          refreshTrigger={refreshTrigger}
        />

        <MedicalRecordsSection
          patientId={appointment.patient?._id}
          patientName={appointment.patient?.name}
        />
      </div>

      <div className="sticky bottom-0 bg-ui-card px-3 pb-3 pt-2 space-y-2">
        {appointment.status === "Pending" && (
          <>
            <button
              onClick={() => openActionModal("accept", appointment)}
              disabled={actionLoading[appointment._id]}
              className="w-full bg-blue hover:bg-blue-dark text-white py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 text-sm shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              {actionLoading[appointment._id]
                ? "Accepting..."
                : "Accept Appointment"}
            </button>
            <button
              onClick={() => openActionModal("reject", appointment)}
              disabled={actionLoading[appointment._id]}
              className="w-full text-red-600 border border-red-600 hover:bg-red-50 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 text-sm"
            >
              <XCircle className="w-4 h-4" />
              Reject Appointment
            </button>
          </>
        )}

        {appointment.status === "Scheduled" && (
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="w-full bg-blue hover:bg-navy text-white py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 text-sm shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Add Medical Record
          </button>
        )}

        {["Scheduled", "Rejected", "Completed"].includes(
          appointment.status
        ) && (
          <button
            onClick={() => openDeleteModal(appointment)}
            disabled={actionLoading[appointment._id]}
            className="w-full text-red-600 border border-red-600 hover:bg-red-50 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 text-sm"
          >
            <X className="w-4 h-4" />
            {actionLoading[appointment._id]
              ? "Deleting..."
              : "Delete Appointment"}
          </button>
        )}

        {(appointment.status === "Completed" ||
          appointment.status === "Rejected" ||
          appointment.status === "Cancelled") && (
          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground">
              This appointment is {appointment.status.toLowerCase()}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
