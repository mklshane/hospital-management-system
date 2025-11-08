import React from "react";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  ChevronRight,
} from "lucide-react";

const AppointmentCard = ({ appointment, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Completed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Rejected":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCardClick = () => {
    onClick(appointment);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-ui-card border border-ui-border rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue/30 group"
    >
      <div className="flex items-center justify-between">
        {/* Appointment Info */}
        <div className="flex items-center gap-4 flex-1">
          {/* Status Badge */}
          <div
            className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status}
          </div>

          {/* Appointment Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Calendar className="w-4 h-4 text-blue" />
                <span>{formatDate(appointment.appointment_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="w-4 h-4 text-blue" />
                <span>{appointment.appointment_time}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Stethoscope className="w-3 h-3" />
                <span className="truncate">
                  Dr. {appointment.doctor?.name} -{" "}
                  {appointment.doctor?.specialization}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{appointment.patient?.name}</span>
              </div>

              {appointment.patient?.contact && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{appointment.patient.contact}</span>
                </div>
              )}
            </div>

            
          </div>
        </div>

        {/* Chevron for visual indication */}
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-blue transition-colors ml-2" />
      </div>
    </div>
  );
};

export default AppointmentCard;
