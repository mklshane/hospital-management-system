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
      message: "Are you sure you want to accept this appointment?",
      buttonText: "Accept Appointment",
      buttonClass: "bg-blue hover:bg-blue-light text-white",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    reject: {
      title: "Reject Appointment",
      message: "Are you sure you want to reject this appointment?",
      buttonText: "Reject Appointment",
      buttonClass: "border border-red-300 text-red-600 hover:bg-red-50",
      icon: <XCircle className="w-4 h-4" />,
    },
    complete: {
      title: "Mark as Completed",
      message: "Confirm that this appointment has been completed.",
      buttonText: "Mark as Completed",
      buttonClass: "bg-green-600 hover:bg-green-700 text-white",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  };

  const cfg = config[actionType];

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-ui-card rounded-xl shadow-2xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
          disabled={loading}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center mx-auto mb-3">
            {cfg.icon}
          </div>
          <h3 className="text-lg font-bold text-foreground font-montserrat">
            {cfg.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-2">
            {appointment.patient?.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {appointment.appointment_date} • {appointment.appointment_time}
          </p>
        </div>

        <p className="text-sm text-center text-foreground mb-6">
          {cfg.message}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-sm transition-all ${cfg.buttonClass} disabled:opacity-70 shadow hover:shadow-md`}
          >
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