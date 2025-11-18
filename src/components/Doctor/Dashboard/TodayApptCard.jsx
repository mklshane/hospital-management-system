import { FileText, SquareUserRound, Phone, Mail } from "lucide-react";

const TodayApptCard = ({ appt, actionLoading, onAddRecord }) => {
  const patient = appt.patient;

  return (
    <div className="bg-ui-card backdrop-blur-sm border border-ui-border/30 rounded-xl p-4 flex flex-col">
      {/* Patient Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-blue flex items-center justify-center text-white font-bold text-sm">
          {patient?.name
            ?.split(" ")
            .map((n) => n[0].toUpperCase())
            .join("")
            .slice(0, 2)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm truncate">
            {patient?.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {appt.appointment_time}
          </p>
        </div>
      </div>

      {/* Patient Details */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs mb-4">
        <div className="space-y-2 pl-2">
          {patient?.age && (
            <div className="flex items-center gap-1.5">
              <SquareUserRound className="w-3.5 h-3.5 text-muted-foreground" />
              <span>
                {patient.age}, {patient.gender}
              </span>
            </div>
          )}
          {patient?.contact && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <a
                href={`tel:${patient.contact}`}
                className="text-foreground hover:text-blue truncate"
              >
                {patient.contact}
              </a>
            </div>
          )}
          {patient?.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <a
                href={`mailto:${patient.email}`}
                className="text-foreground hover:text-blue truncate text-xs"
              >
                {patient.email}
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Notes
          </span>
          <p className="text-xs text-foreground line-clamp-2">
            {appt.notes || (
              <span className="italic text-muted-foreground">No notes.</span>
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onAddRecord(appt)}
          disabled={actionLoading[appt._id] || appt.status === "Completed"}
          className={`flex-1 py-2 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
            appt.status === "Completed"
              ? "bg-green-600 text-white cursor-not-allowed"
              : "bg-blue hover:bg-blue-700 text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          {appt.status === "Completed" ? "Completed" : "Add Record"}
        </button>
      </div>
    </div>
  );
};

export default TodayApptCard;
