import React from "react";
import { Mail, Phone, MapPin, User, ChevronRight } from "lucide-react";

const PatientCard = ({ patient, onClick }) => {
  const handleCardClick = () => {
    onClick(patient);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-ui-card border border-ui-border rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue/30 group"
    >
      <div className="flex items-center justify-between">
        {/* Patient Basic Info */}
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar/Initial */}
          <div className="w-10 h-10 bg-primary-foreground border-2 rounded-full flex items-center justify-center">
            <span className="text-blue font-semibold text-sm">
              {patient.name?.charAt(0)?.toUpperCase() || "P"}
            </span>
          </div>

          {/* Patient Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-base font-semibold text-foreground truncate group-hover:text-blue transition-colors">
                {patient.name}
              </h3>
              {patient.age && (
                <span className="text-xs text-muted-foreground bg-ui-muted px-2 py-1 rounded-full">
                  {patient.age} years
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="truncate">{patient.email}</span>
              </div>

              {patient.contact && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{patient.contact}</span>
                </div>
              )}

              {patient.gender && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{patient.gender}</span>
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

export default PatientCard;
