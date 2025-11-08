import { Calendar, Clock, FileText } from "lucide-react";
import { format } from "date-fns";

const getStatusColor = (status) => {
  const colors = {
    Pending: "text-orange-500",
    Scheduled: "text-green-500",
    Completed: "text-gray-500",
    Rejected: "text-red-500",
    Cancelled: "text-red-500",
  };
  return colors[status] || "text-gray-500";
};

export default function AppointmentCard({ apt }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition bg-white dark:bg-[#323948]">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
          <span className="font-semibold text-gray-600 dark:text-white">
            {apt.doctor?.name?.[0] || "D"}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-gray-900 dark:text-white">
            Dr. {apt.doctor?.name || "Unknown"}
          </p>
          <p className={`text-xs ${getStatusColor(apt.status)}`}>
            ● {apt.status}
          </p>
        </div>
      </div>
      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <Calendar size={14} className="mr-2" />
          <span>{format(new Date(apt.appointment_date), "MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center">
          <Clock size={14} className="mr-2" />
          <span>{apt.appointment_time}</span>
        </div>
        <div className="flex items-start">
          <FileText size={14} className="mr-2 mt-0.5" />
          <span className="line-clamp-2">{apt.notes || "No notes"}</span>
        </div>
      </div>
    </div>
  );
}
