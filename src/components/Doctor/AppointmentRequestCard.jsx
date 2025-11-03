import React from "react";
import { Check, X, User, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

const AppointmentRequestCard = ({ request, onApprove, onReject, loading }) => {
  const { _id, patient, appointment_date, appointment_time, notes } = request;

  if (!patient) return null;

  const { name, age, gender } = patient;

  const formatTime = (dateStr, timeStr) => {
    try {
      const date = new Date(`${dateStr}T${timeStr}`);
      return format(date, "MMM d, yyyy • h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="bg-white border border-ui-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* Patient Info + Avatar */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar with Initial */}
          <div className="w-11 h-11 bg-blue text-white rounded-full flex items-center justify-center font-semibold text-sm">
            {name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground font-montserrat text-sm truncate">
              {name}
            </p>
            <p className="text-xs text-muted-foreground font-figtree">
              {age} {gender}
            </p>
            {notes && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-figtree">
                {notes}
              </p>
            )}
            {/* Date & Time (Small Icons) */}
            <div className="text-xs text-muted-foreground font-figtree">
              <div className="flex items-center mt-1 mb-1">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                <span>{format(new Date(appointment_date), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>{appointment_time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (appear on hover) */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onApprove(_id)}
            disabled={loading}
            className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Approve"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onReject(_id)}
            disabled={loading}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Reject"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentRequestCard;