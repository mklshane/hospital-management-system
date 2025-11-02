// components/patients/PatientCard.jsx
import React from "react";

const PatientCard = ({ patient, isSelected, onClick }) => {
  const { _id, name, age, gender, lastVisit, upcomingAppointment, condition } = patient;

  return (
    <div
      onClick={onClick}
      className={`
        bg-ui-bg border ${isSelected ? "border-primary shadow-lg" : "border-ui-border"}
        rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md
        flex flex-col justify-between h-full
      `}
    >
      <div>
        <h3 className="font-semibold text-foreground text-lg font-montserrat truncate">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {age || "?"} yrs • {gender || "N/A"}
        </p>
      </div>

      {lastVisit && (
        <div className="mt-3 text-xs text-muted-foreground">
          <span className="font-medium">Last Visit:</span> {lastVisit}
        </div>
      )}

      {upcomingAppointment && (
        <div className="mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block">
          ↑ {upcomingAppointment}
        </div>
      )}

      {condition && (
        <div className="mt-2 text-xs bg-warning/10 text-warning px-2 py-1 rounded-full inline-block">
          {condition}
        </div>
      )}
    </div>
  );
};

export default PatientCard;