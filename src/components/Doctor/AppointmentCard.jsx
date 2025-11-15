import { CalendarClock, NotepadText } from "lucide-react";
import { getStatusConfig } from "@/utils/statusColors";

const AppointmentCard = ({ appt, onClick, formatDate, isSelected }) => {
  const config = getStatusConfig(appt.status);
  const patientInitial = appt.patient?.name?.[0]?.toUpperCase() || "P";
  const patientName = appt.patient?.name || "Unknown Patient";

  return (
    <div
      onClick={() => onClick(appt)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(appt)}
      className={`px-4 py-3 bg-ui-surface rounded-lg border transition-all duration-200
                 shadow-xs hover:shadow-sm cursor-pointer
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1
                 ${
                   isSelected
                     ? "border-blue-400 bg-blue-50/70 dark:bg-blue-900/30"
                     : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/40 dark:hover:bg-blue-900/20"
                 }`}
    >
      {/* Top: Avatar + Name + Status */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          {patientInitial}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-gray-900 dark:text-white truncate text-sm"
            title={patientName}
          >
            {patientName}
          </p>
          <div
            className={`flex items-center gap-1 text-xs font-medium ${config.color}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            <span className="truncate">{appt.status}</span>
          </div>
        </div>
      </div>

      {/* Bottom: Date/Time + Notes */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <CalendarClock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <span className="font-medium truncate">
            {formatDate(appt.appointment_date)} • {appt.appointment_time}
          </span>
        </div>

        <div className="flex items-start gap-1.5">
          <NotepadText className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
          <span
            className="line-clamp-1 flex-1 min-w-0"
            title={appt.notes || "No notes"}
          >
            {appt.notes ? (
              appt.notes
            ) : (
              <span className="italic text-gray-400">No notes</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;