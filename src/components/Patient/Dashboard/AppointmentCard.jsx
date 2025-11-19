import { Calendar, Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor } from "@/utils/statusColors";

export default function AppointmentCard({ apt, onClick }) {
  const formatDate = (date) => format(new Date(date), "MMM d, yyyy");
  const formatTime = (time) => time;

  return (
    <div
      className="h-40 border-2 border-blue-100 dark:border-blue-700/20 rounded-xl p-4 hover:shadow-md transition cursor-pointer flex flex-col bg-blue-100/30 dark:bg-blue-950/25"
      onClick={onClick}
    >
      {/* Doctor + Status */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-200 border dark:bg-gray-700 rounded-full flex items-center justify-center text-black dark:text-gray-300 font-bold text-sm shrink-0">
          {apt.doctor?.name?.charAt(0) || "D"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-primary text-sm truncate">
            Dr. {apt.doctor?.name || "Unknown"}
          </p>
          <span
            className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
              apt.status
            )}`}
          >
            {apt.status}
          </span>
        </div>
      </div>

      {/* Date & Time */}
      <div className="text-xs text-primary space-y-1.5 flex-1">
        <p className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 shrink-0 text-gray-500" />
          <span className="truncate">{formatDate(apt.appointment_date)}</span>
        </p>
        <p className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 shrink-0 text-gray-500" />
          <span>{formatTime(apt.appointment_time)}</span>
        </p>

        {/* Notes - Truncated to 2 lines */}
        <div className="flex items-start gap-1">
          <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-500" />
          <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
            {apt.notes || "No notes"}
          </p>
        </div>
      </div>
    </div>
  );
}
