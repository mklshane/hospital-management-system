// components/Patient/AppointmentCard.jsx
import { Calendar, Clock, FileText } from "lucide-react";
import { format } from "date-fns";

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function AppointmentCard({ apt }) {
  const formatDate = (date) => format(new Date(date), "MMM d, yyyy");
  const formatTime = (time) => time;

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
          {apt.doctor?.name?.charAt(0) || "D"}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 text-sm">
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

      <div className="text-xs text-gray-600 space-y-1">
        <p className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(apt.appointment_date)}
        </p>
        <p className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(apt.appointment_time)}
        </p>
        <p className="flex items-start gap-1">
          <FileText className="w-3.5 h-3.5 mt-0.5" />
          <span className="line-clamp-2 text-xs">
            {apt.notes || "No notes"}
          </span>
        </p>
      </div>
    </div>
  );
}
