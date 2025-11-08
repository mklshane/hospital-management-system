import React from "react";
import { useNavigate } from "react-router-dom";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const AppointmentRequests = ({ appointments, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-2 p-4 sm:p-6 rounded-xl shadow border bg-card flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Appointment Requests
        </h2>
        <button
          onClick={() => navigate("/admin/appointments")}
          className="text-blue-600 text-sm font-semibold hover:underline"
        >
          See All
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No pending appointment requests
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="p-2">Patient Name</th>
                  <th className="p-2">Doctor</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr
                    key={apt._id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="p-2 font-medium">
                      {apt.patient?.name || "Unknown"}
                    </td>
                    <td className="p-2">Dr. {apt.doctor?.name || "Unknown"}</td>
                    <td className="p-2">{formatDate(apt.appointment_date)}</td>
                    <td className="p-2">{apt.appointment_time}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentRequests;
