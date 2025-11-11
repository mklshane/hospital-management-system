import React from "react";
import { Mail, Phone, User, Clock, ChevronRight } from "lucide-react";

const DoctorCard = ({ doctor, onClick }) => {
  const handleCardClick = () => {
    onClick(doctor);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-ui-card border border-ui-border rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue/30 group"
    >
      <div className="flex items-center justify-between">
        {/* Doctor Basic Info */}
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar/Initial */}
          <div className="w-10 h-10 bg-primary-foreground border-2 rounded-full flex items-center justify-center">
            <span className="text-blue font-semibold text-sm">
              Dr. {doctor.name?.charAt(0)?.toUpperCase() || "D"}
            </span>
          </div>

          {/* Doctor Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-base font-semibold text-foreground truncate group-hover:text-blue transition-colors">
                Dr. {doctor.name}
              </h3>
              {doctor.specialization && (
                <span className="text-xs text-blue bg-blue-100 dark:bg-blue-200/80 px-2 py-1 rounded-full">
                  {doctor.specialization}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="truncate">{doctor.email}</span>
              </div>

              {doctor.contact && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{doctor.contact}</span>
                </div>
              )}

              {(doctor.age || doctor.gender) && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>
                    {doctor.age && `${doctor.age} years`}
                    {doctor.age && doctor.gender && " • "}
                    {doctor.gender}
                  </span>
                </div>
              )}
            </div>

            {/* Schedule Times */}
            {doctor.schedule_time && doctor.schedule_time.length > 0 && (
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <div className="flex flex-wrap gap-1">
                  {doctor.schedule_time.slice(0, 2).map((time, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 bg-ui-muted rounded text-xs"
                    >
                      {time}
                    </span>
                  ))}
                  {doctor.schedule_time.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-ui-muted rounded text-xs">
                      +{doctor.schedule_time.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chevron for visual indication */}
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-blue transition-colors ml-2" />
      </div>
    </div>
  );
};

export default DoctorCard;
