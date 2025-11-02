import React from "react";
import { Check, X } from "lucide-react";
import { format } from "date-fns";

const AppointmentRequestCard = ({ request, onApprove, onReject, loading }) => {
  const { 
    _id, 
    patient, 
    appointment_date, 
    appointment_time, 
    notes 
  } = request;

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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-ui-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{name}</p>
            <p className="text-sm text-muted-foreground">
              {age} {gender} • {formatTime(appointment_date, appointment_time)}
            </p>
            {notes && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notes}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onApprove(_id)}
            disabled={loading}
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition disabled:opacity-50"
            title="Approve"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => onReject(_id)}
            disabled={loading}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
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