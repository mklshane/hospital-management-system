import React from "react";
import { Mail, Phone, MapPin, User, ChevronRight } from "lucide-react";

const PatientCard = ({ patient, onClick }) => {
  const handleCardClick = () => {
    onClick(patient);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-ui-card border border-ui-border rounded-lg p-3 md:p-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue/30 group"
    >
      <div className="flex items-center justify-between">
        {/* Patient Basic Info */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          {/* Avatar/Initial */}
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-foreground border-2 rounded-full flex items-center justify-center shrink-0">
            <span className="text-blue font-semibold text-xs md:text-sm">
              {patient.name?.charAt(0)?.toUpperCase() || "P"}
            </span>
          </div>

          {/* Patient Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
              <h3 className="text-sm md:text-base font-semibold text-foreground truncate group-hover:text-blue transition-colors">
                {patient.name}
              </h3>
              {patient.age && (
                <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-100/25 dark:text-gray-300 px-2 py-1 rounded-full self-start sm:self-center">
                  {patient.age} years old
                </span>
              )}
            </div>

            {/* Contact Info - Stack on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1 truncate">
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate">{patient.email}</span>
              </div>

              {patient.contact && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span className="truncate">{patient.contact}</span>
                </div>
              )}

              {patient.gender && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 shrink-0" />
                  <span className="truncate">{patient.gender}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chevron for visual indication */}
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-blue transition-colors ml-2 shrink-0" />
      </div>
    </div>
  );
};

export default PatientCard;
