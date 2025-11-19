import { Search, Plus, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AppointmentCard from "./AppointmentCard";
import ThemeToggle from "@/components/ThemeToggle";
import EmptyState from "@/components/Common/EmptyState";

export default function AppointmentHistory({
  appointments,
  loading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  onNewAppointment,
  onAppointmentClick,
}) {
  const StatusDropdown = ({ value, onChange, className = "" }) => {
    const options = ["All", "Scheduled", "Pending", "Completed", "Rejected"];
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      const onDocClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
      <div ref={ref} className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="w-full flex items-center justify-between px-4 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-base font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="truncate">{value}</span>
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300 ml-2" />
        </button>

        {open && (
          <ul className="absolute right-0 mt-2 w-28 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1 text-base">
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center h-10 text-left px-3 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    opt === value ? "bg-gray-100 dark:bg-gray-600" : ""
                  } text-gray-900 dark:text-white text-base font-normal`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="bg-ui-card rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 gap-4 shrink-0 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Appointment History
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Date filter pill */}
          {dateFilter && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm">
              <span className="opacity-80 mr-2">{dateFilter}</span>
              <button
                onClick={() => setDateFilter(null)}
                className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-800"
                aria-label="Clear date filter"
              >
                ✕
              </button>
            </div>
          )}

          <StatusDropdown value={statusFilter} onChange={setStatusFilter} />

          <div className="flex gap-4">
            <button
              onClick={onNewAppointment}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              New Appointment
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Scrollable Cards Container */}
      <div className="flex-1 min-h-0 overflow-y-auto -mx-6 -mb-6 px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))
          ) : appointments.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-300">
              <EmptyState
                title={
                  searchTerm ? "No appointments found" : "No Appointments Yet"
                }
                description={
                  searchTerm
                    ? `No appointments match "${searchTerm}". Try a different search term.`
                    : "You haven't scheduled any appointments yet. Book your first appointment to get started with managing your healthcare."
                }
                additionalInfo={
                  searchTerm
                    ? ""
                    : "All your upcoming and past appointments will appear here for easy access."
                }
                icon="default"
              />
            </div>
          ) : (
            appointments.map((apt) => (
              <AppointmentCard
                key={apt._id}
                apt={apt}
                onClick={() => onAppointmentClick(apt)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
