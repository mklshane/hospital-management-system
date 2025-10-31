import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const appointmentRef = useRef(null);
  const patientsRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const logs = [
    { id: 1, message: "Dr. Juan updated his profile.", time: "10 mins ago" },
    { id: 2, message: "New patient registered: Maria Lopez.", time: "30 mins ago" },
    { id: 3, message: "Appointment #102 approved.", time: "1 hour ago" },
    { id: 4, message: "System backup completed successfully.", time: "2 hours ago" },
    { id: 5, message: "New doctor account created: Dr. Perez.", time: "3 hours ago" },
    { id: 6, message: "Patient data exported by Admin.", time: "5 hours ago" },
    { id: 7, message: "Dr. Santos updated clinic schedule.", time: "6 hours ago" },
    { id: 8, message: "New appointment requested by patient.", time: "7 hours ago" },
    { id: 9, message: "Doctor license verification completed.", time: "8 hours ago" },
    { id: 10, message: "System maintenance check scheduled.", time: "10 hours ago" },
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className={`min-h-screen flex flex-col transition-colors duration-300`}
      >
        {/* Main Content Wrapper */}
        <main className="flex-1 overflow-y-auto pb-6 grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Header Section */}
            <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md rounded-xl p-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm opacity-80">Hospital Management System</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => scrollToSection(appointmentRef)}
                  className="text-sm font-semibold hover:text-blue-900"
                >
                  Appointment Requests
                </button>
                <button
                  onClick={() => scrollToSection(patientsRef)}
                  className="text-sm font-semibold hover:text-blue-900"
                >
                  Recent Patients
                </button>
               <ThemeToggle />
              </div>
            </header>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div onClick={() => navigate("/admin/doctors")} 
                className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-xl shadow hover:opacity-90 transition">
                  <h3 className="text-lg font-semibold">Total Doctors</h3>
                  <p className="text-3xl font-bold mt-2">30</p>
              </div>

              <div onClick={() => navigate("/admin/patients")} 
                className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-xl shadow hover:opacity-90 transition">
                  <h3 className="text-lg font-semibold">Total Patients</h3>
                  <p className="text-3xl font-bold mt-2">256</p>
              </div>

              <div onClick={() => navigate("/admin/appointments")} 
                className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-xl shadow hover:opacity-90 transition">
                  <h3 className="text-lg font-semibold">Appointments for Today</h3>
                  <p className="text-3xl font-bold mt-2">142</p>
              </div>
            </div>

            {/* Chart Section */}
            <div
              className={`rounded-xl shadow p-6 bg-ui-card`}
            >
              <h2 className="text-xl font-semibold mb-4">Patient Statistics</h2>
              <div className="h-64 flex items-center justify-center text-primary">
                <p>Chart component will go here...</p>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Appointment Requests */}
              <div
                ref={appointmentRef}
                className={`p-6 rounded-xl shadow border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Appointment Requests</h3>
                  <button className="text-blue-600 text-sm font-semibold hover:underline">
                    See All
                  </button>
                </div>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr
                      className={`border-b ${
                        darkMode
                          ? "border-gray-700 text-gray-400"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      <th className="p-2">Name</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Time</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className={`border-b ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <td
                        className={`p-2 italic ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                        colSpan="4"
                      >
                        No data available
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Recent Patients */}
              <div
                ref={patientsRef}
                className={`p-6 rounded-xl shadow border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3 className="text-lg font-semibold mb-4">Recent Patients</h3>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr
                      className={`border-b ${
                        darkMode
                          ? "border-gray-700 text-gray-400"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      <th className="p-2">Name</th>
                      <th className="p-2">Gender</th>
                      <th className="p-2">Disease</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className={`border-b ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <td
                        className={`p-2 italic ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                        colSpan="4"
                      >
                        No data available
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (System Logs) */}
          <div
            className={`rounded-xl shadow py-6 px-4 flex flex-col h-[76%] bg-ui-card`}
          >
            <h2 className="text-xl font-semibold mb-4">System Logs</h2>
            <div className="max-h-[calc(100vh-150px)] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`border-l-4 pl-4 ${
                    darkMode ? "border-blue-400" : "border-blue-500"
                  }`}
                >
                  <p className="font-medium">{log.message}</p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
