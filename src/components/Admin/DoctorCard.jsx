import React from "react";
import { Edit2, Trash2, Clock, Mail, Phone } from "lucide-react";

const DoctorCard = ({ doctor, onEdit, onDelete }) => {
  return (
    <div className="bg-ui-card border border-ui-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {doctor.name}
          </h3>
          <p className="text-blue font-medium">{doctor.specialization}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(doctor)}
            className="p-2 text-muted-foreground hover:text-blue hover:bg-blue/10 rounded-lg transition-colors"
            title="Edit Doctor"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(doctor._id, doctor.name)}
            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete Doctor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span>{doctor.email}</span>
        </div>

        {doctor.contact && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{doctor.contact}</span>
          </div>
        )}

        {doctor.age && (
          <div className="text-sm text-muted-foreground">
            Age: {doctor.age} • {doctor.gender}
          </div>
        )}

        {doctor.schedule_time && doctor.schedule_time.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {doctor.schedule_time.slice(0, 3).map((time, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-ui-muted rounded text-xs"
                >
                  {time}
                </span>
              ))}
              {doctor.schedule_time.length > 3 && (
                <span className="px-2 py-1 bg-ui-muted rounded text-xs">
                  +{doctor.schedule_time.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
