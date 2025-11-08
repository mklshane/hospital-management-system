import { Search, Plus } from "lucide-react";
import AppointmentCard from "./AppointmentCard";
import ThemeToggle from "@/components/ThemeToggle";
export default function AppointmentHistory({
  appointments,
  loading,
  searchTerm,
  setSearchTerm,
  onNewAppointment,
  onAppointmentClick,
}) {
  return (
    <div className="bg-ui-card rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
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

      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))
          ) : appointments.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No appointments found
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
