import React, { useState } from "react";
import { CheckCircle, XCircle, User, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import AppointmentActionModal from "../Doctor/AppointmentActionModal.jsx";

const AppointmentRequestCard = ({ request, onApprove, onReject, loading }) => {
  const { _id, patient, appointment_date, appointment_time, notes } = request;
  const [modal, setModal] = useState({ isOpen: false, appointment: null, action: null });

  if (!patient) return null;

  const { name, age, gender } = patient;

  return (
    <div className="bg-ui-surface border border-ui-border rounded-lg p-3 shadow-xs hover:shadow-sm transition-all duration-200 hover:translate-y-[-1px] hover:border-blue-300">
      {/* Details Section - Two Columns - SMALLER */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Left Column - Patient Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue text-white rounded-full flex items-center justify-center font-semibold text-xs">
              {name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground font-montserrat text-xs truncate">
                {name}
              </p>
              <p className="text-[10px] text-muted-foreground font-figtree">
                {age} {gender}
              </p>
            </div>
          </div>

          {notes && (
            <div>
              <p className="text-[10px] text-muted-foreground font-figtree mb-0.5">
                Notes:
              </p>
              <p className="text-[10px] text-foreground font-figtree bg-ui-muted rounded px-1.5 py-0.5 line-clamp-2">
                {notes}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Date & Time */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-foreground">
                {format(new Date(appointment_date), "MMM d")}
              </p>
              <p className="text-[10px] text-muted-foreground">Date</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-foreground">
                {appointment_time}
              </p>
              <p className="text-[10px] text-muted-foreground">Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Smaller */}
      <div className="flex gap-1.5 pt-2 border-t border-ui-border">
        <button
          onClick={() => setModal({ isOpen: true, appointment: request, action: "accept" })}
          disabled={loading}
          className="w-full bg-blue hover:bg-blue-light text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 text-xs"
        >
          <CheckCircle className="w-3 h-3" />
          Accept
        </button>

        <button
          onClick={() => setModal({ isOpen: true, appointment: request, action: "reject" })}
          disabled={loading}
          className="w-full border border-red-300 text-red-600 hover:bg-red-50 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 text-xs"
        >
          <XCircle className="w-3 h-3" />
          Reject
        </button>
        <AppointmentActionModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ isOpen: false, appointment: null, action: null })}
          appointment={modal.appointment}
          actionType={modal.action}
          loading={loading}
          onConfirm={async () => {
            const handler = modal.action === "accept" ? onApprove : onReject;
            if (handler) {
              await handler(request._id);
            }
          }}
        />
      </div>
    </div>
  );
};

export default AppointmentRequestCard;
