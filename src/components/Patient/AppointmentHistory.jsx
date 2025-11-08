import { Search, Plus } from "lucide-react";
import AppointmentCard from "./AppointmentCard";

export default function AppointmentHistory({
  appointments,
  loading,
  searchTerm,
  setSearchTerm,
  onNewAppointment,
}) {
  const filtered = appointments
    .filter((apt) => !["Pending", "Scheduled"].includes(apt.status))
    .filter((apt) => {
      const s = searchTerm.toLowerCase();
      return (
        apt.doctor?.name?.toLowerCase().includes(s) ||
        apt.appointment_date.includes(s) ||
        apt.notes?.toLowerCase().includes(s)
      );
    });

  return (
    <div className="bg-white dark:bg-[#242938] rounded-2xl shadow-sm">
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Appointment History
        </h3>
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-[#323948] rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <div
            onClick={onNewAppointment}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl h-48 flex items-center justify-center cursor-pointer hover:border-blue-400 transition"
          >
            <Plus size={48} className="text-gray-400" />
          </div>
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))
          ) : filtered.length === 0 ? (
            <p className="col-span-3 text-center text-gray-500 py-8">
              No appointments
            </p>
          ) : (
            filtered.map((apt) => <AppointmentCard key={apt._id} apt={apt} />)
          )}
        </div>
      </div>
    </div>
  );
}
