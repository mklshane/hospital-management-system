import { Search, Plus, FilterX, ChevronDown } from "lucide-react";
import AppointmentCard from "./AppointmentCard";
import ThemeToggle from "@/components/ThemeToggle";
import EmptyState from "@/components/Common/EmptyState";
import StatusDropdown from "@/components/Common/StatusDropdown";

export default function AppointmentHistory({
  appointments,
  loading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onNewAppointment,
  onAppointmentClick,
}) {
  // Check if we're in a status-filtered empty state
  const isStatusFilteredEmptyState =
    !loading && appointments.length === 0 && statusFilter !== "All";

  // Function to clear status filter
  const clearStatusFilter = () => {
    setStatusFilter("All");
  };

  return (
    <div className="bg-ui-card rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 gap-4 shrink-0 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Appointment History
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-70">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

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
              {isStatusFilteredEmptyState ? (
                // Status filter empty state
                <div className="flex flex-col items-center justify-center px-4 text-center py-12">
                  {/* Status-specific illustration */}
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-linear-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                      <div className="relative">
                        <FilterX className="w-12 h-12 text-purple-500 dark:text-purple-400" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            0
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Floating elements for status filter state */}
                    <div className="absolute top-4 -left-4 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute bottom-4 -right-4 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">
                        {statusFilter.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Text Content for status filter state */}
                  <div className="max-w-md mx-auto">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      No {statusFilter.toLowerCase()} appointments
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {statusFilter === "Scheduled"
                        ? "You don't have any scheduled appointments at the moment. Scheduled appointments will appear here once they're confirmed."
                        : statusFilter === "Pending"
                        ? "There are no pending appointments requiring your attention right now."
                        : statusFilter === "Completed"
                        ? "No completed appointments found. Completed appointments will show up here once they're finished."
                        : statusFilter === "Rejected"
                        ? "No rejected appointments in your history."
                        : `No appointments found with status "${statusFilter}".`}
                    </p>

                    {/* Clear filter button */}
                    <button
                      onClick={clearStatusFilter}
                      className="bg-purple-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600 transition mx-auto"
                    >
                      <FilterX className="w-4 h-4" />
                      Show All Appointments
                    </button>
                  </div>
                </div>
              ) : searchTerm ? (
                // Search empty state
                <EmptyState
                  title="No appointments found"
                  description={`No appointments match "${searchTerm}". Try a different search term.`}
                  icon="search"
                />
              ) : (
                // Regular empty state (no appointments at all)
                <EmptyState
                  title="No Appointments Yet"
                  description="You haven't scheduled any appointments yet. Book your first appointment to get started with managing your healthcare."
                  additionalInfo="All your upcoming and past appointments will appear here for easy access."
                  icon="default"
                />
              )}
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
