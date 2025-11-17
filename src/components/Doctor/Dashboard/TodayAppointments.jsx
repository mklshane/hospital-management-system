import { useState } from "react";

import { Calendar } from "lucide-react";
import {
  Search,
  RefreshCw,
  FileText,
  SquareUserRound,
  Phone,
  Mail,
} from "lucide-react";
import { useSearch } from "@/hooks/useSearch";


const TodayAppointments = ({
  appointments,
  loading,
  actionLoading,
  onRefresh,
  onAddRecord,
  onComplete,
}) => {
  const { searchQuery, filteredData, handleSearch } = useSearch(appointments, [
    "patient.name",
    "appointment_date",
    "notes",
  ]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const EmptyPlaceholder = () => (
    <div className="col-span-2 flex flex-col items-center justify-center py-12 px-4 text-center bg-ui-muted/30 rounded-xl border-2 border-dashed border-ui-border">
      <div className="w-20 h-20 bg-ui-muted rounded-full flex items-center justify-center mb-4">
        <Calendar className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        No Appointments Today
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        There are no scheduled appointments for today. Check back later for
        updates.
      </p>
    </div>
  );

  const AppointmentCard = ({ appt }) => {
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
          {/*  <button
            onClick={() => onComplete(appt)}
            disabled={actionLoading[appt._id]}
            className="flex-1 border border-green-200 text-green-600 hover:bg-green-50 py-2 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-1 disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Complete
          </button> */}
        </div>
      </div>
    );
  };

  return (
    <div className="col-span-9 bg-ui-card border-2 row-span-1 rounded-xl overflow-hidden flex flex-col min-h-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-ui-border shrink-0">
        <h2 className="text-lg font-semibold text-foreground font-montserrat">
          Today's Appointments
        </h2>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search name, date, notes..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 pl-9 bg-ui-muted border border-ui-border rounded-lg text-sm text-foreground placeholder-muted-foreground font-figtree focus:outline-none focus:ring-1 focus:ring-ui-ring"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 h-9 bg-blue hover:bg-blue-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            title="Refresh"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-ui-muted/50 border-2 rounded-xl p-4 animate-pulse space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-ui-muted/70 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-ui-muted/60 rounded w-32 animate-pulse" />
                    <div className="h-3 bg-ui-muted/50 rounded w-24 animate-pulse" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-3 bg-ui-muted/50 rounded animate-pulse" />
                  <div className="h-3 bg-ui-muted/50 rounded animate-pulse" />
                </div>
                <div className="h-10 bg-ui-muted/50 rounded animate-pulse" />
                <div className="flex gap-2 pt-2">
                  <div className="h-8 bg-ui-muted/60 rounded-lg flex-1 animate-pulse" />
                  <div className="h-8 bg-ui-muted/60 rounded-lg flex-1 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <EmptyPlaceholder />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredData.map((appt) => (
              <AppointmentCard key={appt._id} appt={appt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayAppointments;
