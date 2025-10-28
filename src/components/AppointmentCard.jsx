import { CalendarClock, NotepadText } from "lucide-react";

const AppointmentCard = ({ appt, onClick, formatDate }) => {
  const statusConfig = {
    Pending:   { color: "text-yellow-600", bg: "bg-yellow-100", dot: "bg-yellow-500" },
    Scheduled: { color: "text-blue-600",   bg: "bg-blue-100",   dot: "bg-blue-500" },
    Completed: { color: "text-green-600",  bg: "bg-green-100",  dot: "bg-green-500" },
    Cancelled: { color: "text-gray-600",   bg: "bg-gray-100",   dot: "bg-gray-500" },
    Rejected:  { color: "text-red-600",    bg: "bg-red-100",    dot: "bg-red-500" },
  };

  const config = statusConfig[appt.status] || statusConfig.Pending;

  return (
    <div
      onClick={() => onClick(appt)}
      className="p-4 bg-ui-card rounded-xl border border-gray-200 dark:border-gray-700 
                 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 
                 hover:border-blue-300 dark:hover:border-blue-600"
    >
      {/* Top: Avatar + Name + Status */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                        flex items-center justify-center text-white font-bold text-sm">
          {appt.patient?.name?.[0] || "P"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {appt.patient?.name || "Unknown Patient"}
          </p>
          <div className={`flex items-center gap-1.5 text-xs font-medium ${config.color}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {appt.status}
          </div>
        </div>
      </div>

      {/* Bottom: Date, Time, Notes */}
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p className="flex items-center gap-1.5">
          <span><CalendarClock className="w-4 h-4 text-foreground" /></span> 
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {formatDate(appt.appointment_date)} | {appt.appointment_time}
          </span>
        </p>
        {appt.notes && (
          <p className="flex items-center gap-1 line-clamp-2 text-gray-500 dark:text-gray-400">
            <NotepadText className="w-4 h-4" />
            {appt.notes}
          </p>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;