import { CalendarClock, NotepadText } from "lucide-react";

const AppointmentCard = ({ appt, onClick, formatDate }) => {
  const statusConfig = {
    Pending: {
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      dot: "bg-yellow-500",
    },
    Scheduled: {
      color: "text-blue-600",
      bg: "bg-blue-100",
      dot: "bg-blue-500",
    },
    Completed: {
      color: "text-green-600",
      bg: "bg-green-100",
      dot: "bg-green-500",
    },
    Cancelled: {
      color: "text-gray-600",
      bg: "bg-gray-100",
      dot: "bg-gray-500",
    },
    Rejected: { color: "text-red-600", bg: "bg-red-100", dot: "bg-red-500" },
  };

  const config = statusConfig[appt.status] || statusConfig.Pending;

  return (
    <div
      onClick={() => onClick(appt)}
      className="px-4 py-3 bg-ui-card rounded-lg border border-gray-200 dark:border-gray-700
                 shadow-xs hover:shadow-sm cursor-pointer transition-all duration-150
                 hover:border-blue-300 dark:hover:border-blue-600
                 hover:bg-ui-muted dark:hover:bg-ui-surface-dark"
    >
      {/* Top: Avatar + Name + Status */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-white font-bold text-xs">
          {appt.patient?.name?.[0] || "P"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">
            {appt.patient?.name || "Unknown Patient"}
          </p>
          <div
            className={`flex items-center gap-1 text-xs font-medium ${config.color}`}
          >
            <div className={`w-1 h-1 rounded-full ${config.dot}`} />
            {appt.status}
          </div>
        </div>
      </div>

      {/* Bottom: Date, Time, Notes */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p className="flex items-center gap-1">
          <CalendarClock className="w-3 h-3" />
          <span className="font-medium">
            {formatDate(appt.appointment_date)} • {appt.appointment_time}
          </span>
        </p>
        {appt.notes && (
          <p className="flex items-center gap-1 line-clamp-2">
            <NotepadText className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{appt.notes}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
