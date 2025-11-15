import { Calendar, Stethoscope, FileText } from "lucide-react";

const MedicalRecordCard = ({ record, onClick, formatDate }) => {
  return (
    <div
      onClick={() => onClick(record)}
      className="px-4 py-3  bg-ui-surface rounded-lg border border-gray-200 dark:border-gray-700
                 shadow-xs hover:shadow-sm cursor-pointer transition-all duration-150
                 hover:border-blue-300 dark:hover:border-blue-600
                 hover:bg-ui-muted dark:hover:bg-ui-surface-dark"
    >
      {/* Avatar + Name + Date */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
          {record.patient?.name?.[0] || "P"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">
            {record.patient?.name || "Unknown Patient"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(record.appointment?.appointment_date)}
          </p>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="text-xs text-gray-700 dark:text-gray-300 mb-1 truncate">
        <strong>Diagnosis:</strong> {record.diagnosis}
      </div>

      {/* Symptoms & Prescriptions */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
        {record.symptoms && (
          <p className="flex items-center gap-1 truncate">
            <Stethoscope className="w-3 h-3 shrink-0" />
            {record.symptoms}
          </p>
        )}
        {record.prescriptions?.length > 0 && (
          <p className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {record.prescriptions.length} prescription
            {record.prescriptions.length > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordCard;
