import React from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Clock, Users } from 'lucide-react';

const StatsCards = ({ stats, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3">
      <div
        onClick={() => navigate("/admin/doctors")}
        className="cursor-pointer bg-linear-to-r from-blue-400 to-blue-500 text-white p-4 sm:p-6 rounded-xl shadow hover:opacity-90 transition"
      >
        <h3 className="text-base sm:text-lg font-semibold">Total Doctors</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-2xl sm:text-3xl font-bold mt-2">
            {loading ? "..." : stats.totalDoctors}
          </p>
          <Stethoscope className="w-8 h-8 opacity-90"/>
        </div>
      </div>

      <div
        onClick={() => navigate("/admin/patients")}
        className="cursor-pointer bg-linear-to-r from-blue-400 to-blue-500 text-white p-4 sm:p-6 rounded-xl shadow hover:opacity-90 transition"
      >
        <h3 className="text-base sm:text-lg font-semibold">Total Patients</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-2xl sm:text-3xl font-bold mt-2">
            {loading ? "..." : stats.totalPatients}
          </p>
          <Users className="w-8 h-8 opacity-90"/>
        </div>
      </div>

      <div
        onClick={() => navigate("/admin/appointments")}
        className="cursor-pointer bg-linear-to-r from-blue-400 to-blue-500 text-white p-4 sm:p-6 rounded-xl shadow hover:opacity-90 transition"
      >
        <h3 className="text-base sm:text-lg font-semibold">Appointments for Today</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-2xl sm:text-3xl font-bold mt-2">
            {loading ? "..." : stats.todayAppointments}
          </p> 
          <Clock className="w-8 h-8 opacity-90"/>
        </div>
      </div>
      
    </div>
  );
};

export default StatsCards;
