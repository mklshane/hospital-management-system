import { useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import EmptyState from "@/components/Common/EmptyState";
import TodayApptCard from "./TodayApptCard";

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
          <EmptyState
            title={
              searchQuery ? "No appointments found" : "No Appointments Today"
            }
            description={
              searchQuery
                ? `No appointments match "${searchQuery}". Try a different search term.`
                : "There are no scheduled appointments for today. Check back later for updates."
            }
            additionalInfo={
              searchQuery
                ? ""
                : "New appointments will appear here as they are scheduled for today."
            }
            icon="default"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredData.map((appt) => (
              <TodayApptCard
                key={appt._id}
                appt={appt}
                actionLoading={actionLoading}
                onAddRecord={onAddRecord}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayAppointments;
