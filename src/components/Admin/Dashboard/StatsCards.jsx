import React from "react";
import { useNavigate } from "react-router-dom";

const StatsCards = ({ stats, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3">
      <div
        onClick={() => navigate("/admin/doctors")}
        className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 sm:p-6 rounded-xl shadow hover:opacity-90 transition"
      >
        <h3 className="text-base sm:text-lg font-semibold">Total Doctors</h3>
        <p className="text-2xl sm:text-3xl font-bold mt-2">
          {loading ? "..." : stats.totalDoctors}
        </p>
      </div>

      <div
        onClick={() => navigate("/admin/patients")}
        className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 sm:p-6 rounded-xl shadow hover:opacity-90 transition"
      >
        <h3 className="text-base sm:text-lg font-semibold">Total Patients</h3>
        <p className="text-2xl sm:text-3xl font-bold mt-2">
          {loading ? "..." : stats.totalPatients}
        </p>
      </div>

      <div
        onClick={() => navigate("/admin/appointments")}
        className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 sm:p-6 rounded-xl shadow hover:opacity-90 transition"
      >
        <h3 className="text-base sm:text-lg font-semibold">
          Appointments for Today
        </h3>
        <p className="text-2xl sm:text-3xl font-bold mt-2">
          {loading ? "..." : stats.todayAppointments}
        </p>
      </div>
    </div>
  );
};

export default StatsCards;
