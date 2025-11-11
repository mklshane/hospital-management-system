import React from "react";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { getStatusColor } from "@/utils/statusColors";

const AppointmentCard = ({ appointment, onClick }) => {
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
      className="bg-ui-card border border-ui-border rounded-lg p-3 md:p-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue/30 group"
    >
      <div className="flex items-start sm:items-center justify-between gap-3">
        {/* Appointment Info */}
        <div className="flex items-start sm:items-center gap-3 md:gap-4 flex-1 min-w-0">
          {/* Status Badge */}
          <div
            className={`px-2 py-1 md:px-3 md:py-1 rounded-full border text-xs font-medium shrink-0 ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status}
          </div>

          {/* Appointment Details */}
          <div className="flex-1 min-w-0">
            {/* Date and Time - Stack on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Calendar className="w-4 h-4 text-blue shrink-0" />
                <span className="text-xs sm:text-sm">
                  {formatDate(appointment.appointment_date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="w-4 h-4 text-blue shrink-0" />
                <span className="text-xs sm:text-sm">
                  {appointment.appointment_time}
                </span>
              </div>
            </div>

            {/* Doctor and Patient Info - Stack on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1 truncate">
                <Stethoscope className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  Dr. {appointment.doctor?.name} -{" "}
                  {appointment.doctor?.specialization}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <User className="w-3 h-3 shrink-0" />
                <span className="truncate">{appointment.patient?.name}</span>
              </div>

              {appointment.patient?.contact && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {appointment.patient.contact}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chevron for visual indication */}
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-blue transition-colors ml-2 shrink-0 mt-1 sm:mt-0" />
      </div>
    </div>
  );
};

export default AppointmentCard;
