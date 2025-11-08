import { Search } from "lucide-react";
import AppointmentCard from "./AppointmentCard";
import NewAppointmentButton from "./NewAppointmentButton";

export default function AppointmentHistory({
  appointments,
  loading,
  searchTerm,
  setSearchTerm,
  onNewAppointment,
}) {
  const filteredAppointments = appointments
    .filter((apt) => apt.patient?._id === appointments[0]?.patient?._id) // current user
    .filter((apt) => {
      const search = searchTerm.toLowerCase();
      return (
        apt.doctor?.name?.toLowerCase().includes(search) ||
        new Date(apt.appointment_date)
          .toLocaleDateString()
          .toLowerCase()
          .includes(search) ||
        apt.notes?.toLowerCase().includes(search)
      );
    });

  return (
    <div className="lg:col-span-9">
      <div className="bg-ui-card rounded-2xl shadow-lg border-2 p-6 h-full min-h-[500px] flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-xl font-bold text-primary">
            Appointment History
          </h3>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for name, date, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <NewAppointmentButton onClick={onNewAppointment} />

            {loading ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 bg-gray-100 rounded-xl animate-pulse"
                />
              ))
            ) : filteredAppointments.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-12">
                No past appointments
              </p>
            ) : (
              filteredAppointments.map((apt) => (
                <AppointmentCard key={apt._id} apt={apt} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
