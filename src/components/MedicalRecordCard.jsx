import { Calendar, Stethoscope, FileText } from "lucide-react";

const MedicalRecordCard = ({ record, onClick, formatDate }) => {
  return (
    <div
      onClick={() => onClick(record)}
      className="p-4 bg-ui-card rounded-xl border border-gray-200 dark:border-gray-700
                 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200
                 hover:border-blue-300 dark:hover:border-blue-600
                 hover:bg-ui-muted dark:hover:bg-ui-surface-dark"
    >
      {/* Avatar + Name + Date */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          {record.patient?.name?.[0] || "P"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {record.patient?.name || "Unknown Patient"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(record.appointment?.appointment_date)}
          </p>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
        <strong>Diagnosis:</strong> {record.diagnosis}
      </div>

      {/* Symptoms & Prescriptions */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        {record.symptoms && (
          <p className="flex items-center gap-1 line-clamp-1">
            <Stethoscope className="w-3.5 h-3.5" />
            {record.symptoms}
          </p>
        )}
        {record.prescriptions?.length > 0 && (
          <p className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            {record.prescriptions.length} prescription{record.prescriptions.length > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordCard;