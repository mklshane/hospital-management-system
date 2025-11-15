import React from "react";
import { format } from "date-fns";
import { Calendar, Clock, Stethoscope, Pill } from "lucide-react";

const CompletedAppointmentCard = ({ appointment, records = [] }) => {
  const doctor = appointment.doctor || {
    name: "Unknown",
    specialization: "General",
  };

  return (
    <div className="bg-ui-card dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 bg-linear-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg truncate">
              Dr. {doctor.name}
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate">
              {doctor.specialization}
            </p>
          </div>
        </div>

        <div className="text-right ml-3">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            {format(new Date(appointment.appointment_date), "dd MMM yyyy")}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500 mt-1">
            <Clock className="w-3.5 h-3.5" />
            {appointment.appointment_time || "—"}
          </div>
        </div>
      </div>

      {/* Record */}
      <div className="mt-auto bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800 flex-1">
        {records.map((record, idx) => (
          <div
            key={record._id}
            className={
              idx > 0
                ? "mt-4 pt-4 border-t border-blue-200 dark:border-blue-800"
                : ""
            }
          >
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {record.diagnosis || "No diagnosis"}
              </p>
            </div>

            {record.symptoms && (
              <p className="ml-4 mt-1 text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Symptoms:
                </span>{" "}
                {record.symptoms}
              </p>
            )}

            {Array.isArray(record.prescriptions) &&
              record.prescriptions.length > 0 && (
                <div className="ml-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Pill className="w-3.5 h-3.5" />
                    Prescriptions
                  </div>
                  <div className="space-y-1.5">
                    {record.prescriptions.map((p, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-[#ffff] dark:bg-gray-700 px-3 py-1.5 rounded-md text-xs"
                      >
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {p.medicine || "Unknown"}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {p.dosage || "?"} • {p.duration || "?"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {record.notes && (
              <p className="ml-4 mt-2 text-sm italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-md">
                "{record.notes}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedAppointmentCard;
