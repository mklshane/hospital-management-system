import React from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, CheckCircle2, X } from "lucide-react";

const AppointmentActionModal = ({
  isOpen,
  onClose,
  appointment,
  onConfirm,
  loading = false,
  actionType,
}) => {
  if (!isOpen || !appointment) return null;

  const config = {
    accept: {
      title: "Accept Appointment",
      subtitle: "This action cannot be undone",
      description: "The patient will be notified and the appointment will be scheduled.",
      buttonText: "Accept Appointment",
      icon: <CheckCircle className="w-5 h-5" />,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      pillBg: "bg-blue-50",
      pillBorder: "border-blue-200",
      pillText: "text-blue-700",
      buttonBg: "bg-blue",
      buttonHover: "hover:bg-blue-700",
    },
    reject: {
      title: "Reject Appointment",
      subtitle: "This action cannot be undone",
      description: "The patient will be notified that the appointment was rejected.",
      buttonText: "Reject Appointment",
      icon: <XCircle className="w-5 h-5" />,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      pillBg: "bg-red-50",
      pillBorder: "border-red-200",
      pillText: "text-red-700",
      buttonBg: "bg-red-600",
      buttonHover: "hover:bg-red-700",
    },
    complete: {
      title: "Mark as Completed",
      subtitle: "This action cannot be undone",
      description: "The appointment will be marked as completed and archived.",
      buttonText: "Mark as Completed",
      icon: <CheckCircle2 className="w-5 h-5" />,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      pillBg: "bg-green-50",
      pillBorder: "border-green-200",
      pillText: "text-green-700",
      buttonBg: "bg-green-600",
      buttonHover: "hover:bg-green-700",
    },
  };

  const cfg = config[actionType];

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const appointmentLabel = `${appointment.patient?.name} – ${formatDate(
    appointment.appointment_date
  )} at ${appointment.appointment_time}`;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="relative bg-ui-card border-2 rounded-xl shadow-xs w-full max-w-sm p-6 space-y-5 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Circle */}
        <div className={`mx-auto w-12 h-12 rounded-full ${cfg.iconBg} flex items-center justify-center`}>
          <div className={cfg.iconColor}>{cfg.icon}</div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold font-montserrat text-foreground">
          {cfg.title}
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-muted-foreground">
          {cfg.subtitle}
        </p>

        {/* Description */}
        <p className="text-sm text-foreground">
          {cfg.description}
        </p>

        {/* Appointment Pill */}
        <div
          className={`mx-auto w-full ${cfg.pillBg} ${cfg.pillBorder} border rounded-md px-4 py-2 text-sm font-medium ${cfg.pillText} flex items-center justify-center`}
        >
          <span className="truncate">{appointmentLabel}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`w-full ${cfg.buttonBg} ${cfg.buttonHover} text-white py-2.5 rounded-md font-medium flex items-center justify-center gap-2 text-sm transition-all shadow-sm disabled:opacity-70`}
          >
            {cfg.icon}
            {loading ? "Processing..." : cfg.buttonText}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AppointmentActionModal;